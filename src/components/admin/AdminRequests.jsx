import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from 'react-paginate';

const AdminRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const apiUrl = process.env.REACT_APP_API_URL || "https://haritha-karma-sena-backend.onrender.com";
            const { data } = await axios.get(`${apiUrl}/api/admin/requests`, {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 30000 // Cold start timeout
            });
            setRequests(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching requests:", error);
            let msg = error.message;
            if (error.response) {
                msg = `${error.response.status}: ${error.response.data?.message || error.response.statusText}`;
            } else if (error.request) {
                msg = "No response from server. Check CORS or if backend is awake.";
            }
            setError(msg);
        } finally {
            setLoading(false);
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
                    <div style={{ fontSize: "2rem", marginBottom: "10px" }}>⚠️</div>
                    <p><strong>Connection Error:</strong> {error}</p>
                    <div style={{ marginTop: "15px", textAlign: "left", display: "inline-block", fontSize: "0.8rem", color: "#666", background: "#fff", padding: "10px", borderRadius: "4px", border: "1px solid #ddd" }}>
                        <strong>Debug Info:</strong><br />
                        Target: {process.env.REACT_APP_API_URL || "https://haritha-karma-sena-backend.onrender.com"}/api/admin/requests<br />
                        Time: {new Date().toLocaleTimeString()}
                    </div>
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
                                                <span className={`status-badge ${r.status?.toLowerCase() || "pending"}`}>
                                                    {r.status || "Pending"}
                                                </span>
                                            </td>
                                            <td>
                                                {r.collectorId ? (
                                                    <div>
                                                        <strong>{r.collectorId.name}</strong> <br />
                                                        <small>{r.collectorId.phone || r.collectorId.profile?.phone || "N/A"}</small>
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

