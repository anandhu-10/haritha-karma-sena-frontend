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
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setLoading(true);
        setError(null);
        const apiUrl = process.env.REACT_APP_API_URL || "https://haritha-karma-sena-backend.onrender.com";

        try {
            // Test ping first to see if server is reachable at all
            console.log("Pinging server...");
            await axios.get(`${apiUrl}/api/ping`, { timeout: 10000 });
            console.log("Ping successful.");

            const token = localStorage.getItem("token");
            const { data } = await axios.get(`${apiUrl}/api/admin/stats`, {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 30000 // 30 second timeout for cold starts
            });
            setStats(data);
        } catch (error) {
            console.error("Error fetching stats:", error);
            let msg = error.message;
            if (error.response) {
                msg = `${error.response.status}: ${error.response.data?.message || error.response.statusText}`;
            } else if (error.request) {
                msg = "No response from server. This could be a CORS issue or the server is spinning up.";
            }
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="admin-overview">
            <h2>Dashboard Overview</h2>
            <div style={{ textAlign: "center", padding: "100px", color: "#666" }}>
                <div className="loader"></div>
                <p>Curating your dashboard data...</p>
            </div>
        </div>
    );

    if (error || !stats) return (
        <div className="admin-overview">
            <h2>Dashboard Overview</h2>
            <div style={{
                margin: "40px auto",
                maxWidth: "600px",
                padding: "30px",
                background: "#fff5f5",
                border: "1px solid #feb2b2",
                borderRadius: "12px",
                textAlign: "center",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
            }}>
                <div style={{ fontSize: "3rem", marginBottom: "15px" }}>⚠️</div>
                <h3 style={{ color: "#c53030", marginBottom: "10px" }}>Database Connection Issue</h3>
                <p style={{ color: "#742a2a", lineHeight: "1.6" }}>{error}</p>
                {error.includes("404") && <p style={{ color: "#742a2a", fontSize: "0.9rem" }}>The statistics route could not be found. Please check your backend routes.</p>}
                {error.includes("401") || error.includes("403") ? (
                    <p style={{ color: "#742a2a", fontSize: "0.9rem" }}>Your session may have expired or you don't have admin privileges.</p>
                ) : null}

                <button
                    onClick={fetchStats}
                    style={{
                        marginTop: "20px",
                        padding: "10px 24px",
                        background: "#c53030",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "600"
                    }}
                >
                    Retry Connection
                </button>
                <div style={{ marginTop: "20px", textAlign: "left", fontSize: "0.8rem", color: "#666", background: "#fff", padding: "10px", borderRadius: "4px", border: "1px solid #ddd" }}>
                    <strong>Debug Info:</strong><br />
                    Endpoint: {process.env.REACT_APP_API_URL || "https://haritha-karma-sena-backend.onrender.com"}<br />
                    Time: {new Date().toLocaleTimeString()}
                </div>
            </div>
        </div>
    );

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
                <div className="stat-card" style={{ borderLeft: "4px solid #e53e3e" }}>
                    <h3 style={{ color: "#c53030" }}>Awaiting Assignment</h3>
                    <p>{stats.unassignedRequests || 0}</p>
                </div>
                <div className="stat-card">
                    <h3>Waste Collected Today</h3>
                    <p>{stats.wasteCollectedToday}</p>
                </div>
            </div>

            <div className="charts-container" style={{ display: "flex", gap: "20px", marginTop: "40px", marginBottom: "40px" }}>
                <div className="chart-box" style={{ flex: 1, minHeight: "400px", padding: "20px", background: "white", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column" }}>
                    <h3 style={{ textAlign: "center", marginBottom: "20px" }}>Waste Type Distribution</h3>
                    <div style={{ flex: 1, minHeight: 0 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                            <Pie
                                data={chartData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="45%"
                                outerRadius={100}
                                fill="#8884d8"
                                label
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;
