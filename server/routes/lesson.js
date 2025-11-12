const express = require('express');
const router = express.Router();
const { getLessons, getLessonById, completeLesson } = require('../controllers/lessonController');
const { authMiddleware } = require('../middleware/auth');

router.get('/', getLessons);
router.get('/:id', getLessonById);
router.post('/complete', authMiddleware, completeLesson);

module.exports = router;