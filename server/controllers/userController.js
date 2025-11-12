const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async(req, res) => {
    const { username, email, password } = req.body;
    try {
        const hash = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hash });
        await user.save();
        res.status(201).json({ message: "User registered" });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

exports.login = async(req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
        // include role in token for convenience, but adminMiddleware will verify role from DB
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token });
    } else {
        res.status(401).json({ error: "Invalid credentials" });
    }
};

exports.getProfile = async(req, res) => {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
};

exports.updateProfile = async(req, res) => {
    try {
        const { avatar, languages, language, currentLanguage, proficiency } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (avatar) user.avatar = avatar;
        if (Array.isArray(languages)) user.languages = languages;
        if (language) {
            if (!user.languages.includes(language)) user.languages.push(language);
            user.currentLanguage = language;
        }
        if (currentLanguage) user.currentLanguage = currentLanguage;
        if (proficiency) user.proficiency = proficiency;

        await user.save();
        const out = user.toObject();
        delete out.password;
        res.json(out);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

exports.getLeaderboard = async(req, res) => {
    try {
        const topXP = await User.find({})
            .sort({ xp: -1 })
            .limit(10)
            .select("username xp streak avatar coins");

        const topStreak = await User.find({})
            .sort({ streak: -1 })
            .limit(10)
            .select("username xp streak avatar coins");

        res.json({ topXP, topStreak });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};