import React, { useState } from "react";
import axios from "axios";

const AdminAwareness = () => {
    const [message, setMessage] = useState("");
    const [targetRole, setTargetRole] = useState("all");
    const [status, setStatus] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        try {
            const token = localStorage.getItem("token");
            await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/awareness`, { message, targetRole }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setStatus("Notification sent successfully!");
            setMessage("");
            setTimeout(() => setStatus(""), 3000);
        } catch (error) {
            console.error("Error creating awareness:", error);
            setStatus("Failed to send notification.");
        }
    };

    return (
        <div className="admin-section">
            <div className="awareness-card">
                <h2>Broadcast Notifications & Awareness</h2>
                <p>Send messages about waste segregation, updates, or alerts to users and collectors.</p>

                {status && <div className={`alert ${status.includes("success") ? "alert-success" : "alert-error"}`}>{status}</div>}

                <form onSubmit={handleSubmit} className="awareness-form">
                    <div className="form-group">
                        <label>Target Audience:</label>
                        <select value={targetRole} onChange={(e) => setTargetRole(e.target.value)}>
                            <option value="all">All (Disposers & Collectors)</option>
                            <option value="disposer">Disposers (Citizens) Only</option>
                            <option value="collector">Collectors (Staff) Only</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Message Content:</label>
                        <textarea
                            rows="5"
                            placeholder="Write your awareness message here..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    <button type="submit" className="btn-primary">Send Notification</button>
                </form>
            </div>
        </div>
    );
};

export default AdminAwareness;
