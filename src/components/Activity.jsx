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
      <div className="activityContent" style={{ paddingBottom: "100px" }}>
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
            >
              <div className="left-content">
                <ul>
                  <li>{item.date}</li>
                  <li id="main">
                    {Array.isArray(item.wasteTypes) ? item.wasteTypes.join(", ") : item.wasteTypes || "Waste"}
                  </li>
                  <li>Quantity: {item.wasteQuantity || 0} kg/bags</li>
                  {expandedIndex !== index && (
                    <li style={{ color: "#0ea5e9", fontWeight: "bold", fontStyle: "italic", fontSize: "12px", marginTop: "4px" }}>
                      Tap to view {item.collectorId ? "Collector & Details" : "Details"}
                    </li>
                  )}
                </ul>
              </div>

              <div className="right-content">
                {deleteIndex !== index ? (
                  <div 
                    className="statusDetails"
                    style={{ cursor: "pointer" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedIndex(expandedIndex === index ? null : index);
                    }}
                  >
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
              </div>
              
              {/* FULL DETAILS EXPAND */}
              {expandedIndex === index && (
                <div style={{
                  width: "100%",
                  marginTop: "12px",
                  padding: "12px",
                  backgroundColor: "#f8fafc",
                  border: "1px solid #cbd5e1",
                  borderRadius: "8px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  color: "#334155"
                }} onClick={(e) => e.stopPropagation()}>
                  {/* Detailed Information given inside the item dropdown */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                     <strong>📋 View Full Activity Details</strong>
                     <span style={{ fontSize: "13px" }}><b>Time Slot:</b> {item.timeSlot || "Anytime"}</span>
                     {item.location && <span style={{ fontSize: "13px" }}><b>Location:</b> {item.location}</span>}
                     {item.address && <span style={{ fontSize: "13px" }}><b>Address:</b> {item.address}</span>}
                     {item.description && <span style={{ fontSize: "13px" }}><b>Description:</b> {item.description}</span>}
                  </div>

                  {item.collectorId && (
                     <div style={{
                        marginTop: "8px",
                        paddingTop: "8px",
                        borderTop: "1px dashed #cbd5e1",
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                        color: "#064e3b"
                      }}>
                        <strong style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          🚛 Collector Assigned
                        </strong>
                        <span style={{ fontSize: "13px" }}>Name: {item.collectorId?.name || "Unknown"}</span>
                        <span style={{ fontSize: "13px" }}>Contact: <b>{item.collectorId?.profile?.phone || "Not provided"}</b></span>
                      </div>
                  )}
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
