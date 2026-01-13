import React, { useContext, useState } from "react";
import { GiCancel } from "react-icons/gi";
import { RiArrowDropDownLine } from "react-icons/ri";
import "../styles/activity.css";

import { WasteContext } from "../pages/DisposerHome";

function Activity({ reportRender }) {
  const { wasteDetails, setWasteDetails } = useContext(WasteContext);
  const [deleteIndex, setDeleteIndex] = useState(null);

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
      <div className="activityContent">
        {/* HEADER */}
        <div className="activityHeader">
          <h2>Your Activity</h2>
          <RiArrowDropDownLine onClick={reportRender} />
        </div>

        {/* LIST */}
        {wasteDetails.map((item, index) => (
          <div key={index} className="activity">
            <div className="waste-card">
              <div className="left-content">
                <ul>
                  <li>{item.date}</li>
                  <li id="main">{item.wasteTypes}</li>
                  <li>
                    Collector:{" "}
                    {item.collectorDetails?.[0]?.firstName || "Not assigned"}
                  </li>
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
                          onClick={() => setDeleteIndex(index)}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="delete">
                    <h4>Are you sure?</h4>
                    <section>
                      <button
                        id="cancel-bT"
                        onClick={() => setDeleteIndex(null)}
                      >
                        Cancel
                      </button>
                      <button
                        id="delete-bT"
                        onClick={() => handleDelete(index)}
                      >
                        Delete
                      </button>
                    </section>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Activity;
