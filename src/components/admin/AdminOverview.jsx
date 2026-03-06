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

const AdminOverview = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/stats`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setStats(data);
        } catch (error) {
            console.error("Error fetching admin stats:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading Overview...</div>;
    if (!stats) return <div>Failed to load stats.</div>;

    const chartData = [
        { name: "Plastic", value: stats.wasteTypeDistribution.plastic },
        { name: "Organic", value: stats.wasteTypeDistribution.organic },
        { name: "E-Waste", value: stats.wasteTypeDistribution.ewaste },
        { name: "Other", value: stats.wasteTypeDistribution.other },
    ];

    const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#0088FE"];

    return (
        <div className="admin-overview">
            <h2 style={{ marginBottom: "20px" }}>Admin Dashboard Overview</h2>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Users</h3>
                    <p>{stats.totalUsers}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Collectors</h3>
                    <p>{stats.totalCollectors}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Requests</h3>
                    <p>{stats.totalRequests}</p>
                </div>
                <div className="stat-card">
                    <h3>Active Requests</h3>
                    <p>{stats.activeRequests}</p>
                </div>
                <div className="stat-card">
                    <h3>Waste Collected Today</h3>
                    <p>{stats.wasteCollectedToday}</p>
                </div>
            </div>

            <div className="charts-container" style={{ display: "flex", gap: "20px", marginTop: "40px" }}>
                <div className="chart-box" style={{ flex: 1, height: "300px", padding: "20px", background: "white", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
                    <h3 style={{ textAlign: "center" }}>Waste Type Distribution</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="#8884d8"
                                label
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;
