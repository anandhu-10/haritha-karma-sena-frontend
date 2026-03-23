import React, { useState, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { FaCheckCircle, FaTrash, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import "../styles/PickedUpRequests.css";

const API = (process.env.REACT_APP_API_URL || "https://haritha-karma-sena-backend.onrender.com");

function PickedUpRequests() {
  const { user } = useOutletContext();
  const userId = user?.id || user?._id;
  const token = localStorage.getItem("token");

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------- FETCH DATA ---------- */
  const fetchPickedUp = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/api/disposer-requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const myPicked = res.data.filter(r => {
          const rCollectorId = typeof r.collectorId === 'object' ? r.collectorId?._id : r.collectorId;
          return rCollectorId === userId && r.status === "Picked Up";
      });

      setRequests(myPicked);
    } catch (err) {
      console.error("Fetch picked up error:", err);
    } finally {
      setLoading(false);
    }
  }, [userId, token]);

  useEffect(() => {
    if (userId) fetchPickedUp();
  }, [userId, fetchPickedUp]);

  /* ---------- COMPLETE REQUEST ---------- */
  const handleComplete = async (reqId) => {
    if (!window.confirm("Mark this collection as successfully completed?")) return;

    try {
      await axios.patch(`${API}/api/disposer-requests/${reqId}/status`, {
        status: "Completed"
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Request marked as Completed! ✅ Disposer notified.");
      fetchPickedUp();
    } catch (err) {
      console.error("Update status error:", err);
      alert("Failed to update status.");
    }
  };

  if (loading) return <div className="loader">Loading your tasks...</div>;

  return (
    <div className="picked-up-requests-container">
      <div className="picked-header">
        <FaCheckCircle className="header-icon" />
        <h2>My Picked Up Tasks</h2>
        <p>Active collections you have claimed and are in progress.</p>
      </div>

      <div className="requests-grid">
        {requests.length === 0 ? (
          <div className="empty-state">
            <h3>No active pickups</h3>
            <p>Go to "View Requests" to claim new waste disposal tasks in your ward.</p>
          </div>
        ) : (
          requests.map((req) => (
            <div key={req._id} className="picked-card">
              <div className="picked-card-top">
                {req.image && <img src={req.image} alt="Waste" className="picked-img" />}
                <div className="picked-badge">Picked Up</div>
              </div>

              <div className="picked-card-body">
                <div className="picked-main-info">
                  <h3>{req.disposerName}</h3>
                  <span className="picked-date">{new Date(req.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="picked-details-list">
                  <div className="detail-item">
                    <strong>Types:</strong> {req.wasteTypes?.join(", ")}
                  </div>
                  <div className="detail-item">
                    <strong>Quantity:</strong> {req.wasteQuantity} kg/bags
                  </div>
                  <div className="detail-item">
                    <FaClock className="icon-small" /> <strong>Time Slot:</strong> {req.timeSlot || "Anytime"}
                  </div>
                  {req.location && (
                     <div className="detail-item">
                       <FaMapMarkerAlt className="icon-small" />
                       <a href={`https://www.google.com/maps?q=${req.location[1]},${req.location[0]}`} target="_blank" rel="noreferrer" className="map-link">
                         View on Google Maps
                       </a>
                     </div>
                  )}
                </div>

                <button 
                  className="complete-btn"
                  onClick={() => handleComplete(req._id)}
                >
                  <FaCheckCircle /> Mark as Completed
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PickedUpRequests;
