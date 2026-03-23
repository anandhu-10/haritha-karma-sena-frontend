import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminOverview from "../components/admin/AdminOverview";
import AdminUsers from "../components/admin/AdminUsers";
import AdminCollectors from "../components/admin/AdminCollectors";
import AdminRequests from "../components/admin/AdminRequests";
import AdminComplaints from "../components/admin/AdminComplaints";
import AdminAwareness from "../components/admin/AdminAwareness";
import AdminRewards from "../components/admin/AdminRewards";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartPie, faUsers, faTruck, faRecycle, faBullhorn, faExclamationCircle, faSignOutAlt, faStar } from '@fortawesome/free-solid-svg-icons';
import "./AdminDashboard.css";

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("overview");
    const [adminName, setAdminName] = useState("Admin");
    const navigate = useNavigate();

    useEffect(() => {
        // Check API token and admin role here
        const userStr = localStorage.getItem("user");
        if (!userStr) {
            navigate("/login");
            return;
        }
        const user = JSON.parse(userStr);
        if (user.role !== "admin") {
            navigate("/");
        } else {
            setAdminName(user.name);
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const renderContent = () => {
        switch (activeTab) {
            case "overview": return <AdminOverview />;
            case "users": return <AdminUsers />;
            case "collectors": return <AdminCollectors />;
            case "requests": return <AdminRequests />;
            case "complaints": return <AdminComplaints />;
            case "awareness": return <AdminAwareness />;
            case "rewards": return <AdminRewards />;
            default: return <AdminOverview />;
        }
    };

    return (
        <div className="admin-dashboard-container">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <h2>HKS Admin</h2>
                </div>

                <nav className="sidebar-nav">
                    <ul>
                        <li className={activeTab === "overview" ? "active" : ""} onClick={() => setActiveTab("overview")}>
                            <FontAwesomeIcon icon={faChartPie} /> Dashboard
                        </li>
                        <li className={activeTab === "users" ? "active" : ""} onClick={() => setActiveTab("users")}>
                            <FontAwesomeIcon icon={faUsers} /> User Management
                        </li>
                        <li className={activeTab === "collectors" ? "active" : ""} onClick={() => setActiveTab("collectors")}>
                            <FontAwesomeIcon icon={faTruck} /> Collector Management
                        </li>
                        <li className={activeTab === "requests" ? "active" : ""} onClick={() => setActiveTab("requests")}>
                            <FontAwesomeIcon icon={faRecycle} /> Waste Requests
                        </li>
                        <li className={activeTab === "complaints" ? "active" : ""} onClick={() => setActiveTab("complaints")}>
                            <FontAwesomeIcon icon={faExclamationCircle} /> Issue Management
                        </li>
                        <li className={activeTab === "awareness" ? "active" : ""} onClick={() => setActiveTab("awareness")}>
                            <FontAwesomeIcon icon={faBullhorn} /> Broadcast Notification
                        </li>
                        <li className={activeTab === "rewards" ? "active" : ""} onClick={() => setActiveTab("rewards")}>
                            <FontAwesomeIcon icon={faStar} /> Points & Rewards
                        </li>
                    </ul>
                </nav>

                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={handleLogout}>
                        <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="admin-main">
                {/* Top Header */}
                <header className="admin-topbar">
                    <div className="breadcrumb">
                        Dashboard / <span>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</span>
                    </div>
                    <div className="admin-profile-menu">
                        <span>Welcome, <strong>{adminName}</strong></span>
                        <div className="avatar">{adminName.charAt(0)}</div>
                    </div>
                </header>

                {/* Dynamic Inner Content */}
                <div className="admin-content-wrapper">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
