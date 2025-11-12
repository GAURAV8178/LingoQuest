import React, { useEffect, useState } from "react";

export default function AdminDashboard() {
    const [lessons, setLessons] = useState([]);
    const [users, setUsers] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) return;
        fetch("http://localhost:5000/api/admin/lesson", { headers: { Authorization: "Bearer " + token } })
            .then((res) => res.json())
            .then((data) => setLessons(Array.isArray(data) ? data : []))
            .catch(() => setLessons([]));
        fetch("http://localhost:5000/api/admin/users", { headers: { Authorization: "Bearer " + token } })
            .then((res) => res.json())
            .then((data) => setUsers(Array.isArray(data) ? data : []))
            .catch(() => setUsers([]));
    }, [token]);

    return (
        <div className="admin-dashboard">
            <h2>Admin Dashboard</h2>

            <h3>Lessons</h3>
            <ul>
                {lessons.map((lesson) => (
                    <li key={lesson._id}>{lesson.title}</li>
                ))}
            </ul>

            <h3>Users</h3>
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>XP</th>
                        <th>Streak</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td>{user.username}</td>
                            <td>{user.xp}</td>
                            <td>{user.streak}</td>
                            <td>{user.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* TODO: Add forms for Create/Delete Lessons as needed */}
        </div>
    );
}