import React, { useEffect, useState } from "react";
import "./LeaderboardPage.css";

export default function LeaderboardPage() {
    const [board, setBoard] = useState({ topXP: [], topStreak: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("xp");

    useEffect(() => {
        fetch("http://localhost:5000/api/users/leaderboard")
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    setError(data.error);
                } else {
                    setBoard(data);
                }
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to load leaderboard");
                setLoading(false);
            });
    }, []);

    const getMedalIcon = (rank) => {
        if (rank === 1) return "🥇";
        if (rank === 2) return "🥈";
        if (rank === 3) return "🥉";
        return `#${rank}`;
    };

    if (loading) {
        return (
            <div className="leaderboard-page">
                <div className="leaderboard-container">
                    <p className="loading">Loading leaderboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="leaderboard-page">
            <div className="leaderboard-container">
                <div className="leaderboard-header">
                    <h1>🏆 Leaderboard</h1>
                    <p className="subtitle">Compete and climb the ranks!</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="tab-buttons">
                    <button className={`tab-btn ${activeTab === "xp" ? "active" : ""}`} onClick={() => setActiveTab("xp")}>⭐ Top XP</button>
                    <button className={`tab-btn ${activeTab === "streak" ? "active" : ""}`} onClick={() => setActiveTab("streak")}>🔥 Top Streaks</button>
                </div>

                {activeTab === "xp" && (
                    <div className="leaderboard-section">
                        <h2>Top XP Earners</h2>
                        <ol className="leaderboard-list">
                            {board.topXP.length > 0 ? (
                                board.topXP.map((user, index) => (
                                    <li key={user._id} className="leaderboard-item">
                                        <div className="rank-medal">{getMedalIcon(index + 1)}</div>
                                        <img src={user.avatar || "/default-avatar.svg"} alt="avatar" className="leaderboard-avatar" />
                                        <div className="user-info">
                                            <span className="username">{user.username}</span>
                                            <span className="user-meta">{user.streak > 0 && <span className="streak">🔥{user.streak} day streak</span>}</span>
                                        </div>
                                        <div className="user-stats">
                                            <div className="stat-item">
                                                <span className="stat-value">{user.xp}</span>
                                                <span className="stat-label">XP</span>
                                            </div>
                                            <div className="stat-item">
                                                <span className="stat-value">{user.coins}</span>
                                                <span className="stat-label">💰</span>
                                            </div>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <p className="no-data">No users yet!</p>
                            )}
                        </ol>
                    </div>
                )}

                {activeTab === "streak" && (
                    <div className="leaderboard-section">
                        <h2>Top Streaks 🔥</h2>
                        <ol className="leaderboard-list">
                            {board.topStreak.length > 0 ? (
                                board.topStreak.map((user, index) => (
                                    <li key={user._id} className="leaderboard-item">
                                        <div className="rank-medal">{getMedalIcon(index + 1)}</div>
                                        <img src={user.avatar || "/default-avatar.svg"} alt="avatar" className="leaderboard-avatar" />
                                        <div className="user-info">
                                            <span className="username">{user.username}</span>
                                            <span className="user-meta"><span className="xp-info">⭐{user.xp} XP</span></span>
                                        </div>
                                        <div className="user-stats">
                                            <div className="stat-item">
                                                <span className="stat-value">{user.streak}</span>
                                                <span className="stat-label">Days</span>
                                            </div>
                                            <div className="stat-item">
                                                <span className="stat-value">{user.coins}</span>
                                                <span className="stat-label">💰</span>
                                            </div>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <p className="no-data">No users yet!</p>
                            )}
                        </ol>
                    </div>
                )}
            </div>
        </div>
    );
}