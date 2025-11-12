import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const LANGS = ["English", "Spanish", "French", "German", "Hindi", "Japanese", "Italian"];

/**
 * LanguageSelectPage Component
 * Allows authenticated users to select a learning language
 * Fetches appropriate lessons based on selected language
 */
export default function LanguageSelectPage() {
    const [selected, setSelected] = useState("");
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const handleChoose = async () => {
        if (!token) return navigate("/login");

        setLoading(true);
        try {
            // Update user profile with selected language
            await fetch("http://localhost:5000/api/users/profile", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify({ language: selected, currentLanguage: selected }),
            });

            // Fetch lessons for this language at intermediate level
            const res = await fetch(
                `http://localhost:5000/api/lessons?language=${encodeURIComponent(selected)}&level=intermediate`
            );
            const lessons = await res.json();

            if (Array.isArray(lessons) && lessons.length > 0) {
                window.location.href = `/lesson/${lessons[0]._id}`;
            } else {
                // Fallback: redirect to home if no lessons found
                window.location.href = "/";
            }
        } catch (e) {
            console.error("Language selection error:", e);
            setLoading(false);
            alert("Failed to select language. Please try again.");
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    };

    return (
        <motion.div
            className="language-select-page"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <h2>Select a Language to Learn 🌍</h2>

            <motion.ul className="language-list">
                {LANGS.map((lang) => (
                    <motion.li key={lang} variants={itemVariants}>
                        <button
                            className={`lang-btn ${selected === lang ? "selected" : ""}`}
                            onClick={() => setSelected(lang)}
                            disabled={loading}
                        >
                            {lang}
                        </button>
                    </motion.li>
                ))}
            </motion.ul>

            <motion.button
                disabled={!selected || loading}
                onClick={handleChoose}
                className="start-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                {loading ? "Loading..." : "Start Learning 🚀"}
            </motion.button>
        </motion.div>
    );
}