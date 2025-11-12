const Lesson = require("../models/Lesson");
const User = require("../models/User");

exports.getLessons = async(req, res) => {
    try {
        const filter = {};
        if (req.query.language) filter.language = req.query.language;
        if (req.query.level) filter.level = req.query.level;
        const lessons = await Lesson.find(filter);
        res.json(lessons);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

exports.getLessonById = async(req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);
        if (!lesson) return res.status(404).json({ error: "Lesson not found" });
        res.json(lesson);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

exports.completeLesson = async(req, res) => {
    try {
        const { lessonId } = req.body;
        const userId = req.user.id;

        const lesson = await Lesson.findById(lessonId);
        if (!lesson) return res.status(404).json({ error: "Lesson not found" });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        // Add XP from lesson
        user.xp += lesson.xp || 10;

        // Update streak using precise Date arithmetic and maintain history
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterdayStart = new Date(todayStart);
        yesterdayStart.setDate(yesterdayStart.getDate() - 1);

        // If there is a legacy lastCompletedDate (string), try to populate lastActive for continuity
        if (!user.lastActive && user.lastCompletedDate) {
            const parsedLegacy = new Date(user.lastCompletedDate);
            if (!isNaN(parsedLegacy)) {
                user.lastActive = parsedLegacy;
            }
        }

        let lastActiveStart = null;
        if (user.lastActive) {
            const d = new Date(user.lastActive);
            lastActiveStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        }

        // If user hasn't already completed a lesson today, update streak
        if (!lastActiveStart || lastActiveStart.getTime() < todayStart.getTime()) {
            if (lastActiveStart && lastActiveStart.getTime() === yesterdayStart.getTime()) {
                // consecutive day
                user.streak = (user.streak || 0) + 1;
            } else {
                // missed day or first-time -> reset to 1
                user.streak = 1;
            }

            // push today's normalized date into streakHistory
            user.streakHistory = user.streakHistory || [];
            user.streakHistory.push(todayStart);

            // update legacy field as well for older clients
            user.lastCompletedDate = todayStart.toDateString();
        }

        // always update lastActive to now
        user.lastActive = todayStart;

        // Add coins as reward
        user.coins += Math.floor((lesson.xp || 10) / 2);

        // Update user's progress for this lesson
        user.progress = user.progress || [];
        const lessonIdStr = String(lesson._id);
        const existingProg = user.progress.find(p => String(p.lessonId) === lessonIdStr);
        if (!existingProg) {
            user.progress.push({ lessonId: lesson._id, completed: true, completedAt: new Date() });
        } else {
            existingProg.completed = true;
            existingProg.completedAt = new Date();
        }

        await user.save();

        // prepare user object without password for response
        const userObj = user.toObject ? user.toObject() : user;
        if (userObj.password) delete userObj.password;

        res.json({
            message: "Lesson completed!",
            xpGained: lesson.xp || 10,
            user: userObj
        });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};