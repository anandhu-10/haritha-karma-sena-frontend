import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaClockRotateLeft, FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import "../styles/PointsHistory.css";

const API = (process.env.REACT_APP_API_URL || "https://haritha-karma-sena-backend.onrender.com");

const PointsHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get(`${API}/api/points/my`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setHistory(res.data || []);
            } catch (err) {
                console.error("Failed to fetch points history", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [token]);

    const formatDate = (dateStr) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateStr).toLocaleDateString(undefined, options);
    };

    if (loading) return <div className="loader">Loading History...</div>;

    return (
        <div className="history-container">
            <div className="history-header">
                <FaClockRotateLeft className="header-icon" />
                <h2>Points History</h2>
                <p>Track your eco-friendly actions and rewards</p>
            </div>

            <div className="history-list">
                {history.length === 0 ? (
                    <div className="empty-message">You have not earned any points yet. Submit a waste request to start!</div>
                ) : (
                    history.map((record) => {
                        const isPositive = record.pointsEarned > 0;
                        return (
                            <div key={record._id} className={`history-card ${isPositive ? 'positive' : 'negative'}`}>
                                <div className="history-icon">
                                    {isPositive ? <FaArrowTrendUp color="#4caf50" /> : <FaArrowTrendDown color="#f44336" />}
                                </div>
                                <div className="history-details">
                                    <h4>{record.actionType}</h4>
                                    <span className="history-date">{formatDate(record.date)}</span>
                                </div>
                                <div className="history-points">
                                    <span className={`points ${isPositive ? 'plus' : 'minus'}`}>
                                        {isPositive ? "+" : ""}{record.pointsEarned} pts
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default PointsHistory;
