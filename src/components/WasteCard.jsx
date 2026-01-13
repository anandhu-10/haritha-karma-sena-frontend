import React, { useState, useEffect, useContext, useRef } from "react";
import "../styles/wastecard.css";
import { GiCancel } from "react-icons/gi";
import wasteChildren from "../assets/retink-waste-01.jpg";
import Activity from "./Activity";
import { WasteContext } from "../pages/DisposerHome";

export const CancelWasteContext = React.createContext();

function WasteCard() {
  const { wasteDetails, setWasteDetails, user } = useContext(WasteContext);

  const [showActivity, setShowActivity] = useState(false);
  const [deleteWasteTab, setDeleteWasteTab] = useState(false);
  const [loading, setLoading] = useState(false);

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

  /* ---------- DELETE WASTE ---------- */
  const handleWasteDelete = (index) => {
    setWasteDetails((prev) => prev.filter((_, i) => i !== index));
    setDeleteWasteTab(false);
    setShowActivity(false);
  };

  /* ---------- SEND TO COLLECTOR (NEW) ---------- */
  const submitToCollector = async () => {
    if (!currentWaste) {
      alert("No waste to submit");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        disposerId: user._id,
        disposerName: user.name || user.username,
        wasteTypes: currentWaste.wasteTypes,
        location: currentWaste.location,
        date: new Date().toLocaleString(),
        status: "Pending",
      };

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/disposer-requests`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Failed");

      alert("Request sent to collector");
    } catch (err) {
      console.error(err);
      alert("Failed to send request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="waste-card" ref={cardRef}>
      <div
        className={`contentWaste ${
          showActivity ? "hide" : ""
        } ${!currentWaste ? "makeBackground" : ""}`}
      >
        {currentWaste ? (
          <div className="contentWasteInner">
            <div className="left-content">
              <ul>
                <li>{currentWaste.date || "—"}</li>
                <li id="main">{currentWaste.wasteTypes || "Waste"}</li>
                <li>Status: {currentWaste.status || "Pending"}</li>
              </ul>

              {/* ✅ SEND BUTTON */}
              <button
                className="submit-btn"
                onClick={submitToCollector}
                disabled={loading}
              >
                {loading ? "Sending..." : "Send to Collector"}
              </button>
            </div>

            <div className="right-content">
              {!deleteWasteTab ? (
                <div className="statusDetails">
                  <h4>Status : {currentWaste.status || "Pending"}</h4>

                  {currentWaste.status !== "Completed" && (
                    <div className="icons">
                      <GiCancel
                        className="ico"
                        onClick={() => setDeleteWasteTab(true)}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="delete">
                  <h4>Are you sure?</h4>
                  <section>
                    <button
                      onClick={() => setDeleteWasteTab(false)}
                      id="cancel-bT"
                    >
                      Cancel
                    </button>
                    <button
                      id="delete-bT"
                      onClick={() => handleWasteDelete(0)}
                    >
                      Delete
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
