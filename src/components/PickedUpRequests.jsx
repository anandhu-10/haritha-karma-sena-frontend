import React, { useState, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { FaCheckCircle, FaMapMarkerAlt, FaClock, FaHome } from "react-icons/fa";
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
          return rCollectorId === userId && (r.status === "Picked Up" || r.status === "Waste Collected");
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

  /* ---------- GPS RADIUS CHECK ---------- */
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; 
  };

  /* ---------- UPDATE STATUS ---------- */
  const handleStatusUpdate = async (reqId, nextStatus, confirmMsg, targetLocation) => {
    if (!window.confirm(confirmMsg)) return;

    // 📍 Real-time GPS verification for physical collection
    let completionLocation = null;
    if (nextStatus === "Waste Collected" || nextStatus === "Completed") {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser. Please use a modern device.");
            return;
        }

        try {
            const pos = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true });
            });

            const currentLat = pos.coords.latitude;
            const currentLng = pos.coords.longitude;
            completionLocation = [currentLng, currentLat];

            if (targetLocation && targetLocation.length === 2) {
                const distance = getDistance(currentLat, currentLng, targetLocation[1], targetLocation[0]);
                console.log("📍 GPS Distance check:", distance.toFixed(2), "meters");

                if (distance > 50) {
                    alert(`⚠️ VERIFICATION FAILED: You are ${Math.round(distance)}m away. You must be within 50 meters of the house to mark this.`);
                    return;
                }
            }
        } catch (err) {
            alert(`GPS Error: ${err.message}. Please enable location permissions!`);
            return;
        }
    }

    try {
      await axios.patch(`${API}/api/disposer-requests/${reqId}/status`, {
        status: nextStatus,
        completionLocation
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert(`Status updated to: ${nextStatus}! ✅ GPS Verified.`);
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
              </div>

              <div className="picked-card-body">
                <div className="picked-main-info">
                  <h3>{req.disposerName}</h3>
                  <span className={`status-badge-inline ${req.status === 'Waste Collected' ? 'collected' : ''}`}>
                    {req.status}
                  </span>
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

                <div className="card-actions">
                  {req.status === "Picked Up" ? (
                    <button 
                      className="collect-btn"
                      onClick={() => handleStatusUpdate(req._id, "Waste Collected", "Confirm you have taken the waste from the house? 🏠", req.location)}
                    >
                      <FaHome style={{ marginRight: '8px' }} /> I have taken the Waste
                    </button>
                  ) : (
                    <button 
                      className="complete-btn final"
                      onClick={() => handleStatusUpdate(req._id, "Completed", "Finalize this collection as successfully completed?", req.location)}
                    >
                      <FaCheckCircle style={{ marginRight: '8px' }} /> Mark as Completed
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PickedUpRequests;
