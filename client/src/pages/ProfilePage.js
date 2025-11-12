import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.css";

// Small helper: render a 14-day streak calendar
function StreakCalendar({ streakHistory = [] }) {
    const seen = new Set(
        (streakHistory || [])
        .map((d) => {
            try {
                const dt = new Date(d);
                return dt.toISOString().slice(0, 10);
            } catch (e) {
                return null;
            }
        })
        .filter(Boolean)
    );

    const days = [];
    const today = new Date();
    for (let i = 13; i >= 0; i--) {
        const dt = new Date(today);
        dt.setDate(dt.getDate() - i);
        const key = dt.toISOString().slice(0, 10);
        days.push({
            key,
            label: dt.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
            active: seen.has(key),
        });
    }

    return ( <
        div className = "streak-calendar" > {
            days.map((d) => ( <
                div key = { d.key }
                className = { "streak-day" + (d.active ? " active" : "") }
                title = { d.key } >
                <
                div className = "streak-dot" / >
                <
                div className = "streak-label" > { d.label } < /div> <
                /div>
            ))
        } <
        /div>
    );
}

function ProgressBar({ progress = [], lessons = [] }) {
    const completeCount = (progress || []).filter((p) => p.completed).length;
    const total = lessons.length || 0;
    return ( <
        div className = "progress-panel" >
        <
        h4 >
        Lessons Completed: { completeCount }
        / {total} <
        /h4> <
        progress value = { completeCount }
        max = { total }
        /> <
        /div>
    );
}

