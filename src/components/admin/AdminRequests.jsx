import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from 'react-paginate';

const AdminRequests = () => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get(`${(process.env.REACT_APP_API_URL || "https://haritha-karma-sena-backend.onrender.com")}/api/admin/requests`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRequests(data);
        } catch (error) {
            console.error("Error fetching requests:", error);
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
                        {currentItems.map(r => (
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
        </div>
    );
};

export default AdminRequests;
