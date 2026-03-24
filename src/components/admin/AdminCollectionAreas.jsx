import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faCalendarAlt, faTrash, faTruck, faSync } from '@fortawesome/free-solid-svg-icons';
import "./AdminCollectionAreas.css";

const API = (process.env.REACT_APP_API_URL || "https://haritha-karma-sena-backend.onrender.com");

const AdminCollectionAreas = () => {
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAreas = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API}/api/collectionAreas`);
            setAreas(res.data);
        } catch (err) {
            console.error("Failed to fetch collection areas", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAreas();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to remove this data?")) return;
        try {
            await axios.delete(`${API}/api/collectionAreas/${id}`);
            alert("Record removed successfully");
            fetchAreas();
        } catch (err) {
            alert("Failed to delete record");
        }
    };

    if (loading) return <div className="admin-loader">📡 Fetching data...</div>;

    return (
        <div className="admin-collection-container">
            <div className="admin-section-header">
                <h2><FontAwesomeIcon icon={faTruck} /> Collector Area Schedules</h2>
                <button className="refresh-btn" onClick={fetchAreas}><FontAwesomeIcon icon={faSync} /></button>
            </div>

            <div className="admin-table-wrapper">
                <table className="admin-custom-table">
                    <thead>
                        <tr>
                            <th>Collector Name</th>
                            <th>Target Ward</th>
                            <th>Scheduled Date</th>
                            <th>Waste Specialties</th>
                            <th>Target Location</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {areas.length === 0 ? (
                            <tr><td colSpan="6" style={{ textAlign: 'center' }}>No active schedules found.</td></tr>
                        ) : (
                            areas.map((area) => (
                                <tr key={area._id}>
                                    <td><strong>{area.userId?.name || "N/A"}</strong></td>
                                    <td>Ward {area.userId?.profile?.ward || "N/A"}</td>
                                    <td><FontAwesomeIcon icon={faCalendarAlt} /> {area.date}</td>
                                    <td>
                                        <div className="waste-tags">
                                            {area.wasteTypes?.map((t, idx) => (
                                                <span key={idx} className="waste-tag">{t}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td>
                                        {area.location?.coordinates ? (
                                             <a 
                                               href={`https://www.google.com/maps?q=${area.location.coordinates[1]},${area.location.coordinates[0]}`}
                                               target="_blank" rel="noreferrer" className="admin-map-btn"
                                             >
                                                <FontAwesomeIcon icon={faMapMarkerAlt} /> View Map
                                             </a>
                                        ) : "N/A"}
                                    </td>
                                    <td>
                                        <button className="delete-btn-sm" onClick={() => handleDelete(area._id)}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminCollectionAreas;
