const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: "" }, // URL or SVG for avatar
    languages: { type: [String], default: [] }, // e.g., ["Spanish"]
    xp: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    coins: { type: Number, default: 0 },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    // Track daily streak with precise dates and history
    lastActive: { type: Date }, // last day the user was active (lesson completed)
    streakHistory: { type: [Date], default: [] }, // list of days (Date) when user maintained streak
    lastCompletedDate: { type: String, default: "" }, // legacy field (kept for backward-compat)
    // Track progress per lesson
    progress: [{
        lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
        completed: { type: Boolean, default: false },
        completedAt: Date
    }],
    // current selected learning language and proficiency
    currentLanguage: { type: String, default: "" },
    proficiency: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);