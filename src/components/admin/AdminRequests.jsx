import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminRequests = () => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/requests`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRequests(data);
        } catch (error) {
            console.error("Error fetching requests:", error);
        }
    };

    return (
        <div className="admin-section">
            <h2>Waste Request Monitoring</h2>
            <div className="table-responsive">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Disposer</th>
                            <th>Waste Type</th>
                            <th>Quantity (kg)</th>
                            <th>Status</th>
                            <th>Assigned Collector</th>
                            <th>Image</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map(r => (
                            <tr key={r._id}>
                                <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <strong>{r.disposerId?.name || "Unknown"}</strong> <br />
                                    <small>{r.disposerId?.profile?.phone}</small>
                                </td>
                                <td>{r.wasteTypes?.join(", ")}</td>
                                <td>{r.wasteQuantity}</td>
                                <td>
                                    <span className={`status-badge ${r.status.toLowerCase()}`}>
                                        {r.status}
                                    </span>
                                </td>
                                <td>
                                    {r.collectorId ? (
                                        <div>
                                            <strong>{r.collectorId.name}</strong> <br />
                                            <small>{r.collectorId.profile?.phone}</small>
                                        </div>
                                    ) : (
                                        <span style={{ color: "gray" }}>Unassigned</span>
                                    )}
                                </td>
                                <td>
                                    {r.image && r.image.length > 20 ? (
                                        <img src={r.image} alt="Waste" width="50" height="50" style={{ objectFit: "cover", borderRadius: "4px" }} />
                                    ) : (
                                        <span>No Image</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminRequests;
