import React, { useContext, useState } from "react";
import { GiCancel } from "react-icons/gi";
import { RiArrowDropDownLine } from "react-icons/ri";
import "../styles/activity.css";

import { WasteContext } from "../pages/DisposerHome";

function Activity({ reportRender }) {
  const { wasteDetails, setWasteDetails } = useContext(WasteContext);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);

  /* ---------- SAFE EXIT ---------- */
  if (!wasteDetails || wasteDetails.length === 0) {
    reportRender();
    return null;
  }

  /* ---------- DELETE HANDLER ---------- */
  const handleDelete = (index) => {
    setWasteDetails((prev) => prev.filter((_, i) => i !== index));
    setDeleteIndex(null);
  };

  return (
    <div className="activityContainer">
      <div className="activityContent" style={{ paddingBottom: "20px" }}>
        {/* HEADER */}
        <div className="activityHeader">
          <h2>Your Activity</h2>
          <RiArrowDropDownLine onClick={reportRender} />
        </div>

        {/* LIST */}
        {wasteDetails.map((item, index) => (
          <div key={index} className="activity">
            <div 
              className="waste-card" 
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
            >
              <div className="left-content">
                <ul>
                  <li>{item.date}</li>
                  <li id="main">
                    {Array.isArray(item.wasteTypes) ? item.wasteTypes.join(", ") : item.wasteTypes || "Waste"}
                  </li>
                  <li>Quantity: {item.wasteQuantity || 0} kg/bags</li>
                  {(item.status?.toUpperCase() === "PICKED UP" || item.status?.toUpperCase() === "ASSIGNED") && expandedIndex !== index && (
                    <li style={{ color: "#059669", fontWeight: "bold", fontStyle: "italic", fontSize: "12px", marginTop: "4px" }}>
                      Tap to view Collector details
                    </li>
                  )}
                </ul>
              </div>

              <div className="right-content">
                {deleteIndex !== index ? (
                  <div className="statusDetails">
                    <h4>Status : {item.status}</h4>

                    {item.status !== "Completed" && (
                      <div className="icons">
                        <GiCancel
                          className="ico"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteIndex(index);
                          }}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="delete" onClick={(e) => e.stopPropagation()}>
                    <h4>Are you sure?</h4>
                    <section>
                      <button
                        id="cancel-bT"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteIndex(null);
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        id="delete-bT"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(index);
                        }}
                      >
                        Delete
                      </button>
                    </section>
                  </div>
                )}
              </div>              {/* COLLECTOR DETAILS EXPAND (Below Left/Right layout) */}
              {expandedIndex === index && item.collectorId && (
                <div style={{
                  width: "100%",
                  marginTop: "12px",
                  padding: "12px",
                  backgroundColor: "#ecfdf5",
                  border: "1px solid #10b981",
                  borderRadius: "8px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  color: "#064e3b"
                }} onClick={(e) => e.stopPropagation()}>
                  <strong style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    🚛 Collector Assigned
                  </strong>
                  <span>Name: {item.collectorId?.name || "Unknown"}</span>
                  <span>Contact: <b>{item.collectorId?.profile?.phone || "Not provided"}</b></span>
                </div>
              )}

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Activity;
