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
