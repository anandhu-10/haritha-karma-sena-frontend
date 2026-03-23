import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { FaRobot, FaLeaf, FaLocationDot, FaChartLine } from "react-icons/fa6";
import "../styles/Monitoring.css";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658"];

const Monitoring = ({ myRequests, disposerProfile }) => {
    /* ---------- DATA PROCESSING ---------- */

    // 1. Total Waste
    const totalWaste = myRequests.reduce((sum, req) => sum + (Number(req.wasteQuantity) || 0), 0);

    // 2. Monthly Waste
    const monthlyDataMap = {};
    myRequests.forEach((req) => {
        const date = new Date(req.createdAt);
        const month = date.toLocaleString("default", { month: "short" });
        monthlyDataMap[month] = (monthlyDataMap[month] || 0) + (Number(req.wasteQuantity) || 0);
    });
    const monthlyData = Object.keys(monthlyDataMap).map((month) => ({
        name: month,
        quantity: monthlyDataMap[month],
    }));

    // 3. Waste Type Distribution
    const typeDataMap = {};
    myRequests.forEach((req) => {
        req.wasteTypes.forEach((type) => {
            // Since quantity is for the whole request, we'll attribute it equally to each type or just count occurrences.
            // User says "Waste type distribution" and gives example "Organic: 12 kg".
            // We'll divide quantity by number of types in the request.
            const weightPerType = (Number(req.wasteQuantity) || 0) / req.wasteTypes.length;
            typeDataMap[type] = (typeDataMap[type] || 0) + weightPerType;
        });
    });
    const typeData = Object.keys(typeDataMap).map((type) => ({
        name: type,
        value: parseFloat(typeDataMap[type].toFixed(2)),
    }));

    /* ---------- AI ECO-ADVISOR LOGIC ---------- */
    const generateAIInsights = () => {
        const insights = [];
        const { localBodyName, panchayath, ward } = disposerProfile || {};
        const areaName = localBodyName || panchayath;

        // 1. Location-based Awareness
        if (areaName || ward) {
            insights.push({
                icon: <FaLocationDot />,
                title: `Local Impact (${areaName || "Your Area"})`,
                text: `Residents in ${ward || "Ward X"} are currently focusing on composting. Your contribution of ${totalWaste}kg helps reduce the load on the ${areaName || "local"} processing plant.`
            });
        }

        // 2. Trend Analysis
        if (monthlyData.length >= 2) {
            const lastMonth = monthlyData[monthlyData.length - 2].quantity;
            const currentMonth = monthlyData[monthlyData.length - 1].quantity;
            const diff = currentMonth - lastMonth;

            if (diff > 0) {
                insights.push({
                    icon: <FaChartLine />,
                    title: "Waste Trend Alert",
                    text: `Your waste generation increased by ${diff.toFixed(1)}kg compared to last month. Consider reviewing your consumption habits.`
                });
            } else if (diff < 0) {
                insights.push({
                    icon: <FaLeaf />,
                    title: "Eco-Hero Progress",
                    text: `Fantastic! You reduced your waste by ${Math.abs(diff).toFixed(1)}kg. Keep up the sustainable lifestyle!`
                });
            }
        }

        // 3. Waste Type Specifics
        if (typeDataMap["Plastics"] > 5) {
            insights.push({
                icon: <FaRobot />,
                title: "Plastic Reduction Strategy",
                text: "My analysis shows high plastic output. Tip: Buying in bulk can reduce single-use plastic packaging by up to 30%."
            });
        }

        if (typeDataMap["Organic"] > 10) {
            insights.push({
                icon: <FaLeaf />,
                title: "Organic Gold",
                text: "Your organic waste volume is significant. Have you considered a kitchen-top composter? It turns waste into fertilizer for your garden!"
            });
        }

        if (insights.length === 0) {
            insights.push({
                icon: <FaRobot />,
                title: "System Ready",
                text: "Submit more disposal requests to unlock personalized AI-driven eco-tips based on your habits."
            });
        }

        return insights;
    };

    const aiInsights = generateAIInsights();

    /* ---------- AWARENESS MESSAGES (TRADITIONAL) ---------- */
    const awarenessMessages = [];
    if (typeDataMap["Plastics"] > 5) {
        awarenessMessages.push("Your plastic waste generation is high this month. Try using reusable products.");
    }
    if (typeDataMap["Organic"] > 10) {
        awarenessMessages.push("Organic waste can be composted to reduce landfill waste.");
    }
    if (typeDataMap["E-Waste"] > 0) {
        awarenessMessages.push("E-waste contains hazardous materials. Ensure it's handled by certified recyclers.");
    }
    if (awarenessMessages.length === 0) {
        awarenessMessages.push("Great job! Keep segregating your waste for a cleaner environment.");
    }

    return (
        <div className="monitoring-container">
            <div className="ai-advisor-section">
                <div className="ai-header">
                    <FaRobot className="ai-logo" />
                    <h2>AI Eco-Advisor Insights</h2>
                </div>
                <div className="ai-insights-grid">
                    {aiInsights.map((insight, i) => (
                        <div key={i} className="ai-insight-card">
                            <div className="insight-icon">{insight.icon}</div>
                            <div className="insight-content">
                                <h4>{insight.title}</h4>
                                <p>{insight.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Waste Generated</h3>
                    <p className="stat-value">{totalWaste} kg</p>
                </div>
                <div className="stat-card awareness-card">
                    <h3>Quick Tips</h3>
                    <ul>
                        {awarenessMessages.map((msg, i) => (
                            <li key={i}>{msg}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="charts-grid">
                <div className="chart-card">
                    <h3>Monthly Generation (kg)</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="quantity" fill="#4caf50" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-card">
                    <h3>Waste Type Distribution</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={typeData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {typeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Monitoring;
