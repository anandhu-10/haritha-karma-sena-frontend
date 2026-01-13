import React, { useState } from "react";
import "./../styles/profilePopup.css";

function ProfilePopup({ onClose }) {
  const user = JSON.parse(localStorage.getItem("user"));

  const storedProfile =
    JSON.parse(localStorage.getItem("disposerProfile")) || {};

  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    phone: storedProfile.phone || "",
    pincode: storedProfile.pincode || "",
    location: storedProfile.location || "",
    panchayath: storedProfile.panchayath || "",
    ward: storedProfile.ward || "",
  });

  if (!user) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    localStorage.setItem("disposerProfile", JSON.stringify(formData));
    setEditMode(false);
  };

  return (
    <div className="popupOverlay">
      <div className="popupCard">
        <h2>My Profile</h2>

        {/* USER INFO */}
        <div className="section">
          <h4>User Info</h4>
          <p><b>Name:</b> {user.name || "Disposer"}</p>
          <p><b>Email:</b> {user.email}</p>
          <p><b>Role:</b> {user.role}</p>
        </div>

        {/* CONTACT & LOCATION */}
        <div className="section">
          <h4>Contact & Location</h4>

          {editMode ? (
            <>
              <input
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
              />
              <input
                name="pincode"
                placeholder="Pin Code"
                value={formData.pincode}
                onChange={handleChange}
              />
              <input
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleChange}
              />
              <input
                name="panchayath"
                placeholder="Panchayath"
                value={formData.panchayath}
                onChange={handleChange}
              />
              <input
                name="ward"
                placeholder="Ward"
                value={formData.ward}
                onChange={handleChange}
              />
            </>
          ) : (
            <>
              <p><b>Phone:</b> {formData.phone || "-"}</p>
              <p><b>Pin Code:</b> {formData.pincode || "-"}</p>
              <p><b>Location:</b> {formData.location || "-"}</p>
              <p><b>Panchayath:</b> {formData.panchayath || "-"}</p>
              <p><b>Ward:</b> {formData.ward || "-"}</p>
            </>
          )}
        </div>

        {/* ACTIONS */}
        <div className="popupActions">
          {editMode ? (
            <button onClick={handleSave}>Save</button>
          ) : (
            <button onClick={() => setEditMode(true)}>Edit</button>
          )}

          <button className="secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePopup;
