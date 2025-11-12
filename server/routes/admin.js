const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { adminMiddleware } = require('../middleware/admin');
const Lesson = require('../models/Lesson');
const User = require('../models/User');

// Create lesson
router.post('/lesson', authMiddleware, adminMiddleware, async(req, res) => {
    try {
        const lesson = new Lesson(req.body);
        await lesson.save();
        res.json({ message: "Lesson created", lesson });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

// Get all users/progress
router.get('/users', authMiddleware, adminMiddleware, async(req, res) => {
    try {
        const users = await User.find().select('username xp streak progress role');
        res.json(users);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

// Get all lessons
router.get('/lesson', authMiddleware, adminMiddleware, async(req, res) => {
    try {
        const lessons = await Lesson.find();
        res.json(lessons);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

// Delete lesson
router.delete('/lesson/:id', authMiddleware, adminMiddleware, async(req, res) => {
    try {
        await Lesson.findByIdAndDelete(req.params.id);
        res.json({ message: "Lesson deleted" });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

module.exports = router;