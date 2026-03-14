import React, { useState } from "react";
import { FaPhone, FaMapPin, FaLocationDot, FaBuilding, FaLayerGroup, FaUser, FaEnvelope, FaIdCard, FaPen, FaCheck, FaXmark } from "react-icons/fa6";
import "./../styles/profilePopup.css";

function ProfilePopup({ onClose, userType }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const roleKey = user?.role === "collector" ? "collectorProfile" : "disposerProfile";

  const storedProfile =
    JSON.parse(localStorage.getItem(roleKey)) || {};

  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    phone: storedProfile.phone || user?.profile?.phone || user?.phone || "",
    pincode: storedProfile.pincode || user?.profile?.pincode || "",
    location: storedProfile.location || user?.profile?.villageOrArea || user?.profile?.district || user?.villageOrArea || user?.district || "",
    panchayath: storedProfile.panchayath || user?.profile?.localBodyName || user?.localBodyName || "",
    ward: storedProfile.ward || user?.profile?.ward || user?.ward || "",
  });

  if (!user) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (formData.phone) {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(formData.phone)) {
        alert("Please enter a valid 10-digit phone number.");
        return;
      }
    }

    if (formData.pincode) {
      const pincodeRegex = /^[0-9]{6}$/;
      if (!pincodeRegex.test(formData.pincode)) {
        alert("Please enter a valid 6-digit pin code.");
        return;
      }
    }

    localStorage.setItem(roleKey, JSON.stringify(formData));
    setEditMode(false);
  };

  return (
    <div className="popupOverlay">
      <div className="popupCard">
        <div className="popupHeader">
          <h2>My Profile</h2>
          <button className="closeX" onClick={onClose}><FaXmark size={18} /></button>
        </div>

        <div className="popupScroll">
          {/* USER INFO */}
          <div className="profile-section">
            <h4 className="section-title"><FaUser /> User Information</h4>
            <div className="info-grid">
              <div className="info-item">
                <label><FaIdCard /> Name</label>
                <p>{user.name || "Disposer"}</p>
              </div>
              <div className="info-item">
                <label><FaEnvelope /> Email</label>
                <p>{user.email}</p>
              </div>
              <div className="info-item">
                <label><FaLayerGroup /> Role</label>
                <p>{user.role}</p>
              </div>
            </div>
          </div>

          {/* CONTACT & LOCATION */}
          <div className="profile-section">
            <h4 className="section-title"><FaLocationDot /> Contact & Location Details</h4>

            <div className="info-grid">
              <div className="info-item">
                <label><FaPhone /> Phone Number</label>
                {editMode ? (
                  <input name="phone" placeholder="Enter phone" value={formData.phone} onChange={handleChange} />
                ) : (
                  <p>{formData.phone || "Not set"}</p>
                )}
              </div>

              <div className="info-item">
                <label><FaMapPin /> Pin Code</label>
                {editMode ? (
                  <input name="pincode" placeholder="Enter pincode" value={formData.pincode} onChange={handleChange} />
                ) : (
                  <p>{formData.pincode || "Not set"}</p>
                )}
              </div>

              <div className="info-item">
                <label><FaLocationDot /> Detailed Location</label>
                {editMode ? (
                  <input name="location" placeholder="Enter location" value={formData.location} onChange={handleChange} />
                ) : (
                  <p>{formData.location || "Not set"}</p>
                )}
              </div>

              <div className="info-item">
                <label><FaBuilding /> {user?.role === "collector" ? "Primary Service Area" : "Panchayath / Municipality"}</label>
                {editMode ? (
                  <input name="panchayath" placeholder={user?.role === "collector" ? "Enter area" : "Enter panchayath"} value={formData.panchayath} onChange={handleChange} />
                ) : (
                  <p>{formData.panchayath || "Not set"}</p>
                )}
              </div>

              <div className="info-item">
                <label><FaLayerGroup /> {user?.role === "collector" ? "Experience / Notes" : "Ward Number / Name"}</label>
                {editMode ? (
                  <input name="ward" placeholder={user?.role === "collector" ? "e.g. 5 years" : "Enter ward"} value={formData.ward} onChange={handleChange} />
                ) : (
                  <p>{formData.ward || "Not set"}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="popupActions">
          {editMode ? (
            <button className="save-btn" onClick={handleSave}><FaCheck /> Save Changes</button>
          ) : (
            <button className="edit-btn" onClick={() => setEditMode(true)}><FaPen /> Edit Profile</button>
          )}

          <button className="close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePopup;
