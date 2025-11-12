import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./LessonPage.css";

export default function LessonPage() {
    const { id } = useParams();
    const [lesson, setLesson] = useState(null);
    const [currentExercise, setCurrentExercise] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [fillAnswer, setFillAnswer] = useState("");
    const [speakingRecorded, setSpeakingRecorded] = useState(false);
    const [showCompletionModal, setShowCompletionModal] = useState(false);
    const [completionData, setCompletionData] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:5000/api/lessons/${id}`)
            .then((res) => res.json())
            .then((data) => setLesson(data))
            .catch(() => setLesson(null));
    }, [id]);

    const handleCompleteLesson = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please login to complete lessons");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/lessons/complete", {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ lessonId: id }),
            });
            const data = await res.json();
            if (data.error) {
                alert(data.error);
            } else {
                setCompletionData(data);
                setShowCompletionModal(true);
            }
        } catch (err) {
            alert("Failed to complete lesson");
        }
    };

    if (!lesson) return <div className="lesson-loading">Loading...</div>;

    const ex = lesson.exercises?.[currentExercise] || {};
    const type = ex.type || "mcq";

    return (
        <div className="lesson-page">
            <div className="lesson-container">
                <h1>{lesson.title}</h1>
                <div className="lesson-content">
                    <p>{lesson.content}</p>
                </div>

                {lesson.exercises && lesson.exercises.length > 0 && (
                    <div className="exercises-section">
                        <h3>
                            Exercises ({currentExercise + 1}/{lesson.exercises.length})
                        </h3>

                        <div className="exercise-card">
                            {type === "mcq" && (
                                <div>
                                    <p className="exercise-question">{ex.question}</p>
                                    <div className="exercise-options">
                                        {(ex.options || []).map((option, idx) => (
                                            <button
                                                key={idx}
                                                className={`option-btn ${selectedOption === idx ? "selected" : ""}`}
                                                onClick={() => setSelectedOption(idx)}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {type === "fill" && (
                                <div>
                                    <p className="exercise-question">{ex.question}</p>
                                    <input
                                        className="fill-input"
                                        value={fillAnswer}
                                        onChange={(e) => setFillAnswer(e.target.value)}
                                        placeholder="Type your answer"
                                    />
                                </div>
                            )}

                            {type === "audio" && (
                                <div>
                                    <p className="exercise-question">{ex.question}</p>
                                    {ex.audioUrl ? (
                                        <audio controls src={ex.audioUrl} />
                                    ) : (
                                        <p className="muted">No audio available for this exercise.</p>
                                    )}
                                </div>
                            )}

                            {type === "speaking" && (
                                <div>
                                    <p className="exercise-question">{ex.question}</p>
                                    <div className="speaking-controls">
                                        <button onClick={() => setSpeakingRecorded(true)}>Record Answer (placeholder)</button>
                                        {speakingRecorded && <p className="muted">Recording saved (demo)</p>}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="exercise-nav">
                            <button
                                className="nav-btn"
                                onClick={() => setCurrentExercise(Math.max(0, currentExercise - 1))}
                                disabled={currentExercise === 0}
                            >
                                ← Previous
                            </button>

                            {currentExercise < lesson.exercises.length - 1 ? (
                                <button className="nav-btn" onClick={() => setCurrentExercise(currentExercise + 1)}>
                                    Next →
                                </button>
                            ) : (
                                <button className="complete-btn" onClick={handleCompleteLesson}>
                                    Complete Lesson ✓
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {showCompletionModal && completionData && (
                    <div className="modal-overlay" onClick={() => setShowCompletionModal(false)}>
                        <div className="completion-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-content">
                                <div className="celebration-emoji">🎉</div>
                                <h2>Lesson Completed!</h2>

                                <div className="xp-reward">
                                    <div className="xp-box">
                                        <span className="xp-icon">⭐</span>
                                        <div className="xp-text">
                                            <p className="xp-label">XP Earned</p>
                                            <p className="xp-value">+{completionData.xpGained}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="user-stats-modal">
                                    <div className="stat-box">
                                        <span className="stat-icon">⭐</span>
                                        <div>
                                            <p className="stat-name">Total XP</p>
                                            <p className="stat-value">{completionData.user.xp}</p>
                                        </div>
                                    </div>
                                    <div className="stat-box">
                                        <span className="stat-icon">🔥</span>
                                        <div>
                                            <p className="stat-name">Streak</p>
                                            <p className="stat-value">{completionData.user.streak}</p>
                                        </div>
                                    </div>
                                    <div className="stat-box">
                                        <span className="stat-icon">💰</span>
                                        <div>
                                            <p className="stat-name">Coins</p>
                                            <p className="stat-value">{completionData.user.coins}</p>
                                        </div>
                                    </div>
                                </div>

                                <button className="modal-close-btn" onClick={() => setShowCompletionModal(false)}>
                                    Continue
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}