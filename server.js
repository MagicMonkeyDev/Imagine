require('dotenv').config();
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/apocalypse-journal';

// Ensure tmp directory exists
const dbDir = '/tmp';
if (!fs.existsSync(dbDir)){
    fs.mkdirSync(dbDir, { recursive: true });
}

const prisma = new PrismaClient();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.use(express.static('public'));
app.use(express.json());

// Get popular entries
app.get('/api/entries/popular', async (req, res) => {
    const entries = await prisma.entry.findMany({
        orderBy: {
            votes: 'desc'
        },
        take: 10
    });
    res.json(entries);
});

// Get recent entries
app.get('/api/entries/recent', async (req, res) => {
    const entries = await prisma.entry.findMany({
        orderBy: {
            timestamp: 'desc'
        },
        take: 10
    });
    res.json(entries);
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

        const entry = await prisma.entry.create({
            data: {
                content: completion.choices[0].message.content
            }
        });
        res.json(entry);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to generate entry' });
    }
});

// Vote
app.post('/api/entries/:id/vote', async (req, res) => {
    try {
        const entry = await prisma.entry.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        });
        if (!entry) {
            return res.status(404).json({ error: 'Entry not found' });
        }
        const updatedEntry = await prisma.entry.update({
            where: {
                id: entry.id
            },
            data: {
                votes: entry.votes + req.body.value
            }
        });
        res.json(updatedEntry);
    } catch (error) {
        console.error('Failed to vote:', error);
        res.status(500).json({ error: 'Failed to vote' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 