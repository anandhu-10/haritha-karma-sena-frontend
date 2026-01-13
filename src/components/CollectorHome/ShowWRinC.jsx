import React, { useState, useEffect } from "react";
import "../../styles/ShowWRinC.css";
import Popup from "./Popup";

/**
 * onPickUp  👉 function passed from NewRqFromD
 */
const ShowWRinC = ({ data, sendDataToParent, onPickUp }) => {
  const [pickupButtonValue, setPickupButtonValue] = useState([]);
  const [disabledButtons, setDisabledButtons] = useState([]);
  const [popupID, setPopupID] = useState(null);
  const [currentWasteRQ, setCurrentWasteRQ] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setPickupButtonValue([]);
    setDisabledButtons([]);
    setPopupID(null);
    setCurrentWasteRQ(null);
  }, [data]);

  /**
   * 🔥 This function is called FROM Popup
   * statusOnPickup === true → user confirmed pickup
   */
  const handleDataFromChild = async (
    index,
    statusOnPopup,
    statusOnPickup
  ) => {
    setIsOpen(statusOnPopup);

    if (statusOnPickup && currentWasteRQ) {
      // 🔔 CALL BACKEND (SEND NOTIFICATION)
      await onPickUp(currentWasteRQ);

      // disable button
      const updatedDisabled = [...disabledButtons];
      updatedDisabled[index] = true;
      setDisabledButtons(updatedDisabled);

      const updatedPickup = [...pickupButtonValue];
      updatedPickup[index] = true;
      setPickupButtonValue(updatedPickup);

      // refresh parent list
      sendDataToParent();
    }
  };

  const handlePickupBClick = (index, WRQid) => {
    setIsOpen(true);
    setPopupID(index);
    setCurrentWasteRQ(WRQid);
  };

  if (!data || data.length === 0) {
    return <p style={{ padding: 20 }}>No Waste Requests</p>;
  }

  return (
    <div className="WasteRQSection">
      {/* 🔔 CONFIRM POPUP */}
      <Popup
        num={popupID}
        isOpen={isOpen}
        sendDataToParent={handleDataFromChild}
        wrqid={currentWasteRQ}
      />

      <h2>Waste Requests</h2>

      <div className="table-container">
        <table className="WRQ-table">
          <tbody>
            {data.map((req, index) => (
              <tr key={req._id}>
                <td style={{ width: "50px" }}>{index + 1}</td>

                <td style={{ width: "600px" }}>
                  <b>Name:</b> {req.disposerName}
                  <br />
                  <b>Date:</b> {req.date}
                  <br />
                  <b>Waste Types:</b> {req.wasteTypes.join(", ")}
                  <br />
                  {req.image && (
                    <>
                      <b>Image:</b>
                      <br />
                      <img
                        src={req.image}
                        width={200}
                        height={200}
                        alt="Waste"
                      />
                    </>
                  )}
                </td>

                <td style={{ width: "200px" }}>
                  <button
                    onClick={() => handlePickupBClick(index, req._id)}
                    disabled={disabledButtons[index]}
                    className="pickupButton"
                  >
                    {pickupButtonValue[index] ? "Picked Up" : "Pick Up"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShowWRinC;
