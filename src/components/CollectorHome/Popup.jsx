// Popup.js
import React from "react";
import "../../styles/CollectorHome/Popup.css";

const Popup = ({ num, isOpen, sendDataToParent, wrqid }) => {
  if (!isOpen) return null;

  const closePopup = (pickedUp) => {
    // num, popupOpen, pickupStatus
    sendDataToParent(num, false, pickedUp);
  };

  const updateStatus = async () => {
    try {
      if (!wrqid) {
        throw new Error("Invalid request ID");
      }

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/disposer-requests/${wrqid}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "Picked Up" }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      closePopup(true);
    } catch (err) {
      console.error("UPDATE STATUS ERROR:", err);
      alert("Failed to update pickup status");
      closePopup(false);
    }
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

        <p>Are you sure you picked this up?</p>

        <div className="buttons">
          <button onClick={onYes}>Yep</button>
          <button onClick={onNo}>Nope</button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
