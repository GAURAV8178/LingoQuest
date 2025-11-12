const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, getLeaderboard } = require('../controllers/userController');
const { authMiddleware } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authMiddleware, getProfile);
router.patch('/profile', authMiddleware, updateProfile);
router.get('/leaderboard', getLeaderboard);

module.exports = router;