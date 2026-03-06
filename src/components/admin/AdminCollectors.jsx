import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminCollectors = () => {
    const [collectors, setCollectors] = useState([]);

    useEffect(() => {
        fetchCollectors();
    }, []);

    const fetchCollectors = async () => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/collectors`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCollectors(data);
        } catch (error) {
            console.error("Error fetching collectors:", error);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/users/${id}/status`, { status }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchCollectors();
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const deleteUser = async (id) => {
        if (!window.confirm("Are you sure you want to delete this collector?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchCollectors();
        } catch (error) {
            console.error("Error deleting collector:", error);
        }
    };

    return (
        <div className="admin-section">
            <h2>Manage Collectors</h2>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Assigned Area</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {collectors.map(c => (
                        <tr key={c._id}>
                            <td>{c.name}</td>
                            <td>{c.email}</td>
                            <td>{c.profile?.phone || "N/A"}</td>
                            <td>{c.profile?.panchayath || "Unassigned"}, Ward {c.profile?.ward || "N/A"}</td>
                            <td>
                                <span className={`status-badge ${c.status.toLowerCase()}`}>{c.status}</span>
                            </td>
                            <td className="actions-cell">
                                {c.status === "Pending" && (
                                    <button onClick={() => updateStatus(c._id, "Active")} className="btn-approve">Approve</button>
                                )}
                                {c.status !== "Blocked" && (
                                    <button onClick={() => updateStatus(c._id, "Blocked")} className="btn-block">Block</button>
                                )}
                                {c.status === "Blocked" && (
                                    <button onClick={() => updateStatus(c._id, "Active")} className="btn-unblock">Unblock</button>
                                )}
                                <button onClick={() => deleteUser(c._id)} className="btn-delete">Remove</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminCollectors;
