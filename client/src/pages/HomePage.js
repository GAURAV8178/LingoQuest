import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./HomePage.css";

/**
 * HomePage Component
 * Landing page with animated introduction and CTA to language selection
 * Uses Framer Motion for smooth entrance animations
 */
export default function HomePage() {
    const containerVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    };

    const headerVariants = {
        hidden: { scale: 0.8, y: -40 },
        visible: { scale: 1, y: 0, transition: { duration: 0.8, delay: 0.2 } },
    };

    const subheaderVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 1, delay: 0.5 } },
    };

    const ctaVariants = {
        hidden: { opacity: 0, scale: 0.7 },
        visible: { opacity: 1, scale: 1, transition: { duration: 1.2, delay: 0.8 } },
    };

    const illustrationVariants = {
        hidden: { x: 100, opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { delay: 1, duration: 1 } },
    };

    return (
        <motion.div
            className="main-bg"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <header>
                <motion.h1
                    variants={headerVariants}
                    initial="hidden"
                    animate="visible"
                    style={{
                        fontSize: "4rem",
                        color: "#53d365",
                        letterSpacing: "2px",
                        marginBottom: "20px",
                    }}
                >
                    LingoQuest
                </motion.h1>

                <motion.p
                    variants={subheaderVariants}
                    initial="hidden"
                    animate="visible"
                    style={{
                        fontSize: "1.3rem",
                        marginBottom: "30px",
                    }}
                >
                    A gamified adventure for language mastery!
                </motion.p>

                <Link to="/select-language" style={{ textDecoration: "none" }}>
                    <motion.button
                        className="cta-btn"
                        variants={ctaVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        Start Your Journey 🚀
                    </motion.button>
                </Link>
            </header>

            <motion.div
                className="hero-illustration"
                variants={illustrationVariants}
                initial="hidden"
                animate="visible"
            >
                <img
                    src="/assets/language_avatar.svg"
                    alt="Learn languages"
                    style={{ height: 240, maxWidth: "100%" }}
                />
            </motion.div>
        </motion.div>
    );
}