const User = require('../models/User');

exports.adminMiddleware = async(req, res, next) => {
    try {
        // authMiddleware should have set req.user.id
        const userId = req.user && req.user.id;
        if (!userId) return res.status(401).json({ error: 'No user id in token' });
        const user = await User.findById(userId).select('role');
        if (user && user.role === 'admin') return next();
        return res.status(403).json({ error: 'Admin access only' });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
};