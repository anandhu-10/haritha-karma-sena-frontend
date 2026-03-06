import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [responseMsg, setResponseMsg] = useState({});

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/complaints`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setComplaints(data);
        } catch (error) {
            console.error("Error fetching complaints:", error);
        }
    };

    const updateComplaint = async (id, status, initialResponse = "") => {
        try {
            const token = localStorage.getItem("token");
            const adminResponse = responseMsg[id] !== undefined ? responseMsg[id] : initialResponse;

            await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/complaints/${id}`, { status, adminResponse }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchComplaints();
        } catch (error) {
            console.error("Error updating complaint:", error);
        }
    };

    return (
        <div className="admin-section">
            <h2>Complaints & Issue Management</h2>
            <div className="complaints-list">
                {complaints.length === 0 ? <p>No complaints found.</p> : complaints.map(c => (
                    <div key={c._id} className="complaint-card">
                        <div className="complaint-header">
                            <h3>{c.subject}</h3>
                            <span className={`status-badge ${c.status.toLowerCase()}`}>{c.status}</span>
                        </div>
                        <p><strong>From:</strong> {c.userName} ({c.userRole}) | <em>Date: {new Date(c.createdAt).toLocaleDateString()}</em></p>
                        <div className="complaint-body">
                            <p>{c.description}</p>
                        </div>

                        <div className="complaint-actions">
                            {c.status !== "Resolved" ? (
                                <div className="response-box">
                                    <textarea
                                        placeholder="Type a response to the user..."
                                        defaultValue={c.adminResponse || ""}
                                        onChange={(e) => setResponseMsg({ ...responseMsg, [c._id]: e.target.value })}
                                    />
                                    <div className="btn-group">
                                        {c.status === "Pending" && (
                                            <button onClick={() => updateComplaint(c._id, "Reviewed")} className="btn-secondary">Mark Reviewed</button>
                                        )}
                                        <button onClick={() => updateComplaint(c._id, "Resolved")} className="btn-primary">Resolve & Respond</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="resolved-box">
                                    <p><strong>Your Response:</strong> {c.adminResponse}</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminComplaints;
