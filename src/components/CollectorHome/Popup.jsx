// Popup.js
import React, { useState } from "react";
import "../../styles/CollectorHome/Popup.css";

const Popup = ({ num, isOpen, sendDataToParent, wrqid }) => {
  const [timeSlot, setTimeSlot] = useState("");

  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const closePopup = (pickedUp) => {
    if (pickedUp && !timeSlot.trim()) {
      alert("Please assign a time slot for this pickup (e.g. Today 4:00 PM - 5:00 PM)");
      return;
    }
    if (pickedUp) setSubmitting(true);
    sendDataToParent(num, false, pickedUp, timeSlot);
    if (!pickedUp) {
      setTimeSlot("");
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !submitting) {
      closePopup(true);
    }
  };

  return (
    <div className="popupContainer">
      <div className="popupContent">
        <span className="closeBtn" onClick={onNo}>
          &times;
        </span>

        <p>Assign a Time Slot for this pickup</p>
        <input 
          type="text" 
          placeholder="e.g. Today 4:00 PM - 5:00 PM" 
          value={timeSlot}
          onChange={(e) => setTimeSlot(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={submitting}
          autoFocus
          style={{ width: "100%", padding: "10px", margin: "15px 0", borderRadius: "8px", border: "1px solid #ccc" }}
        />

        <div className="buttons">
          <button onClick={() => closePopup(true)} disabled={submitting}>
            {submitting ? "Processing..." : "Confirm"}
          </button>
          <button onClick={() => closePopup(false)} disabled={submitting}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
