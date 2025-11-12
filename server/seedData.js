/**
 * Seed Data Script for LingoQuest
 * Creates initial lessons and admin user for development
 * Run: node seedData.js
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");
const Lesson = require("./models/Lesson");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ MongoDB connected for seeding");
    } catch (e) {
        console.error("❌ MongoDB connection error:", e);
        process.exit(1);
    }
};

const seedLessons = async () => {
    try {
        // Check if lessons already exist
        const count = await Lesson.countDocuments();
        if (count > 0) {
            console.log(`⏭️  Skipping lessons seed: ${count} lessons already exist`);
            return;
        }

        const lessonData = [
            {
                title: "Spanish Basics - Greetings",
                content: "Learn how to greet people in Spanish and introduce yourself.",
                language: "Spanish",
                level: "beginner",
                xp: 50,
                exercises: [
                    {
                        question: "How do you say 'Hello' in Spanish?",
                        options: ["Hola", "Buenos días", "¿Qué tal?", "Buenas noches"],
                        answer: "Hola",
                        type: "mcq",
                    },
                    {
                        question: "Fill in: '_____ me llamo John' (My name is John)",
                        options: ["Me", "Mi", "Yo", "El"],
                        answer: "Me",
                        type: "fill",
                    },
                    {
                        question: "How do you formally say 'Good morning'?",
                        options: ["Buenos días", "Hola día", "Día bueno", "Mañana buena"],
                        answer: "Buenos días",
                        type: "mcq",
                    },
                ],
            },
            {
                title: "Spanish Basics - Common Phrases",
                content: "Master everyday Spanish phrases for daily communication.",
                language: "Spanish",
                level: "beginner",
                xp: 50,
                exercises: [
                    {
                        question: "How do you say 'Thank you' in Spanish?",
                        options: ["Gracias", "Por favor", "De nada", "Lo siento"],
                        answer: "Gracias",
                        type: "mcq",
                    },
                    {
                        question: "'No ______' means 'Don't worry'",
                        options: ["preocupes", "importa", "pasa", "hay"],
                        answer: "preocupes",
                        type: "fill",
                    },
                ],
            },
            {
                title: "French Intermediate - Conversation",
                content: "Practice intermediate French conversation skills.",
                language: "French",
                level: "intermediate",
                xp: 75,
                exercises: [
                    {
                        question: "How do you ask 'How are you?' formally in French?",
                        options: ["Comment allez-vous?", "Ça va?", "Comment vas-tu?", "Tu vas bien?"],
                        answer: "Comment allez-vous?",
                        type: "mcq",
                    },
                ],
            },
            {
                title: "German Advanced - Business Communication",
                content: "Learn professional German for business contexts.",
                language: "German",
                level: "advanced",
                xp: 100,
                exercises: [
                    {
                        question: "In German business, 'Geschäftspartner' means?",
                        options: ["Business partner", "Business meeting", "Business plan", "Businessman"],
                        answer: "Business partner",
                        type: "mcq",
                    },
                ],
            },
            {
                title: "Hindi Beginner - Numbers",
                content: "Learn to count and recognize numbers in Hindi.",
                language: "Hindi",
                level: "beginner",
                xp: 50,
                exercises: [
                    {
                        question: "How do you say 'One' in Hindi?",
                        options: ["एक (Ek)", "दो (Do)", "तीन (Teen)", "चार (Char)"],
                        answer: "एक (Ek)",
                        type: "mcq",
                    },
                ],
            },
            {
                title: "Japanese Beginner - Hiragana",
                content: "Introduction to Japanese Hiragana script.",
                language: "Japanese",
                level: "beginner",
                xp: 60,
                exercises: [
                    {
                        question: "Which hiragana represents 'a'?",
                        options: ["あ", "い", "う", "え"],
                        answer: "あ",
                        type: "mcq",
                    },
                ],
            },
            {
                title: "Italian Beginner - Food & Dining",
                content: "Learn Italian vocabulary related to food and restaurants.",
                language: "Italian",
                level: "beginner",
                xp: 50,
                exercises: [
                    {
                        question: "What does 'Buon appetito' mean?",
                        options: ["Good appetite", "Good morning", "Good evening", "Enjoy the meal"],
                        answer: "Good appetite",
                        type: "mcq",
                    },
                ],
            },
        ];

        await Lesson.insertMany(lessonData);
        console.log(`✅ Seeded ${lessonData.length} lessons`);
    } catch (e) {
        console.error("❌ Error seeding lessons:", e.message);
    }
};

const seedAdminUser = async () => {
    try {
        // Check if admin already exists
        const adminExists = await User.findOne({ role: "admin" });
        if (adminExists) {
            console.log(`⏭️  Admin user already exists: ${adminExists.username}`);
            return;
        }

        const hashedPassword = await bcrypt.hash("admin123", 10);
        const adminUser = new User({
            username: "admin",
            email: "admin@lingoquest.com",
            password: hashedPassword,
            role: "admin",
            xp: 1000,
            streak: 30,
            coins: 5000,
            languages: ["Spanish", "French", "German"],
            currentLanguage: "Spanish",
            proficiency: "advanced",
        });

        await adminUser.save();
        console.log("✅ Admin user created (email: admin@lingoquest.com, password: admin123)");
    } catch (e) {
        console.error("❌ Error seeding admin user:", e.message);
    }
};

const seedSampleUsers = async () => {
    try {
        // Check if sample users already exist
        const count = await User.countDocuments({ role: "user" });
        if (count > 0) {
            console.log(`⏭️  Sample users already exist: ${count} users found`);
            return;
        }

        const sampleUsers = [
            {
                username: "langchampion",
                email: "champion@example.com",
                password: await bcrypt.hash("password123", 10),
                xp: 2500,
                streak: 45,
                coins: 1200,
                avatar: "https://i.pravatar.cc/150?img=1",
                languages: ["Spanish", "French"],
                currentLanguage: "Spanish",
                role: "user",
            },
            {
                username: "polyglot_pete",
                email: "pete@example.com",
                password: await bcrypt.hash("password123", 10),
                xp: 1800,
                streak: 28,
                coins: 850,
                avatar: "https://i.pravatar.cc/150?img=2",
                languages: ["German", "Italian", "Japanese"],
                currentLanguage: "German",
                role: "user",
            },
            {
                username: "spanish_seeker",
                email: "spanish@example.com",
                password: await bcrypt.hash("password123", 10),
                xp: 950,
                streak: 15,
                coins: 450,
                avatar: "https://i.pravatar.cc/150?img=3",
                languages: ["Spanish"],
                currentLanguage: "Spanish",
                role: "user",
            },
            {
                username: "french_friend",
                email: "french@example.com",
                password: await bcrypt.hash("password123", 10),
                xp: 3200,
                streak: 60,
                coins: 1600,
                avatar: "https://i.pravatar.cc/150?img=4",
                languages: ["French", "Spanish", "Hindi"],
                currentLanguage: "French",
                role: "user",
            },
            {
                username: "linguistics_lab",
                email: "lab@example.com",
                password: await bcrypt.hash("password123", 10),
                xp: 2100,
                streak: 35,
                coins: 980,
                avatar: "https://i.pravatar.cc/150?img=5",
                languages: ["German", "French", "Italian"],
                currentLanguage: "German",
                role: "user",
            },
        ];

        await User.insertMany(sampleUsers);
        console.log(`✅ Seeded ${sampleUsers.length} sample users`);
        console.log("📧 Sample user email: champion@example.com (password: password123)");
    } catch (e) {
        console.error("❌ Error seeding sample users:", e.message);
    }
};

const seed = async () => {
    await connectDB();
    console.log("\n🌱 Starting database seeding...\n");

    await seedLessons();
    await seedAdminUser();
    await seedSampleUsers();

    console.log("\n✅ Seeding complete!\n");
    await mongoose.disconnect();
    console.log("Database connection closed.");
};

seed().catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
});
