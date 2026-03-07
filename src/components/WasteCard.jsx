import React, { useState, useEffect, useContext, useRef } from "react";
import "../styles/wastecard.css";
import { GiCancel } from "react-icons/gi";
import wasteChildren from "../assets/retink-waste-01.jpg";
import Activity from "./Activity";
import { WasteContext } from "../pages/DisposerHome";

export const CancelWasteContext = React.createContext();

function WasteCard() {
  const { wasteDetails, setWasteDetails } = useContext(WasteContext);

  const [showActivity, setShowActivity] = useState(false);
  const [deleteWasteTab, setDeleteWasteTab] = useState(false);

  const cardRef = useRef(null);
  const currentWaste = wasteDetails?.[0] || null;

  /* ---------- CLICK TO TOGGLE ACTIVITY ---------- */
  useEffect(() => {
    const handleClick = (e) => {
      if (!cardRef.current) return;

      if (
        cardRef.current.contains(e.target) &&
        !e.target.closest(".icons") &&
        !e.target.closest(".delete") &&
        !e.target.closest(".defaultViewContainer")
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

            <div className="right-content">
              {!deleteWasteTab ? (
                <div className="statusDetails">
                  <h4>{currentWaste.status || "Pending"}</h4>

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
                        handleWasteDelete(0);
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
