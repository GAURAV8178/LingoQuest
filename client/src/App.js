import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import LessonPage from "./pages/LessonPage";
import ProfilePage from "./pages/ProfilePageFixed";
import LeaderboardPage from "./pages/LeaderboardPage";
import AdminDashboard from "./pages/AdminDashboard";
import LanguageSelectPage from "./pages/LanguageSelectPage";
import Navbar from "./components/Navbar";
import "./styles/theme.css";

/**
 * Main App Component
 * Sets up routing for the entire LingoQuest application
 */
function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/lesson/:id" element={<LessonPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/select-language" element={<LanguageSelectPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;