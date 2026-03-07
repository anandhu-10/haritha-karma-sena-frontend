import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from 'react-paginate';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get(`${(process.env.REACT_APP_API_URL || "https://haritha-karma-sena-backend.onrender.com")}/api/admin/users`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(`${(process.env.REACT_APP_API_URL || "https://haritha-karma-sena-backend.onrender.com")}/api/admin/users/${id}/status`, { status }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchUsers();
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const deleteUser = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${(process.env.REACT_APP_API_URL || "https://haritha-karma-sena-backend.onrender.com")}/api/admin/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchUsers();
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    // Pagination logic
    const [itemOffset, setItemOffset] = useState(0);
    const itemsPerPage = 8;

    const endOffset = itemOffset + itemsPerPage;
    const currentItems = users.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(users.length / itemsPerPage);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % users.length;
        setItemOffset(newOffset);
    };

    return (
        <div className="admin-section">
            <h2>Manage Disposers</h2>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Location</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map(u => (
                        <tr key={u._id}>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td>{u.profile?.phone || "N/A"}</td>
                            <td>{u.profile?.panchayath || "N/A"}, Ward {u.profile?.ward || "N/A"}</td>
                            <td>
                                <span className={`status-badge ${u.status.toLowerCase()}`}>{u.status}</span>
                            </td>
                            <td className="actions-cell">
                                {u.status !== "Blocked" && (
                                    <button onClick={() => updateStatus(u._id, "Blocked")} className="btn-block">Block</button>
                                )}
                                {u.status === "Blocked" && (
                                    <button onClick={() => updateStatus(u._id, "Active")} className="btn-unblock">Unblock</button>
                                )}
                                <button onClick={() => deleteUser(u._id)} className="btn-delete">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {users.length > itemsPerPage && (
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

export default AdminUsers;
