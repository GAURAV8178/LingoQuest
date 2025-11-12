const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    title: String,
    content: String,
    language: { type: String, default: "English" },
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    exercises: [{
        question: String,
        options: [String],
        answer: String,
        type: { type: String, enum: ["mcq", "fill", "audio", "speaking"], default: "mcq" },
        // optional fields for certain types
        audioUrl: String
    }],
    xp: Number
});

module.exports = mongoose.model('Lesson', lessonSchema);