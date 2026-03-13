import React, { useState, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import ShowWRinC from "./CollectorHome/ShowWRinC";
import "../styles/NewRqFromD.css";

function NewRqFromD() {
  const { user } = useOutletContext();
  const [newRqFromD, setNewRqFromD] = useState([]);
  const [showRQ, setShowRQ] = useState(null);
  const [currentPage] = useState(0);

  const ROWS_PER_PAGE = 10;

  /* ---------- FETCH DISPOSER REQUESTS ---------- */
  const fetchNewRqFromD = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${(process.env.REACT_APP_API_URL || "https://haritha-karma-sena-backend.onrender.com")}/api/disposer-requests`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      const activeRequests = data.filter(r => r.status !== "Completed");

      const grouped = [
        {
          _id: "my-area",
          area: user?.profile?.ward || "My Ward",
          nofNewRqFromD: activeRequests.length,
          newRequests_ids: activeRequests,
        },
      ];

      setNewRqFromD(grouped);
    } catch (err) {
      console.error("FETCH ERROR:", err);
    }
  }, [user]);

  useEffect(() => {
    fetchNewRqFromD();
  }, [fetchNewRqFromD]);

  /* ---------- PICK UP HANDLER (FIXED) ---------- */
  const handlePickUp = async (requestId) => {
    try {
      const userId = user?.id || user?._id;

      const res = await fetch(
        `${(process.env.REACT_APP_API_URL || "https://haritha-karma-sena-backend.onrender.com")}/api/collector/pickup/${requestId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            collectorId: userId, // 🔥 ASSIGN COLLECTOR
          }),
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Pickup failed");
      }

      alert("Pickup confirmed. Chat enabled.");

      fetchNewRqFromD();
      setShowRQ(null);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to pick up request");
    }
  };

  const startIndex = currentPage * ROWS_PER_PAGE;
  const endIndex = (currentPage + 1) * ROWS_PER_PAGE;
  const currentPageData = newRqFromD.slice(startIndex, endIndex);

  return (
    <>
      <table className="custom-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Area</th>
            <th>New Requests</th>
          </tr>
        </thead>
        <tbody>
          {currentPageData.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                No new requests
              </td>
            </tr>
          ) : (
            currentPageData.map((item, index) => (
              <tr
                key={item._id}
                onClick={() => setShowRQ(item.newRequests_ids)}
                style={{ cursor: "pointer" }}
              >
                <td>{startIndex + index + 1}</td>
                <td>{item.area}</td>
                <td>{item.nofNewRqFromD}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ---------- REQUEST DETAILS ---------- */}
      {showRQ && (
        <ShowWRinC
          user={user}
          data={showRQ}
          sendDataToParent={fetchNewRqFromD}
          onPickUp={handlePickUp} // ✅ FIXED
        />
      )}
    </>
  );
}

export default NewRqFromD;
