import React, { useState, useEffect } from "react";
import ShowWRinC from "./CollectorHome/ShowWRinC";
import "../styles/NewRqFromD.css";

function NewRqFromD({ user }) {
  const [newRqFromD, setNewRqFromD] = useState([]);
  const [showRQ, setShowRQ] = useState(null);
  const [currentPage] = useState(0);

  const ROWS_PER_PAGE = 10;

  /* ---------- FETCH DISPOSER REQUESTS ---------- */
  async function fetchNewRqFromD() {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/disposer-requests`
      );

      const data = await res.json();

      const grouped = [
        {
          _id: "all",
          area: "All Areas",
          nofNewRqFromD: data.length,
          newRequests_ids: data,
        },
      ];

      setNewRqFromD(grouped);
    } catch (err) {
      console.error("FETCH ERROR:", err);
    }
  }

  useEffect(() => {
    fetchNewRqFromD();
  }, []);

  /* ---------- PICK UP HANDLER (FIXED) ---------- */
  const handlePickUp = async (requestId) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/collector/pickup/${requestId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            collectorId: user._id, // 🔥 ASSIGN COLLECTOR
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
