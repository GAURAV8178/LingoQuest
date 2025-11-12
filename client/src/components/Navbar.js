import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/theme.css";

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
    };

    return (
        <nav className="navbar">
            <Link className="logo" to="/">
                LingoQuest
            </Link>
            <div className="nav-links">
                <Link to="/lesson/1">Lessons</Link>
                <Link to="/leaderboard">🏆 Leaderboard</Link>
                {isLoggedIn ? (
                    <>
                        <Link to="/profile">Profile</Link>
                        <button className="logout-btn" onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
}