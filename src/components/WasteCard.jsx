import React, { useState, useEffect, useContext, useRef } from "react";
import "../styles/wastecard.css";
import { GiCancel } from "react-icons/gi";
import wasteChildren from "../assets/retink-waste-01.jpg";
import Activity from "./Activity";
import { WasteContext } from "../pages/DisposerHome";

export const CancelWasteContext = React.createContext();

function WasteCard({ wasteData, paid, index = 0 }) {
  const { wasteDetails, setWasteDetails } = useContext(WasteContext);

  const [showActivity, setShowActivity] = useState(false);
  const [deleteWasteTab, setDeleteWasteTab] = useState(false);
  const [showCollectorPopup, setShowCollectorPopup] = useState(false);

  const cardRef = useRef(null);
  const currentWaste = wasteData || wasteDetails?.[index] || wasteDetails?.[0] || null;

  /* ---------- CLICK TO TOGGLE ACTIVITY ---------- */
  useEffect(() => {
    const handleClick = (e) => {
      if (!cardRef.current) return;

      if (
        cardRef.current.contains(e.target) &&
        !e.target.closest(".icons") &&
        !e.target.closest(".delete") &&
        !e.target.closest(".defaultViewContainer") &&
        !e.target.closest(".activityContainer") &&
        !e.target.closest(".collectorPopupWrap")
      ) {
        setShowActivity((prev) => !prev);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  /* ---------- STATUS HELPER ---------- */
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "picked up": return "status-picked-up";
      case "completed": return "status-completed";
      case "cancelled": return "status-cancelled";
      default: return "status-pending";
    }
  };

  /* ---------- DELETE WASTE ---------- */
  const handleWasteDelete = (index) => {
    setWasteDetails((prev) => prev.filter((_, i) => i !== index));
    setDeleteWasteTab(false);
    setShowActivity(false);
  };

  return (
    <div className={`waste-card ${getStatusClass(currentWaste?.status)}`} ref={cardRef}>
      <div
        className={`contentWaste ${showActivity ? "hide" : ""
          } ${!currentWaste ? "makeBackground" : ""}`}
      >
        {currentWaste ? (
          <div className="contentWasteInner" style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="left-content">
              <ul>
                <li>{currentWaste.date || "—"}</li>
                <li id="main">
                  {Array.isArray(currentWaste.wasteTypes)
                    ? currentWaste.wasteTypes.join(", ")
                    : currentWaste.wasteTypes || "Waste"}
                </li>
                <li>Status: {currentWaste.status || "Pending"}</li>
              </ul>
            </div>

            <div className="right-content" style={{ position: "relative" }}>
              {!deleteWasteTab ? (
                <div 
                  className="statusDetails"
                  style={{ cursor: (currentWaste.status?.toUpperCase() === "ASSIGNED" || currentWaste.status?.toUpperCase() === "PICKED UP") ? "pointer" : "default" }}
                  onClick={(e) => {
                    if (currentWaste.status?.toUpperCase() === "ASSIGNED" || currentWaste.status?.toUpperCase() === "PICKED UP") {
                      e.stopPropagation();
                      setShowCollectorPopup(!showCollectorPopup);
                    }
                  }}
                >
                  <h4>{currentWaste.status || "Pending"}</h4>
                  
                  {/* POPUP FOR COLLECTOR DETAILS ON MAIN CARD */}
                  {showCollectorPopup && currentWaste.collectorId && (
                    <div 
                      className="collectorPopupWrap"
                      style={{
                        position: "absolute",
                        top: "100%",
                        right: "0",
                        marginTop: "10px",
                        width: "250px",
                        padding: "15px",
                        backgroundColor: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "12px",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                        zIndex: 50,
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                        color: "#334155",
                        textAlign: "left"
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <strong style={{ color: "#064e3b", display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", borderBottom: "1px solid #e2e8f0", paddingBottom: "6px" }}>
                        🚛 Collector Assigned
                      </strong>
                      <span style={{ fontSize: "13px" }}>Name: <b>{currentWaste.collectorId?.name || "Unknown"}</b></span>
                      <span style={{ fontSize: "13px" }}>Phone: <b>{currentWaste.collectorId?.profile?.phone || "Not provided"}</b></span>
                      {(currentWaste.timeSlot || currentWaste.location) && (
                        <div style={{ fontSize: "12px", marginTop: "4px", color: "#64748b" }}>
                          {currentWaste.timeSlot && <div>Slot: {currentWaste.timeSlot}</div>}
                        </div>
                      )}
                    </div>
                  )}

                  {currentWaste.status === "Pending" && (
                    <div className="icons">
                      <GiCancel
                        className="ico"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteWasteTab(true);
                        }}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="delete">
                  <h4>Are you sure?</h4>
                  <section>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteWasteTab(false);
                      }}
                      id="cancel-bT"
                    >
                      No
                    </button>
                    <button
                      id="delete-bT"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWasteDelete(index);
                      }}
                    >
                      Yes, Cancel
                    </button>
                  </section>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="defaultViewContainer">
            <img src={wasteChildren} alt="No waste available" />
          </div>
        )}
      </div>

      {showActivity && (
        <CancelWasteContext.Provider value={{ deleteWasteTab }}>
          <Activity reportRender={() => setShowActivity(false)} />
        </CancelWasteContext.Provider>
      )}
    </div>
  );
}

export default WasteCard;
