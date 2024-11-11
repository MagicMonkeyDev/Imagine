const express = require('express');
const { Redis } = require('@upstash/redis');
const OpenAI = require('openai');
const app = express();

// Remove dotenv and initialize Redis and OpenAI directly
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.use(express.static('public'));
app.use(express.json());

// Get popular entries
app.get('/api/entries/popular', async (req, res) => {
    try {
        const entries = await redis.zrange('popular_entries', 0, 9, { rev: true });
        res.json(entries);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch entries' });
    }
});

// Get recent entries
app.get('/api/entries/recent', async (req, res) => {
    try {
        const entries = await redis.lrange('recent_entries', 0, 9);
        res.json(entries);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch entries' });
    }
});

// Generate new entry
app.post('/api/entries/generate', async (req, res) => {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{
                role: "system",
                content: "You are an AI that writes journal entries about possible ways the world could end. Be creative and detailed, but keep entries between 2-4 sentences."
            }, {
                role: "user",
                content: "Write a new journal entry about how the world might end."
            }]
        });

        const entry = {
            id: Date.now().toString(),
            content: completion.choices[0].message.content,
            timestamp: new Date().toISOString(),
            votes: 0
        };

        // Save to recent entries
        await redis.lpush('recent_entries', entry);
        // Trim to keep only last 100 entries
        await redis.ltrim('recent_entries', 0, 99);

        // Add to sorted set for popular entries
        await redis.zadd('popular_entries', { score: 0, member: JSON.stringify(entry) });

        res.json(entry);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to generate entry' });
    }
});

// Vote on entry
app.post('/api/entries/:id/vote', async (req, res) => {
    try {
        const { id } = req.params;
        const { value } = req.body;
        
        // Update vote in sorted set
        const entry = await redis.zrange('popular_entries', 0, -1, { 
            withScores: true,
            by: 'score'
        }).find(e => JSON.parse(e).id === id);

        if (entry) {
            const updatedEntry = {
                ...JSON.parse(entry),
                votes: (JSON.parse(entry).votes || 0) + value
            };
            
            await redis.zadd('popular_entries', { 
                score: updatedEntry.votes,
                member: JSON.stringify(updatedEntry)
            });
        }

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update vote' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 