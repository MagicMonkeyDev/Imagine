const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const OpenAI = require('openai');
const path = require('path');
require('dotenv').config();

const app = express();

// Add console log to debug static files
console.log('Static directory:', path.join(__dirname, '../../public'));
app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.json());

// Add a test route
app.get('/test', (req, res) => {
    res.send('Server is working!');
});

// Initialize SQLite database
const db = new sqlite3.Database('thoughts.db', (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database');
    }
});

// Create thoughts table
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS thoughts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        upvotes INTEGER DEFAULT 0
    )`);
});

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Generate AI thought
async function generateThought() {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{
                role: "user",
                content: "Generate a brief, unique thought about how the world might end. Be creative and philosophical. Keep it under 200 characters."
            }],
        });
        return completion.choices[0].message.content;
    } catch (error) {
        console.error('Error generating thought:', error);
        return null;
    }
}

// API Routes
app.get('/api/thoughts', (req, res) => {
    db.all('SELECT * FROM thoughts ORDER BY timestamp DESC LIMIT 50', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/api/thoughts/upvote/:id', (req, res) => {
    db.run('UPDATE thoughts SET upvotes = upvotes + 1 WHERE id = ?', 
        [req.params.id], 
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ success: true });
        });
});

// Generate new thought every 5 minutes
setInterval(async () => {
    const thought = await generateThought();
    if (thought) {
        db.run('INSERT INTO thoughts (content) VALUES (?)', [thought], (err) => {
            if (err) {
                console.error('Error saving thought:', err);
            } else {
                console.log('New thought generated and saved');
            }
        });
    }
}, 5 * 60 * 1000);

// Try multiple ports
const tryPort = (port) => {
    app.listen(port, () => {
        console.log(`Server successfully running on port ${port}`);
        console.log(`Visit http://localhost:${port} to view the website`);
    }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`Port ${port} is busy, trying ${port + 1}`);
            tryPort(port + 1);
        }
    });
};

// Start with port 3000
tryPort(3000);