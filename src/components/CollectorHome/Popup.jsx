// Popup.js
import React, { useState } from "react";
import "../../styles/CollectorHome/Popup.css";

const Popup = ({ num, isOpen, sendDataToParent, wrqid }) => {
  const [timeSlot, setTimeSlot] = useState("");

  if (!isOpen) return null;

  const closePopup = (pickedUp) => {
    // num, popupOpen, pickupStatus, timeSlot
    if (pickedUp && !timeSlot.trim()) {
      alert("Please assign a time slot for this pickup (e.g. Today 4:00 PM - 5:00 PM)");
      return;
    }
    // sendDataToParent(index, statusOnPopup, statusOnPickup, timeSlot)
    sendDataToParent(num, false, pickedUp, timeSlot);
    if (!pickedUp) {
      setTimeSlot(""); // Clear if cancelled
    }
  };

  const updateStatus = async () => {
    closePopup(true);
  };

  const onYes = () => {
    updateStatus();
  };

  const onNo = () => {
    closePopup(false);
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
          style={{ width: "100%", padding: "10px", margin: "15px 0", borderRadius: "8px", border: "1px solid #ccc" }}
        />

        <div className="buttons">
          <button onClick={onYes}>Confirm</button>
          <button onClick={onNo}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
