import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaMedal, FaTrophy, FaStar } from "react-icons/fa6";
import "../styles/Leaderboard.css";

const API = (process.env.REACT_APP_API_URL || "https://haritha-karma-sena-backend.onrender.com");

const Leaderboard = () => {
    const [topUsers, setTopUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await axios.get(`${API}/api/leaderboard`);
                setTopUsers(res.data || []);
            } catch (err) {
                console.error("Failed to fetch leaderboard", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    if (loading) return <div className="loader">Loading Leaderboard...</div>;

    return (
        <div className="leaderboard-container">
            <div className="leaderboard-header">
                <FaTrophy className="header-icon" />
                <h2>Community Leaderboard</h2>
                <p>Top 10 Eco-Friendly Citizens</p>
            </div>

            <div className="leaderboard-list">
                {topUsers.length === 0 ? (
                    <div className="empty-message">No users found on the leaderboard. Be the first!</div>
                ) : (
                    topUsers.map((u, index) => {
                        let rankIcon = null;
                        if (index === 0) rankIcon = <FaMedal color="#FFD700" size={24} />; // Gold
                        else if (index === 1) rankIcon = <FaMedal color="#C0C0C0" size={24} />; // Silver
                        else if (index === 2) rankIcon = <FaMedal color="#CD7F32" size={24} />; // Bronze
                        else rankIcon = <span className="rank-number">#{index + 1}</span>;

                        return (
                            <div key={u._id} className={`leaderboard-card ${index < 3 ? "top-rank" : ""}`}>
                                <div className="rank-col">{rankIcon}</div>
                                <div className="name-col">
                                    <h4>{u.name}</h4>
                                    {index === 0 && <span className="champion-badge">Current Champion! 🏆</span>}
                                </div>
                                <div className="points-col">
                                    <FaStar color="#FFD700" size={16} />
                                    <span>{u.communityPoints} pts</span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
