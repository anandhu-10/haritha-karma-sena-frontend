import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/helpCenter.css";

const API = (process.env.REACT_APP_API_URL || "https://haritha-karma-sena-backend.onrender.com");

function HelpCenter() {
    const [complaints, setComplaints] = useState([]);
    const [subject, setSubject] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchComplaints = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${API}/api/admin/my-complaints`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setComplaints(res.data);
        } catch (err) {
            console.error("Error fetching complaints:", err);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!subject || !description) return alert("Please fill in all fields.");

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                `${API}/api/admin/complaints`,
                { subject, description },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Complaint submitted successfully!");
            setSubject("");
            setDescription("");
            fetchComplaints(); // refresh complaints list
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to submit complaint.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="helpcenter-container">
            <h2>Help & Complaints Center</h2>

            <div className="helpcenter-form-box">
                <h3>Submit a New Complaint/Issue</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Subject:</label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="E.g., Issue with waste pickup"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Description:</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Provide more details about the issue..."
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading} className="help-submit-btn">
                        {loading ? "Submitting..." : "Submit to Admin"}
                    </button>
                </form>
            </div>

            <div className="helpcenter-list-box">
                <h3>My Previous Complaints</h3>
                {complaints.length === 0 ? (
                    <p className="no-complaints">You have no complaints submitted.</p>
                ) : (
                    <div className="complaints-list">
                        {complaints.map((c) => (
                            <div key={c._id} className="complaint-item">
                                <div className="complaint-header">
                                    <strong>{c.subject}</strong>
                                    <span className={`status-badge stat-${c.status.toLowerCase()}`}>
                                        {c.status}
                                    </span>
                                </div>
                                <p className="complaint-date">{new Date(c.createdAt).toLocaleDateString()} {new Date(c.createdAt).toLocaleTimeString()}</p>
                                <div className="complaint-desc">{c.description}</div>

                                {c.adminResponse && (
                                    <div className="admin-response">
                                        <strong>Admin Reply:</strong> {c.adminResponse}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default HelpCenter;
