import React, { useState, useEffect } from "react";
import "../../styles/ShowWRinC.css";
import Popup from "./Popup";

/**
 * onPickUp 👉 function passed from NewRqFromD
 */
const ShowWRinC = ({ data, sendDataToParent, onPickUp }) => {
  const [popupID, setPopupID] = useState(null);
  const [currentWasteRQ, setCurrentWasteRQ] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [localData, setLocalData] = useState([]);

  /* keep local copy in sync */
  useEffect(() => {
    setLocalData(data || []);
    setPopupID(null);
    setCurrentWasteRQ(null);
    setIsOpen(false);
  }, [data]);

  /**
   * 🔥 Called FROM Popup
   */
  const handleDataFromChild = async (
    index,
    statusOnPopup,
    statusOnPickup
  ) => {
    setIsOpen(statusOnPopup);

    if (statusOnPickup && currentWasteRQ) {
      await onPickUp(currentWasteRQ);

      // ✅ update UI immediately
      setLocalData((prev) =>
        prev.map((req) =>
          req._id === currentWasteRQ
            ? { ...req, status: "Picked Up" }
            : req
        )
      );

      sendDataToParent();
    }
  };

  const handlePickupBClick = (index, WRQid) => {
    setIsOpen(true);
    setPopupID(index);
    setCurrentWasteRQ(WRQid);
  };

  if (!localData || localData.length === 0) {
    return <p style={{ padding: 20 }}>No Waste Requests</p>;
  }

  return (
    <div className="WasteRQSection">
      {/* 🔔 CONFIRM POPUP */}
      <Popup
        num={popupID}
        isOpen={isOpen}
        sendDataToParent={handleDataFromChild}
        wrqid={currentWasteRQ}
      />

      <h2>Waste Requests</h2>

      <div className="table-container">
        <table className="WRQ-table">
          <tbody>
            {localData.map((req, index) => (
              <tr key={req._id}>
                <td style={{ width: "50px" }}>{index + 1}</td>

                <td style={{ width: "600px" }}>
                  <b>Name:</b> {req.disposerName}
                  <br />
                  <b>Date:</b> {new Date(req.date).toLocaleString()}
                  <br />
                  <b>Waste Types:</b> {req.wasteTypes.join(", ")}
                  <br />
                  {req.image && (
                    <>
                      <b>Image:</b>
                      <br />
                      <img
                        src={req.image}
                        width={200}
                        height={200}
                        alt="Waste"
                      />
                    </>
                  )}
                </td>

                <td style={{ width: "200px" }}>
                  <button
                    onClick={() => handlePickupBClick(index, req._id)}
                    disabled={req.status === "Picked Up"}
                    className="pickupButton"
                    style={{
                      cursor:
                        req.status === "Picked Up"
                          ? "not-allowed"
                          : "pointer",
                      opacity: req.status === "Picked Up" ? 0.6 : 1,
                    }}
                  >
                    {req.status === "Picked Up" ? "Picked" : "Pick Up"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShowWRinC;
