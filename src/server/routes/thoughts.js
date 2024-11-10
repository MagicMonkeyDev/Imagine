const express = require('express');
const router = express.Router();
const Thought = require('../models/Thought');

// Get all thoughts (sorted by upvotes)
router.get('/thoughts', async (req, res) => {
  try {
    const thoughts = await Thought.find()
      .sort({ upvotes: -1 })
      .limit(50);
    res.json(thoughts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upvote a thought
router.post('/thoughts/:id/upvote', async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id);
    thought.upvotes += 1;
    await thought.save();
    res.json(thought);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 