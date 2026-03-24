import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from 'react-paginate';
import { FaHistory, FaShieldAlt } from "react-icons/fa";

const AdminRequests = () => {
    const [requests, setRequests] = useState([]);
    const [collectors, setCollectors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [assigning, setAssigning] = useState(null); // ID of request being assigned
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRequests();
        fetchCollectors();
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const apiUrl = process.env.REACT_APP_API_URL || "https://haritha-karma-sena-backend.onrender.com";
            const { data } = await axios.get(`${apiUrl}/api/admin/requests`, {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 30000 
            });
            setRequests(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching requests:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchCollectors = async () => {
        try {
            const token = localStorage.getItem("token");
            const apiUrl = process.env.REACT_APP_API_URL || "https://haritha-karma-sena-backend.onrender.com";
            const { data } = await axios.get(`${apiUrl}/api/admin/collectors`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Only active collectors
            setCollectors(data.filter(c => c.status === "Active"));
        } catch (error) {
            console.error("Error fetching collectors:", error);
        }
    };

    const handleManualAssign = async (requestId, collectorId) => {
        if (!collectorId) return;
        setAssigning(requestId);
        try {
            const token = localStorage.getItem("token");
            const apiUrl = process.env.REACT_APP_API_URL || "https://haritha-karma-sena-backend.onrender.com";
            await axios.post(`${apiUrl}/api/admin/assign`, { requestId, collectorId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Collector assigned successfully!");
            fetchRequests();
        } catch (error) {
            console.error("Assignment error:", error);
            alert(error.response?.data?.message || "Failed to assign collector");
        } finally {
            setAssigning(null);
        }
    };

    // Pagination logic
    const [itemOffset, setItemOffset] = useState(0);
    const itemsPerPage = 8;

    const endOffset = itemOffset + itemsPerPage;
    const currentItems = requests.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(requests.length / itemsPerPage);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % requests.length;
        setItemOffset(newOffset);
    };

    return (
        <div className="admin-section">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2>Waste Request Monitoring</h2>
                <button onClick={fetchRequests} className="btn-refresh" style={{ padding: "8px 16px", borderRadius: "4px", background: "#4CAF50", color: "white", border: "none", cursor: "pointer" }}>
                    Refresh Data
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: "center", padding: "40px", fontSize: "1.2rem", color: "#666" }}>
                    Loading requests...
                </div>
            ) : error ? (
                <div style={{ textAlign: "center", padding: "40px", color: "#d32f2f", background: "#ffebee", borderRadius: "8px", margin: "20px" }}>
                    <p><strong>Connection Error:</strong> {error}</p>
                </div>
            ) : (
                <>
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
                                {currentItems.length > 0 ? (
                                    currentItems.map(r => (
                                        <tr key={r._id}>
                                            <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <strong>{r.disposerId?.name || r.disposerName || "Unknown"}</strong> <br />
                                                <small>{r.disposerId?.profile?.phone || "No phone"}</small>
                                            </td>
                                            <td>{r.wasteTypes?.join(", ")}</td>
                                            <td>{r.wasteQuantity}</td>
                                            <td>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    <span className={`status-badge ${r.status?.replace(/\s+/g, '-').toLowerCase() || "pending"}`}>
                                                        {r.status === "Waste Collected" ? "Collected" : (r.status || "Pending")}
                                                    </span>
                                                    {r.completionLocation && (
                                                        <div style={{ fontSize: '0.7rem', color: '#4a5568', background: '#f0fff4', padding: '4px', borderRadius: '4px', border: '1px solid #c6f6d5' }}>
                                                            <FaShieldAlt style={{ color: '#2f855a' }} /> GPS Verified <br/>
                                                            <a href={`https://www.google.com/maps?q=${r.completionLocation[1]},${r.completionLocation[0]}`} target="_blank" rel="noreferrer" style={{ fontSize: '0.65rem', color: '#2b6cb0' }}>
                                                                View Actual Link
                                                            </a>
                                                        </div>
                                                    )}
                                                    {r.completedAt && (
                                                        <small style={{ fontSize: '0.65rem', color: '#718096' }}>
                                                            <FaHistory /> {new Date(r.completedAt).toLocaleTimeString()}
                                                        </small>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                {r.collectorId ? (
                                                    <div>
                                                        <strong>{r.collectorId.name}</strong> <br />
                                                        <small>{r.collectorId.phone || r.collectorId.profile?.phone || "N/A"}</small>
                                                    </div>
                                                ) : (
                                                    <div className="assign-container" style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                                                        <div style={{
                                                            color: "#c53030",
                                                            background: "#fff5f5",
                                                            padding: "4px 8px",
                                                            borderRadius: "4px",
                                                            border: "1px solid #feb2b2",
                                                            fontSize: "0.75rem",
                                                        }}>
                                                            <strong>Manual Assignment Required</strong><br />
                                                            <small>No collectors in {r.ward || "Area"}</small>
                                                        </div>
                                                        <select 
                                                            disabled={assigning === r._id}
                                                            onChange={(e) => handleManualAssign(r._id, e.target.value)}
                                                            style={{
                                                                padding: "6px",
                                                                borderRadius: "4px",
                                                                fontSize: "0.8rem",
                                                                border: "1px solid #cbd5e1",
                                                                cursor: "pointer",
                                                                outline: "none"
                                                            }}
                                                            defaultValue=""
                                                        >
                                                            <option value="" disabled>Select Collector...</option>
                                                            {collectors.map(c => (
                                                                <option key={c._id} value={c._id}>
                                                                    {c.name} ({c.profile?.ward || "Any"})
                                                                </option>
                                                            ))}
                                                        </select>
                                                        {assigning === r._id && <small style={{ color: "blue" }}>Assigning...</small>}
                                                    </div>
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
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: "center", padding: "40px", color: "#666" }}>
                                            No waste requests found in the database.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {requests.length > itemsPerPage && (
                        <div className="pagination-container">
                            <ReactPaginate
                                breakLabel="..."
                                nextLabel="Next >"
                                onPageChange={handlePageClick}
                                pageRangeDisplayed={3}
                                pageCount={pageCount}
                                previousLabel="< Prev"
                                renderOnZeroPageCount={null}
                                className="react-paginate"
                                activeClassName="active-page"
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AdminRequests;

