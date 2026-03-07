import React, { useState, useEffect } from "react";
import "../../styles/ShowWRinC.css";
import Popup from "./Popup";
import ReactPaginate from 'react-paginate';

/**
 * onPickUp 👉 function passed from NewRqFromD
 */
const ShowWRinC = ({ data, sendDataToParent, onPickUp }) => {
  const [popupID, setPopupID] = useState(null);
  const [currentWasteRQ, setCurrentWasteRQ] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [localData, setLocalData] = useState([]);

  /* keep local copy in sync */
  useEffect(() => {
    setLocalData(data || []);
    setPopupID(null);
    setCurrentWasteRQ(null);
    setIsOpen(false);
  }, [data]);

  /**
   * 🔥 Called FROM Popup
   */
  const handleDataFromChild = async (
    index,
    statusOnPopup,
    statusOnPickup
  ) => {
    setIsOpen(statusOnPopup);

    if (statusOnPickup && currentWasteRQ) {
      await onPickUp(currentWasteRQ);

      // ✅ update UI immediately
      setLocalData((prev) =>
        prev.map((req) =>
          req._id === currentWasteRQ
            ? { ...req, status: "Picked Up" }
            : req
        )
      );

      sendDataToParent();
    }
  };

  const handlePickupBClick = (index, WRQid) => {
    setIsOpen(true);
    setPopupID(index);
    setCurrentWasteRQ(WRQid);
  };

  if (!localData || localData.length === 0) {
    return <p style={{ padding: 20 }}>No Waste Requests</p>;
  }

  // Pagination logic
  const itemsPerPage = 5;
  const itemOffset = isOpen ? 0 : window.cPaginationOffset || 0; // Store in window object or local state

  const [currentPage, setCurrentPage] = useState(0);

  const endOffset = currentPage * itemsPerPage + itemsPerPage;
  const currentItems = localData.slice(currentPage * itemsPerPage, endOffset);
  const pageCount = Math.ceil(localData.length / itemsPerPage);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

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
            {currentItems.map((req, index) => (
              <tr key={req._id}>
                <td style={{ width: "50px" }}>{currentPage * itemsPerPage + index + 1}</td>

                <td style={{ width: "600px" }}>
                  <b>Name:</b> {req.disposerName}
                  <br />
                  <b>Date:</b> {new Date(req.date).toLocaleString()}
                  <br />
                  <b>Waste Types:</b> {req.wasteTypes.join(", ")}
                  <br />
                  <b>Quantity:</b> {req.wasteQuantity || 0} kg/bags
                  <br />
                  <b>Location:</b> {req.location ? (
                    <a
                      href={`https://www.google.com/maps?q=${req.location[1]},${req.location[0]}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "#4a634a", fontWeight: "bold", textDecoration: "underline" }}
                    >
                      View on Google Maps ({req.location[1].toFixed(4)}, {req.location[0].toFixed(4)})
                    </a>
                  ) : "No location provided"}
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
                    disabled={req.status === "Picked Up"}
                    className="pickupButton"
                    style={{
                      cursor:
                        req.status === "Picked Up"
                          ? "not-allowed"
                          : "pointer",
                      opacity: req.status === "Picked Up" ? 0.6 : 1,
                    }}
                  >
                    {req.status === "Picked Up" ? "Picked" : "Pick Up"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {localData.length > itemsPerPage && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <ReactPaginate
            breakLabel="..."
            nextLabel="Next >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            pageCount={pageCount}
            previousLabel="< Prev"
            renderOnZeroPageCount={null}
            className="react-paginate"
            activeClassName="active-page"
          />
        </div>
      )}
    </div>
  );
};

export default ShowWRinC;
