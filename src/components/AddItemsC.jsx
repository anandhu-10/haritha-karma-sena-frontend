import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import MapComponent from "./MapComponent";
import "../styles/addItemsC.css";

function AddItemsC() {
  const { user } = useOutletContext();

  const [activeTab, setActiveTab] = useState("wasteType");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  const userId = user?._id || user?.id || user?.userId;

  if (!userId) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>User not loaded</h2>
        <p>Please login again or refresh the page.</p>
      </div>
    );
  }

  /* ---------- HANDLERS ---------- */

  const handleCheckboxChange = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  const validationCheck = () => {
    if (selectedTypes.length === 0) {
      shake();
      return;
    }
    setActiveTab("location");
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const payload = {
        userId,
        email: user.email,
        date: new Date().toLocaleString(),
        wasteTypes: selectedTypes,
        location: {
          type: "Point",
          coordinates: location, // [lng, lat]
        },
      };

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/collectionAreas`, // ✅ FIXED
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Request failed");

      alert("Collection area added successfully");

      setSelectedTypes([]);
      setLocation(null);
      setActiveTab("wasteType");
    } catch (err) {
      console.error(err);
      alert("Failed to add collection area");
    } finally {
      setLoading(false);
    }
  };

  const shake = () => {
    const el = document.getElementById("container");
    if (!el) return;
    el.classList.add("error");
    setTimeout(() => el.classList.remove("error"), 800);
  };

  return (
    <div className="body" id="container">
      <div className="content">

        {/* STEP 1 */}
        {activeTab === "wasteType" && (
          <div className="tab">
            <h2>Waste Type</h2>

            <div className="checkbox-container">
              {["Plastic", "Metal", "Paper", "Hazardous", "Organic"].map(
                (type) => (
                  <label key={type}>
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type)}
                      onChange={() => handleCheckboxChange(type)}
                    />
                    {type}
                  </label>
                )
              )}
            </div>

            <button className="next-btn" onClick={validationCheck}>
              Next
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {activeTab === "location" && (
          <div className="tab get-location-tab">
            <p>Select a location on the map.</p>

            <MapComponent onLocationSelect={setLocation} />

            <div className="back-submit-btn-component">
              <button onClick={() => setActiveTab("wasteType")}>
                Back
              </button>
              <button
                disabled={!location}
                onClick={() => setActiveTab("confirm")}
              >
                Confirm Location
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {activeTab === "confirm" && (
          <div className="tab">
            <h3>Confirm Collection Area</h3>

            <p>
              <b>Waste Types:</b> {selectedTypes.join(", ")}
            </p>
            <p>
              <b>Location:</b> {location?.[1]}, {location?.[0]}
            </p>

            <div className="back-submit-btn-component">
              <button onClick={() => setActiveTab("location")}>
                Back
              </button>
              <button onClick={handleSubmit} disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default AddItemsC;
