import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./LessonPage.css";

/**
 * LessonsListPage Component
 * Displays all available lessons grouped by language
 */
export default function LessonsListPage() {
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ language: "", level: "" });

    useEffect(() => {
        fetchLessons();
    }, []);

    const fetchLessons = async () => {
        try {
            let url = "http://localhost:5000/api/lessons";
            const params = new URLSearchParams();
            if (filter.language) params.append("language", filter.language);
            if (filter.level) params.append("level", filter.level);
            if (params.toString()) url += "?" + params.toString();

            const res = await fetch(url);
            const data = await res.json();
            setLessons(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to fetch lessons:", err);
            setLessons([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (type, value) => {
        const newFilter = { ...filter, [type]: value };
        setFilter(newFilter);
        
        // Fetch with new filter
        let url = "http://localhost:5000/api/lessons";
        const params = new URLSearchParams();
        if (newFilter.language) params.append("language", newFilter.language);
        if (newFilter.level) params.append("level", newFilter.level);
        if (params.toString()) url += "?" + params.toString();

        fetch(url)
            .then((res) => res.json())
            .then((data) => setLessons(Array.isArray(data) ? data : []))
            .catch(() => setLessons([]));
    };

    // Group lessons by language
    const groupedLessons = lessons.reduce((acc, lesson) => {
        const lang = lesson.language || "Other";
        if (!acc[lang]) acc[lang] = [];
        acc[lang].push(lesson);
        return acc;
    }, {});

    if (loading) return <div className="lesson-page"><div className="lesson-loading">Loading lessons...</div></div>;

    return (
        <div className="lesson-page">
            <div className="lesson-container" style={{ maxWidth: "1000px" }}>
                <h1>📚 Available Lessons</h1>

                <div className="filters" style={{ marginBottom: "30px", display: "flex", gap: "15px", flexWrap: "wrap" }}>
                    <div>
                        <label style={{ marginRight: "8px", fontWeight: "bold" }}>Language:</label>
                        <select 
                            value={filter.language} 
                            onChange={(e) => handleFilterChange("language", e.target.value)}
                            style={{ padding: "8px", borderRadius: "8px", border: "1px solid #ddd" }}
                        >
                            <option value="">All Languages</option>
                            <option value="Spanish">Spanish</option>
                            <option value="French">French</option>
                            <option value="German">German</option>
                            <option value="Hindi">Hindi</option>
                            <option value="Japanese">Japanese</option>
                            <option value="Italian">Italian</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ marginRight: "8px", fontWeight: "bold" }}>Level:</label>
                        <select 
                            value={filter.level} 
                            onChange={(e) => handleFilterChange("level", e.target.value)}
                            style={{ padding: "8px", borderRadius: "8px", border: "1px solid #ddd" }}
                        >
                            <option value="">All Levels</option>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                    </div>
                </div>

                {lessons.length === 0 ? (
                    <p style={{ textAlign: "center", color: "#666" }}>No lessons found. Try different filters.</p>
                ) : (
                    <div className="lessons-grid">
                        {Object.entries(groupedLessons).map(([language, langLessons]) => (
                            <div key={language} style={{ marginBottom: "40px" }}>
                                <h2 style={{ color: "#53d365", marginBottom: "15px" }}>
                                    {language}
                                </h2>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
                                    {langLessons.map((lesson) => (
                                        <Link 
                                            key={lesson._id} 
                                            to={`/lesson/${lesson._id}`}
                                            style={{ textDecoration: "none" }}
                                        >
                                            <div className="lesson-card" style={{
                                                background: "white",
                                                padding: "20px",
                                                borderRadius: "12px",
                                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                                cursor: "pointer",
                                                transition: "transform 0.2s, box-shadow 0.2s",
                                                border: "2px solid transparent"
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = "translateY(-4px)";
                                                e.currentTarget.style.boxShadow = "0 4px 16px rgba(83,211,101,0.3)";
                                                e.currentTarget.style.borderColor = "#53d365";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = "translateY(0)";
                                                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                                                e.currentTarget.style.borderColor = "transparent";
                                            }}
                                            >
                                                <h3 style={{ color: "#333", marginBottom: "10px", fontSize: "1.2rem" }}>
                                                    {lesson.title}
                                                </h3>
                                                <p style={{ color: "#666", marginBottom: "12px", fontSize: "0.95rem" }}>
                                                    {lesson.content}
                                                </p>
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                    <span style={{
                                                        background: lesson.level === "beginner" ? "#e3f2fd" : 
                                                                   lesson.level === "intermediate" ? "#fff3e0" : "#fce4ec",
                                                        color: lesson.level === "beginner" ? "#1976d2" : 
                                                               lesson.level === "intermediate" ? "#f57c00" : "#c2185b",
                                                        padding: "4px 12px",
                                                        borderRadius: "12px",
                                                        fontSize: "0.85rem",
                                                        fontWeight: "600",
                                                        textTransform: "capitalize"
                                                    }}>
                                                        {lesson.level}
                                                    </span>
                                                    <span style={{ color: "#53d365", fontWeight: "bold" }}>
                                                        ⭐ {lesson.xp} XP
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
