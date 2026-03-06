import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminRewards = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [rewards, setRewards] = useState([]);

    // Form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [pointsRequired, setPointsRequired] = useState("");
    const [rewardType, setRewardType] = useState("badge");
    const [iconType, setIconType] = useState("medal");

    useEffect(() => {
        fetchLeaderboard();
        fetchRewards();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/leaderboard`);
            setLeaderboard(data);
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
        }
    };

    const fetchRewards = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/rewards`);
            setRewards(data);
        } catch (error) {
            console.error("Error fetching rewards:", error);
        }
    };

    const handleAddReward = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await axios.post(`${process.env.REACT_APP_API_URL}/api/rewards`, {
                title, description, pointsRequired: Number(pointsRequired), rewardType, iconType
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchRewards();
            setTitle("");
            setDescription("");
            setPointsRequired("");
        } catch (error) {
            console.error("Error adding reward:", error);
        }
    };

    const handleDeleteReward = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${process.env.REACT_APP_API_URL}/api/rewards/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchRewards();
        } catch (error) {
            console.error("Error deleting reward:", error);
        }
    };

    return (
        <div className="admin-section" style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>

            {/* Rewards Management */}
            <div style={{ flex: '1 1 500px' }}>
                <h2>Manage Rewards</h2>
                <form onSubmit={handleAddReward} className="awareness-form" style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <input type="text" placeholder="Reward Title" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ flex: 1, padding: '10px' }} />
                        <input type="number" placeholder="Points Required" value={pointsRequired} onChange={(e) => setPointsRequired(e.target.value)} required style={{ width: '150px', padding: '10px' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <select value={rewardType} onChange={(e) => setRewardType(e.target.value)} style={{ flex: 1, padding: '10px' }}>
                            <option value="badge">Badge</option>
                            <option value="item">Physical Item</option>
                            <option value="certificate">Certificate</option>
                        </select>
                        <select value={iconType} onChange={(e) => setIconType(e.target.value)} style={{ flex: 1, padding: '10px' }}>
                            <option value="medal">Medal Icon</option>
                            <option value="star">Star Icon</option>
                            <option value="trophy">Trophy Icon</option>
                            <option value="gift">Gift Icon</option>
                        </select>
                    </div>
                    <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
                    <button type="submit" className="btn-primary" style={{ width: '100%' }}>Add Reward</button>
                </form>

                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {rewards.map(r => (
                        <li key={r._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', background: '#f4f7fe', marginBottom: '10px', borderRadius: '8px' }}>
                            <div>
                                <strong>{r.title}</strong> <span className="status-badge" style={{ background: '#4CAF50', color: 'white', marginLeft: '10px' }}>{r.pointsRequired} pts</span>
                                <p style={{ margin: '5px 0 0', fontSize: '12px', color: '#707eae' }}>{r.description}</p>
                            </div>
                            <button onClick={() => handleDeleteReward(r._id)} className="btn-delete" style={{ alignSelf: 'center' }}>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Leaderboard */}
            <div style={{ flex: '1 1 300px' }}>
                <h2>User Leaderboard</h2>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>User</th>
                            <th>Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboard.map((user, index) => (
                            <tr key={user._id}>
                                <td style={{ fontWeight: 'bold', color: index < 3 ? '#ff9800' : '#2b3674' }}>#{index + 1}</td>
                                <td>{user.name}</td>
                                <td><strong>{user.communityPoints}</strong> pts</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default AdminRewards;
