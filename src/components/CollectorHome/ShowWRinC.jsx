import React, { useState, useEffect } from "react";
import "../../styles/ShowWRinC.css";
import Popup from "./Popup";
import ReactPaginate from 'react-paginate';

/** 📍 Haversine Distance Helper **/
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * onPickUp 👉 function passed from NewRqFromD
 */
const ShowWRinC = ({ user, data, sendDataToParent, onPickUp }) => {
  const [popupID, setPopupID] = useState(null);
  const [currentWasteRQ, setCurrentWasteRQ] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [localData, setLocalData] = useState([]);

  const [currentPage, setCurrentPage] = useState(0);

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

      <div className="wrq-grid">
        {currentItems.map((req, index) => (
          <div key={req._id} className="wrq-card">
            
            {/* 📸 IMAGE SECTION */}
            <div className="wrq-image-container">
              {req.image ? (
                <img src={req.image} alt="Waste" className="wrq-image" />
              ) : (
                <div className="wrq-no-image">No Image<br/>Provided</div>
              )}
            </div>

            {/* 📝 DETAILS SECTION */}
            <div className="wrq-details">
              <div className="wrq-header">
                <h3>{req.disposerName}</h3>
                <span className="wrq-date">{new Date(req.date).toLocaleString()}</span>
              </div>

              <div className="wrq-info-grid">
                <div className="wrq-info-item">
                  <span className="info-label">Types</span>
                  <span className="info-value">{req.wasteTypes.join(", ")}</span>
                </div>
                <div className="wrq-info-item">
                  <span className="info-label">Quantity</span>
                  <span className="info-value">{req.wasteQuantity || 0} kg/bags</span>
                </div>
              </div>

              {/* 📍 LOCATION */}
              <div className="wrq-location">
                {req.location ? (
                  <>
                    <a
                      href={`https://www.google.com/maps?q=${req.location[1]},${req.location[0]}`}
                      target="_blank"
                      rel="noreferrer"
                      className="wrq-map-link"
                    >
                      📍 View on Maps
                    </a>
                    {(() => {
                      const collectorLoc = user?.profile?.lastLocation;
                      if (collectorLoc && Array.isArray(collectorLoc) && collectorLoc.length === 2 && req.location) {
                        const dist = getDistance(collectorLoc[1], collectorLoc[0], req.location[1], req.location[0]);
                        return (
                          <span className="wrq-distance">
                            ({dist.toFixed(2)} km away)
                          </span>
                        );
                      }
                      return null;
                    })()}
                  </>
                ) : (
                  <span className="wrq-no-location">No location provided</span>
                )}
              </div>
            </div>

            {/* 🎯 ACTION SECTION */}
            <div className="wrq-action">
              <button
                onClick={() => handlePickupBClick(index, req._id)}
                disabled={req.status === "Picked Up"}
                className={`pickupButton ${req.status === "Picked Up" ? "picked" : ""}`}
              >
                {req.status === "Picked Up" ? "Picked Up" : "Pick Up"}
              </button>
            </div>
          </div>
        ))}
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
