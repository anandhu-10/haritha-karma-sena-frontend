import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { FaUsers, FaTruck, FaFileAlt, FaBalanceScale, FaBoxes, FaHistory } from "react-icons/fa";
import "./AdminOverview.css";

const AdminOverview = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setLoading(true);
        setError(null);
        const apiUrl = process.env.REACT_APP_API_URL || "https://haritha-karma-sena-backend.onrender.com";

        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get(`${apiUrl}/api/admin/stats`, {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 30000 
            });
            setStats(data);
        } catch (error) {
            console.error("Error fetching stats:", error);
            let msg = error.message;
            if (error.response) {
                msg = `${error.response.status}: ${error.response.data?.message || error.response.statusText}`;
            } else if (error.request) {
                msg = "No response from server. Check your connection or the server status.";
            }
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="admin-overview-container">
            <div className="loader-container" style={{ textAlign: "center", padding: "120px 0" }}>
                <div className="loader"></div>
                <p style={{ marginTop: '20px', color: '#707eae', fontWeight: '500' }}>Crafting your overview...</p>
            </div>
        </div>
    );

    if (error || !stats) return (
        <div className="admin-overview-container">
            <div className="error-card glass-morphism" style={{ padding: '40px', borderRadius: '24px', textAlign: 'center', background: 'rgba(255, 245, 245, 0.8)', border: '1px solid #feb2b2' }}>
                <span style={{ fontSize: '4rem' }}>🛰️</span>
                <h3 style={{ color: '#c53030', margin: '15px 0' }}>Data Link Offline</h3>
                <p style={{ color: '#742a2a', marginBottom: '25px' }}>{error}</p>
                <button onClick={fetchStats} className="retry-btn" style={{ padding: '12px 30px', background: '#c53030', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '700' }}>Establish Connection</button>
            </div>
        </div>
    );

    const chartData = [
        { name: "Plastic", value: stats.wasteTypeDistribution.plastic || 0 },
        { name: "Organic", value: stats.wasteTypeDistribution.organic || 0 },
        { name: "E-Waste", value: stats.wasteTypeDistribution.ewaste || 0 },
        { name: "Other", value: stats.wasteTypeDistribution.other || 0 },
    ].filter(v => v.value > 0);

    const COLORS = ["#4318FF", "#00E396", "#FEB019", "#FF4560"];

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, name }) => {
        const radius = outerRadius + 30;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="#1b254b" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" style={{ fontSize: '13px', fontWeight: '700' }}>
                {name}: {value}
            </text>
        );
    };

    return (
        <div className="admin-overview-container">
            <div className="admin-overview-header">
                <h2>System Pulse Overview</h2>
            </div>

            <div className="stats-grid">
                <div className="stat-card-glass">
                    <FaUsers style={{ color: '#4318FF', fontSize: '20px', marginBottom: '15px' }} />
                    <h3>Total Users</h3>
                    <p>{stats.totalUsers}</p>
                </div>
                <div className="stat-card-glass">
                    <FaTruck style={{ color: '#00E396', fontSize: '20px', marginBottom: '15px' }} />
                    <h3>Total Collectors</h3>
                    <p>{stats.totalCollectors}</p>
                </div>
                <div className="stat-card-glass">
                    <FaFileAlt style={{ color: '#FEB019', fontSize: '20px', marginBottom: '15px' }} />
                    <h3>Total Requests</h3>
                    <p>{stats.totalRequests}</p>
                </div>
                <div className="stat-card-glass">
                    <FaBoxes style={{ color: '#01B574', fontSize: '20px', marginBottom: '15px' }} />
                    <h3>Active Requests</h3>
                    <p>{stats.activeRequests}</p>
                </div>
                <div className="stat-card-glass warning">
                    <FaBalanceScale style={{ color: '#FF4560', fontSize: '20px', marginBottom: '15px' }} />
                    <h3>Awaiting Assignment</h3>
                    <p>{stats.unassignedRequests || 0}</p>
                </div>
                <div className="stat-card-glass">
                    <FaHistory style={{ color: '#707eae', fontSize: '20px', marginBottom: '15px' }} />
                    <h3>Collected Today</h3>
                    <p>{stats.wasteCollectedToday}</p>
                </div>
            </div>

            <div className="charts-grid-container">
                <div className="chart-card-glass">
                    <h3>Waste Category Analysis</h3>
                    <div style={{ flex: 1, minHeight: 0 }}>
                        <ResponsiveContainer width="100%" height={400}>
                            <PieChart>
                                <defs>
                                    {COLORS.map((color, index) => (
                                        <linearGradient key={`grad-${index}`} id={`colorGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                                            <stop offset="95%" stopColor={color} stopOpacity={0.5} />
                                        </linearGradient>
                                    ))}
                                </defs>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={{ stroke: '#B2B7CF', strokeWidth: 1 }}
                                    label={renderCustomizedLabel}
                                    outerRadius={120}
                                    innerRadius={70}
                                    paddingAngle={8}
                                    cornerRadius={10}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={`url(#colorGradient-${index})`} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="custom-tooltip">
                                                    <p className="tooltip-label">{payload[0].name}</p>
                                                    <p className="tooltip-value">{payload[0].value} units</p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Legend 
                                    verticalAlign="bottom" 
                                    height={36} 
                                    iconType="circle"
                                    formatter={(value) => <span style={{ color: '#707eae', fontWeight: '600', fontSize: '14px' }}>{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;