export default function ProfilePage() {
    const [user, setUser] = useState({});
    const [lessons, setLessons] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ avatar: "", languages: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        fetch("http://localhost:5000/api/users/profile", {
                headers: { Authorization: "Bearer " + token },
            })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    setError(data.error);
                } else {
                    setUser(data);
                    setFormData({ avatar: data.avatar || "", languages: data.languages || [] });
                }
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to load profile");
                setLoading(false);
            });

        fetch("http://localhost:5000/api/lessons")
            .then((res) => res.json())
            .then((data) => setLessons(Array.isArray(data) ? data : []))
            .catch(() => setLessons([]));
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({...formData, [name]: value });
    };

    const handleLanguageAdd = (lang) => {
        if (lang.trim() && !formData.languages.includes(lang.trim())) {
            setFormData({...formData, languages: [...formData.languages, lang.trim()] });
        }
    };

    const handleLanguageRemove = (lang) => {
        setFormData({...formData, languages: formData.languages.filter((l) => l !== lang) });
    };

    const handleSaveProfile = async() => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://localhost:5000/api/users/profile", {
                method: "PATCH",
                headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.error) {
                setError(data.error);
            } else {
                setUser(data);
                setIsEditing(false);
                setError("");
            }
        } catch (err) {
            setError("Failed to update profile");
        }
    };

    if (loading) return <div className = "profile-page" > < p className = "loading" > Loading... < /p></div > ;

    return ( <
        div className = "profile-page" >
        <
        div className = "profile-container" >
        <
        h1 > Your Profile < /h1>

        {
            error && < div className = "error-message" > { error } < /div>}

            <
            div className = "profile-header" >
                <
                img src = { user.avatar || "/default-avatar.png" }
            alt = "Avatar"
            className = "profile-avatar" / >
                <
                div className = "profile-info" >
                <
                p >
                <
                strong > Username: < /strong> {user.username} <
                /p> <
                p >
                <
                strong > Email: < /strong> {user.email} <
                /p> <
                p >
                <
                strong > Member Since: < /strong> {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A
            "} <
            /p> <
            /div> <
            /div>

            <
            div className = "profile-stats" >
                <
                div className = "stat" >
                <
                span className = "stat-value" > { user.xp || 0 } < /span> <
                span className = "stat-label" > XP < /span> <
                /div> <
                div className = "stat" >
                <
                span className = "stat-value" > { user.streak || 0 } < /span> <
                span className = "stat-label" > Streak(days) < /span> <
                /div> <
                div className = "stat" >
                <
                span className = "stat-value" > { user.coins || 0 } < /span> <
                span className = "stat-label" > Coins < /span> <
                /div> <
                /div>

            <
            div className = "streak-calendar-section" >
                <
                h3 > Your Streak Activity < /h3> <
                StreakCalendar streakHistory = { user.streakHistory || [] }
            /> <
            /div>

            <
            ProgressBar progress = { user.progress || [] }
            lessons = { lessons }
            />

            <
            div className = "profile-languages" >
                <
                h3 > Languages Learning: < /h3> <
                div className = "language-list" > {
                    user.languages && user.languages.length > 0 ? (
                        user.languages.map((lang, idx) => ( <
                            span key = { idx }
                            className = "language-tag" > { lang } <
                            /span>
                        ))
                    ) : ( <
                        p className = "no-languages" > No languages yet < /p>
                    )
                } <
                /div> <
                /div>

            {
                isEditing ? ( <
                    div className = "edit-form" >
                    <
                    h3 > Edit Profile < /h3> <
                    div className = "form-group" >
                    <
                    label > Avatar URL: < /label> <
                    input type = "text"
                    name = "avatar"
                    value = { formData.avatar }
                    onChange = { handleInputChange }
                    placeholder = "https://example.com/avatar.jpg" / >
                    <
                    /div>

                    <
                    div className = "form-group" >
                    <
                    label > Add Language: < /label> <
                    div className = "language-input" >
                    <
                    input type = "text"
                    id = "langInput"
                    placeholder = "e.g., Spanish" / >
                    <
                    button onClick = {
                        () => {
                            const langInput = document.getElementById("langInput");
                            handleLanguageAdd(langInput.value);
                            langInput.value = "";
                        }
                    } >
                    Add <
                    /button> <
                    /div> <
                    div className = "language-list" > {
                        formData.languages.map((lang, idx) => ( <
                            div key = { idx }
                            className = "language-tag-edit" >
                            <
                            span > { lang } < /span> <
                            button onClick = {
                                () => handleLanguageRemove(lang) } > × < /button> <
                            /div>
                        ))
                    } <
                    /div> <
                    /div>

                    <
                    div className = "form-actions" >
                    <
                    button className = "btn-save"
                    onClick = { handleSaveProfile } >
                    Save Changes <
                    /button> <
                    button className = "btn-cancel"
                    onClick = {
                        () => setIsEditing(false) } >
                    Cancel <
                    /button> <
                    /div> <
                    /div>
                ) : ( <
                    button className = "btn-edit"
                    onClick = {
                        () => setIsEditing(true) } >
                    Edit Profile <
                    /button>
                )
            } <
            /div> <
            /div>
        );
    }
    import React, { useEffect, useState } from "react";
    import { useNavigate } from "react-router-dom";
    import "./ProfilePage.css";

    // Small helper: render a 14-day streak calendar
    function StreakCalendar({ streakHistory = [] }) {
        const seen = new Set(
            (streakHistory || [])
            .map((d) => {
                try {
                    const dt = new Date(d);
                    return dt.toISOString().slice(0, 10);
                } catch (e) {
                    return null;
                }
            })
            .filter(Boolean)
        );

        const days = [];
        const today = new Date();
        for (let i = 13; i >= 0; i--) {
            const dt = new Date(today);
            dt.setDate(dt.getDate() - i);
            const key = dt.toISOString().slice(0, 10);
            days.push({
                key,
                label: dt.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
                active: seen.has(key),
            });
        }

        return ( <
            div className = "streak-calendar" > {
                days.map((d) => ( <
                    div key = { d.key }
                    className = { "streak-day" + (d.active ? " active" : "") }
                    title = { d.key } >
                    <
                    div className = "streak-dot" / >
                    <
                    div className = "streak-label" > { d.label } < /div> <
                    /div>
                ))
            } <
            /div>
        );
    }

    function ProgressBar({ progress = [], lessons = [] }) {
        const completeCount = (progress || []).filter((p) => p.completed).length;
        const total = lessons.length || 0;
        return ( <
            div className = "progress-panel" >
            <
            h4 >
            Lessons Completed: { completeCount }
            / {total} <
            /h4> <
            progress value = { completeCount }
            max = { total }
            /> <
            /div>
        );
    }

    export default function ProfilePage() {
        const [user, setUser] = useState({});
        const [lessons, setLessons] = useState([]);
        const [isEditing, setIsEditing] = useState(false);
        const [formData, setFormData] = useState({ avatar: "", languages: [] });
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState("");
        const navigate = useNavigate();

        useEffect(() => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            fetch("http://localhost:5000/api/users/profile", {
                    headers: { Authorization: "Bearer " + token },
                })
                .then((res) => res.json())
                .then((data) => {
                    if (data.error) {
                        setError(data.error);
                    } else {
                        setUser(data);
                        setFormData({ avatar: data.avatar || "", languages: data.languages || [] });
                    }
                    setLoading(false);
                })
                .catch(() => {
                    setError("Failed to load profile");
                    setLoading(false);
                });

            fetch("http://localhost:5000/api/lessons")
                .then((res) => res.json())
                .then((data) => setLessons(Array.isArray(data) ? data : []))
                .catch(() => setLessons([]));
        }, [navigate]);

        const handleInputChange = (e) => {
            const { name, value } = e.target;
            setFormData({...formData, [name]: value });
        };

        const handleLanguageAdd = (lang) => {
            if (lang.trim() && !formData.languages.includes(lang.trim())) {
                setFormData({...formData, languages: [...formData.languages, lang.trim()] });
            }
        };

        const handleLanguageRemove = (lang) => {
            setFormData({...formData, languages: formData.languages.filter((l) => l !== lang) });
        };

        const handleSaveProfile = async() => {
            const token = localStorage.getItem("token");
            try {
                const res = await fetch("http://localhost:5000/api/users/profile", {
                    method: "PATCH",
                    headers: {
                        Authorization: "Bearer " + token,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });
                const data = await res.json();
                if (data.error) {
                    setError(data.error);
                } else {
                    setUser(data);
                    setIsEditing(false);
                    setError("");
                }
            } catch (err) {
                setError("Failed to update profile");
            }
        };

        if (loading) return <div className = "profile-page" > < p className = "loading" > Loading... < /p></div > ;

        return ( <
            div className = "profile-page" >
            <
            div className = "profile-container" >
            <
            h1 > Your Profile < /h1>

            {
                error && < div className = "error-message" > { error } < /div>}

                <
                div className = "profile-header" >
                    <
                    img src = { user.avatar || "/default-avatar.png" }
                alt = "Avatar"
                className = "profile-avatar" / >
                    <
                    div className = "profile-info" >
                    <
                    p >
                    <
                    strong > Username: < /strong> {user.username} <
                    /p> <
                    p >
                    <
                    strong > Email: < /strong> {user.email} <
                    /p> <
                    p >
                    <
                    strong > Member Since: < /strong> {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A
                "} <
                /p> <
                /div> <
                /div>

                <
                div className = "profile-stats" >
                    <
                    div className = "stat" >
                    <
                    span className = "stat-value" > { user.xp || 0 } < /span> <
                    span className = "stat-label" > XP < /span> <
                    /div> <
                    div className = "stat" >
                    <
                    span className = "stat-value" > { user.streak || 0 } < /span> <
                    span className = "stat-label" > Streak(days) < /span> <
                    /div> <
                    div className = "stat" >
                    <
                    span className = "stat-value" > { user.coins || 0 } < /span> <
                    span className = "stat-label" > Coins < /span> <
                    /div> <
                    /div>

                <
                div className = "streak-calendar-section" >
                    <
                    h3 > Your Streak Activity < /h3> <
                    StreakCalendar streakHistory = { user.streakHistory || [] }
                /> <
                /div>

                <
                ProgressBar progress = { user.progress || [] }
                lessons = { lessons }
                />

                <
                div className = "profile-languages" >
                    <
                    h3 > Languages Learning: < /h3> <
                    div className = "language-list" > {
                        user.languages && user.languages.length > 0 ? (
                            user.languages.map((lang, idx) => ( <
                                span key = { idx }
                                className = "language-tag" > { lang } <
                                /span>
                            ))
                        ) : ( <
                            p className = "no-languages" > No languages yet < /p>
                        )
                    } <
                    /div> <
                    /div>

                {
                    isEditing ? ( <
                        div className = "edit-form" >
                        <
                        h3 > Edit Profile < /h3> <
                        div className = "form-group" >
                        <
                        label > Avatar URL: < /label> <
                        input type = "text"
                        name = "avatar"
                        value = { formData.avatar }
                        onChange = { handleInputChange }
                        placeholder = "https://example.com/avatar.jpg" / >
                        <
                        /div>

                        <
                        div className = "form-group" >
                        <
                        label > Add Language: < /label> <
                        div className = "language-input" >
                        <
                        input type = "text"
                        id = "langInput"
                        placeholder = "e.g., Spanish" / >
                        <
                        button onClick = {
                            () => {
                                const langInput = document.getElementById("langInput");
                                handleLanguageAdd(langInput.value);
                                langInput.value = "";
                            }
                        } >
                        Add <
                        /button> <
                        /div> <
                        div className = "language-list" > {
                            formData.languages.map((lang, idx) => ( <
                                div key = { idx }
                                className = "language-tag-edit" >
                                <
                                span > { lang } < /span> <
                                button onClick = {
                                    () => handleLanguageRemove(lang) } > × < /button> <
                                /div>
                            ))
                        } <
                        /div> <
                        /div>

                        <
                        div className = "form-actions" >
                        <
                        button className = "btn-save"
                        onClick = { handleSaveProfile } >
                        Save Changes <
                        /button> <
                        button className = "btn-cancel"
                        onClick = {
                            () => setIsEditing(false) } >
                        Cancel <
                        /button> <
                        /div> <
                        /div>
                    ) : ( <
                        button className = "btn-edit"
                        onClick = {
                            () => setIsEditing(true) } >
                        Edit Profile <
                        /button>
                    )
                } <
                /div> <
                /div>
            );
        }
        import React, { useEffect, useState } from "react";
        import { useNavigate } from "react-router-dom";
        import "./ProfilePage.css";

        /**
         * StreakCalendar Component
         * Displays last 14 days of activity as visual calendar
         */
        function StreakCalendar({ streakHistory = [] }) {
            const seen = new Set(
                (streakHistory || [])
                .map((d) => {
                    try {
                        const dt = new Date(d);
                        return dt.toISOString().slice(0, 10);
                    } catch (e) {
                        return null;
                    }
                })
                .filter(Boolean)
            );

            const days = [];
            const today = new Date();
            for (let i = 13; i >= 0; i--) {
                const dt = new Date(today);
                dt.setDate(dt.getDate() - i);
                const key = dt.toISOString().slice(0, 10);
                days.push({
                    key,
                    label: dt.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
                    active: seen.has(key),
                });
            }

            return ( <
                div className = "streak-calendar" > {
                    days.map((d) => ( <
                        div key = { d.key }
                        className = { "streak-day" + (d.active ? " active" : "") }
                        title = { d.key } >
                        <
                        div className = "streak-dot" / >
                        <
                        div className = "streak-label" > { d.label } < /div> < /
                        div >
                    ))
                } <
                /div>
            );
        }

        /**
         * ProgressBar Component
         * Shows lessons completed out of total available lessons
         */
        function ProgressBar({ progress = [], lessons = [] }) {
            const completeCount = (progress || []).filter((p) => p.completed).length;
            const total = lessons.length || 0;
            return ( <
                div className = "progress-panel" >
                <
                h4 >
                Lessons Completed: { completeCount }
                / {total} < /
                h4 > <
                progress value = { completeCount }
                max = { total }
                /> < /
                div >
            );
        }

        /**
         * ProfilePage Component
         * User profile with stats, streak calendar, and edit functionality
         */
        export default function ProfilePage() {
            const [user, setUser] = useState({});
            const [lessons, setLessons] = useState([]);
            const [isEditing, setIsEditing] = useState(false);
            const [formData, setFormData] = useState({ avatar: "", languages: [] });
            const [loading, setLoading] = useState(true);
            const [error, setError] = useState("");
            const navigate = useNavigate();

            // Fetch user profile and lessons on component mount
            useEffect(() => {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/login");
                    return;
                }

                // Fetch user profile
                fetch("http://localhost:5000/api/users/profile", {
                        headers: { Authorization: "Bearer " + token },
                    })
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.error) {
                            setError(data.error);
                        } else {
                            setUser(data);
                            setFormData({ avatar: data.avatar || "", languages: data.languages || [] });
                        }
                        setLoading(false);
                    })
                    .catch(() => {
                        setError("Failed to load profile");
                        setLoading(false);
                    });

                // Fetch all available lessons
                fetch("http://localhost:5000/api/lessons")
                    .then((res) => res.json())
                    .then((data) => setLessons(Array.isArray(data) ? data : []))
                    .catch(() => setLessons([]));
            }, [navigate]);

            const handleInputChange = (e) => {
                const { name, value } = e.target;
                setFormData({...formData, [name]: value });
            };

            const handleLanguageAdd = (lang) => {
                if (lang.trim() && !formData.languages.includes(lang.trim())) {
                    setFormData({...formData, languages: [...formData.languages, lang.trim()] });
                }
            };

            const handleLanguageRemove = (lang) => {
                setFormData({...formData, languages: formData.languages.filter((l) => l !== lang) });
            };

            const handleSaveProfile = async() => {
                const token = localStorage.getItem("token");
                try {
                    const res = await fetch("http://localhost:5000/api/users/profile", {
                        method: "PATCH",
                        headers: {
                            Authorization: "Bearer " + token,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(formData),
                    });
                    const data = await res.json();
                    if (data.error) {
                        setError(data.error);
                    } else {
                        setUser(data);
                        setIsEditing(false);
                        setError("");
                    }
                } catch (err) {
                    setError("Failed to update profile");
                }
            };

            if (loading) return <div className = "profile-page" > < p className = "loading" > Loading... < /p></div > ;

            return ( <
                div className = "profile-page" >
                <
                div className = "profile-container" >
                <
                h1 > Your Profile < /h1>

                {
                    error && < div className = "error-message" > { error } < /div>}

                    <
                    div className = "profile-header" >
                        <
                        img src = { user.avatar || "/default-avatar.png" }
                    alt = "Avatar"
                    className = "profile-avatar" / >
                        <
                        div className = "profile-info" >
                        <
                        p > < strong > Username: < /strong> {user.username}</p >
                        <
                        p > < strong > Email: < /strong> {user.email}</p >
                        <
                        p > < strong > Member Since: < /strong> {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A

                    "}</p> < /
                    div > <
                        /div>

                    <
                    div className = "profile-stats" >
                        <
                        div className = "stat" >
                        <
                        span className = "stat-value" > { user.xp || 0 } < /span> <
                    span className = "stat-label" > XP < /span> < /
                    div > <
                        div className = "stat" >
                        <
                        span className = "stat-value" > { user.streak || 0 } < /span> <
                    span className = "stat-label" > Streak(days) < /span> < /
                    div > <
                        div className = "stat" >
                        <
                        span className = "stat-value" > { user.coins || 0 } < /span> <
                    span className = "stat-label" > Coins < /span> < /
                    div > <
                        /div>

                    <
                    div className = "streak-calendar-section" >
                        <
                        h3 > Your Streak Activity < /h3> <
                    StreakCalendar streakHistory = { user.streakHistory || [] }
                    /> < /
                    div >

                        <
                        ProgressBar progress = { user.progress || [] }
                    lessons = { lessons }
                    />

                    <
                    div className = "profile-languages" >
                        <
                        h3 > Languages Learning: < /h3> <
                    div className = "language-list" > {
                            user.languages && user.languages.length > 0 ? (
                                user.languages.map((lang, idx) => ( <
                                    span key = { idx }
                                    className = "language-tag" > { lang } < /span>
                                ))
                            ) : ( <
                                p className = "no-languages" > No languages yet < /p>
                            )
                        } <
                        /div> < /
                    div >

                        {
                            isEditing ? ( <
                                div className = "edit-form" >
                                <
                                h3 > Edit Profile < /h3> <
                                div className = "form-group" >
                                <
                                label > Avatar URL: < /label> <
                                input type = "text"
                                name = "avatar"
                                value = { formData.avatar }
                                onChange = { handleInputChange }
                                placeholder = "https://example.com/avatar.jpg" /
                                >
                                <
                                /div>

                                <
                                div className = "form-group" >
                                <
                                label > Add Language: < /label> <
                                div className = "language-input" >
                                <
                                input type = "text"
                                id = "langInput"
                                placeholder = "e.g., Spanish" / >
                                <
                                button onClick = {
                                    () => {
                                        const langInput = document.getElementById("langInput");
                                        handleLanguageAdd(langInput.value);
                                        langInput.value = "";
                                    }
                                } >
                                Add <
                                /button> < /
                                div > <
                                div className = "language-list" > {
                                    formData.languages.map((lang, idx) => ( <
                                        div key = { idx }
                                        className = "language-tag-edit" >
                                        <
                                        span > { lang } < /span> <
                                        button onClick = {
                                            () => handleLanguageRemove(lang)
                                        } > × < /button> < /
                                        div >
                                    ))
                                } <
                                /div> < /
                                div >

                                <
                                div className = "form-actions" >
                                <
                                button className = "btn-save"
                                onClick = { handleSaveProfile } >
                                Save Changes <
                                /button> <
                                button className = "btn-cancel"
                                onClick = {
                                    () => setIsEditing(false)
                                } >
                                Cancel <
                                /button> < /
                                div > <
                                /div>
                            ) : ( <
                                button className = "btn-edit"
                                onClick = {
                                    () => setIsEditing(true)
                                } >
                                Edit Profile <
                                /button>
                            )
                        } <
                        /div> < /
                    div >
                );
            }

            function StreakCalendar({ streakHistory = [] }) {
                const seen = new Set(
                    (streakHistory || [])
                    .map((d) => {
                        try {
                            const dt = new Date(d);
                            return dt.toISOString().slice(0, 10);
                        } catch (e) {
                            return null;
                        }
                    })
                    .filter(Boolean)
                );

                const days = [];
                const today = new Date();
                for (let i = 13; i >= 0; i--) {
                    const dt = new Date(today);
                    dt.setDate(dt.getDate() - i);
                    const key = dt.toISOString().slice(0, 10);
                    days.push({
                        key,
                        label: dt.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
                        active: seen.has(key),
                    });
                }

                return ( <
                    div className = "streak-calendar" > {
                        days.map((d) => ( <
                            div key = { d.key }
                            className = { "streak-day" + (d.active ? " active" : "") }
                            title = { d.key } >
                            <
                            div className = "streak-dot" / >
                            <
                            div className = "streak-label" > { d.label } < /div> < /
                            div >
                        ))
                    } <
                    /div>
                );
            }

            function ProgressBar({ progress = [], lessons = [] }) {
                const completeCount = (progress || []).filter((p) => p.completed).length;
                const total = lessons.length || 0;
                return ( <
                    div className = "progress-panel" >
                    <
                    h4 >
                    Lessons Completed: { completeCount }
                    / {total} < /
                    h4 > <
                    progress value = { completeCount }
                    max = { total }
                    /> < /
                    div >
                );
            }

            export default function ProfilePage() {
                const [user, setUser] = useState({});
                const [lessons, setLessons] = useState([]);
                const [isEditing, setIsEditing] = useState(false);
                const [formData, setFormData] = useState({ avatar: "", languages: [] });
                const [loading, setLoading] = useState(true);
                const [error, setError] = useState("");
                const navigate = useNavigate();

                useEffect(() => {
                    const token = localStorage.getItem("token");
                    if (!token) {
                        navigate("/login");
                        return;
                    }

                    fetch("http://localhost:5000/api/users/profile", {
                            headers: { Authorization: "Bearer " + token },
                        })
                        .then((res) => res.json())
                        .then((data) => {
                            if (data.error) {
                                setError(data.error);
                            } else {
                                setUser(data);
                                setFormData({ avatar: data.avatar || "", languages: data.languages || [] });
                            }
                            setLoading(false);
                        })
                        .catch(() => {
                            setError("Failed to load profile");
                            setLoading(false);
                        });

                    fetch("http://localhost:5000/api/lessons")
                        .then((res) => res.json())
                        .then((data) => setLessons(Array.isArray(data) ? data : []))
                        .catch(() => setLessons([]));
                }, [navigate]);

                const handleInputChange = (e) => {
                    const { name, value } = e.target;
                    setFormData({...formData, [name]: value });
                };

                const handleLanguageAdd = (lang) => {
                    if (lang.trim() && !formData.languages.includes(lang.trim())) {
                        setFormData({...formData, languages: [...formData.languages, lang.trim()] });
                    }
                };

                const handleLanguageRemove = (lang) => {
                    setFormData({...formData, languages: formData.languages.filter((l) => l !== lang) });
                };

                const handleSaveProfile = async() => {
                    const token = localStorage.getItem("token");
                    try {
                        const res = await fetch("http://localhost:5000/api/users/profile", {
                            method: "PATCH",
                            headers: {
                                Authorization: "Bearer " + token,
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(formData),
                        });
                        const data = await res.json();
                        if (data.error) {
                            setError(data.error);
                        } else {
                            setUser(data);
                            setIsEditing(false);
                            setError("");
                        }
                    } catch (err) {
                        setError("Failed to update profile");
                    }
                };

                if (loading) return <div className = "profile-page" > < p > Loading... < /p></div > ;

                return ( <
                    div className = "profile-page" >
                    <
                    div className = "profile-container" >
                    <
                    h1 > Your Profile < /h1>

                    {
                        error && < div className = "error-message" > { error } < /div>}

                        <
                        div className = "profile-header" >
                            <
                            img src = { user.avatar || "/default-avatar.png" }
                        alt = "Avatar"
                        className = "profile-avatar" / >
                            <
                            div className = "profile-info" >
                            <
                            p > < strong > Username: < /strong> {user.username}</p >
                            <
                            p > < strong > Email: < /strong> {user.email}</p >
                            <
                            p > < strong > Member Since: < /strong> {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A
                        "}</p> < /
                        div > <
                            /div>

                        <
                        div className = "profile-stats" >
                            <
                            div className = "stat" >
                            <
                            span className = "stat-value" > { user.xp || 0 } < /span> <
                        span className = "stat-label" > XP < /span> < /
                        div > <
                            div className = "stat" >
                            <
                            span className = "stat-value" > { user.streak || 0 } < /span> <
                        span className = "stat-label" > Streak(days) < /span> < /
                        div > <
                            div className = "stat" >
                            <
                            span className = "stat-value" > { user.coins || 0 } < /span> <
                        span className = "stat-label" > Coins < /span> < /
                        div > <
                            /div>

                        <
                        div className = "streak-calendar-section" >
                            <
                            h3 > Your Streak Activity < /h3> <
                        StreakCalendar streakHistory = { user.streakHistory || [] }
                        /> < /
                        div >

                            <
                            ProgressBar progress = { user.progress || [] }
                        lessons = { lessons }
                        />

                        <
                        div className = "profile-languages" >
                            <
                            h3 > Languages Learning: < /h3> <
                        div className = "language-list" > {
                                user.languages && user.languages.length > 0 ? (
                                    user.languages.map((lang, idx) => ( <
                                        span key = { idx }
                                        className = "language-tag" > { lang } < /span>
                                    ))
                                ) : ( <
                                    p className = "no-languages" > No languages yet < /p>
                                )
                            } <
                            /div> < /
                        div >

                            {
                                isEditing ? ( <
                                    div className = "edit-form" >
                                    <
                                    h3 > Edit Profile < /h3> <
                                    div className = "form-group" >
                                    <
                                    label > Avatar URL: < /label> <
                                    input type = "text"
                                    name = "avatar"
                                    value = { formData.avatar }
                                    onChange = { handleInputChange }
                                    placeholder = "https://example.com/avatar.jpg" / >
                                    <
                                    /div>

                                    <
                                    div className = "form-group" >
                                    <
                                    label > Add Language: < /label> <
                                    div className = "language-input" >
                                    <
                                    input type = "text"
                                    id = "langInput"
                                    placeholder = "e.g., Spanish" / >
                                    <
                                    button onClick = {
                                        () => {
                                            const langInput = document.getElementById("langInput");
                                            handleLanguageAdd(langInput.value);
                                            langInput.value = "";
                                        }
                                    } > Add < /button> < /
                                    div > <
                                    div className = "language-list" > {
                                        formData.languages.map((lang, idx) => ( <
                                            div key = { idx }
                                            className = "language-tag-edit" >
                                            <
                                            span > { lang } < /span> <
                                            button onClick = {
                                                () => handleLanguageRemove(lang)
                                            } > × < /button> < /
                                            div >
                                        ))
                                    } <
                                    /div> < /
                                    div >

                                    <
                                    div className = "form-actions" >
                                    <
                                    button className = "btn-save"
                                    onClick = { handleSaveProfile } > Save Changes < /button> <
                                    button className = "btn-cancel"
                                    onClick = {
                                        () => setIsEditing(false)
                                    } > Cancel < /button> < /
                                    div > <
                                    /div>
                                ) : ( <
                                    button className = "btn-edit"
                                    onClick = {
                                        () => setIsEditing(true)
                                    } > Edit Profile < /button>
                                )
                            } <
                            /div> < /
                        div >
                    );
                }