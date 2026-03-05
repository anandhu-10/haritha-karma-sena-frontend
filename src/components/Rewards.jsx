import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaGift, FaStar, FaAward, FaCertificate } from "react-icons/fa6";
import "../styles/Rewards.css";

const API = process.env.REACT_APP_API_URL;

const Rewards = ({ currentPoints, fetchUserProfile }) => {
    const [rewards, setRewards] = useState([]);
    const [claiming, setClaiming] = useState(false);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchRewards = async () => {
            try {
                const res = await axios.get(`${API}/api/rewards`);
                setRewards(res.data || []);
            } catch (err) {
                console.error("Failed to fetch rewards", err);
            }
        };
        fetchRewards();
    }, []);

    const handleClaim = async (rewardId, pointsRequired) => {
        if (currentPoints < pointsRequired) {
            alert("Not enough points to claim this reward!");
            return;
        }

        if (!window.confirm("Are you sure you want to spend your points on this reward?")) return;

        setClaiming(true);
        try {
            await axios.post(
                `${API}/api/rewards/claim`,
                { rewardId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Reward claimed successfully! 🎉");
            fetchUserProfile(); // Refresh user profile to update points
        } catch (err) {
            alert(err.response?.data?.message || "Failed to claim reward.");
        } finally {
            setClaiming(false);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case "badge": return <FaAward className="reward-icon badge-icon" />;
            case "certificate": return <FaCertificate className="reward-icon cert-icon" />;
            case "item": return <FaGift className="reward-icon item-icon" />;
            default: return <FaGift className="reward-icon" />;
        }
    };

    return (
        <div className="rewards-container">
            <div className="rewards-header">
                <FaGift className="header-icon" />
                <h2>Rewards Center</h2>
                <div className="current-points-badge">
                    <FaStar color="#FFD700" />
                    <span>Your Points: {currentPoints}</span>
                </div>
            </div>

            <div className="rewards-grid">
                {rewards.map((reward) => {
                    const canAfford = currentPoints >= reward.pointsRequired;
                    const progress = Math.min((currentPoints / reward.pointsRequired) * 100, 100);

                    return (
                        <div key={reward._id} className={`reward-card ${canAfford ? 'affordable' : 'locked'}`}>
                            <div className="reward-visual">
                                {getIcon(reward.rewardType)}
                            </div>
                            <div className="reward-info">
                                <h3>{reward.title}</h3>
                                <p>{reward.description}</p>
                                <div className="points-req">
                                    <FaStar color={canAfford ? "#FFD700" : "#ccc"} />
                                    <span>{reward.pointsRequired} pts required</span>
                                </div>

                                {!canAfford && (
                                    <div className="progress-container">
                                        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                                    </div>
                                )}
                                {!canAfford && <small>{reward.pointsRequired - currentPoints} more points needed</small>}

                                <button
                                    className={`claim-btn ${!canAfford ? 'disabled' : ''}`}
                                    disabled={!canAfford || claiming}
                                    onClick={() => handleClaim(reward._id, reward.pointsRequired)}
                                >
                                    {claiming ? "Processing..." : canAfford ? "Claim Reward" : "Locked"}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Rewards;
