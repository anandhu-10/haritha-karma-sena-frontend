import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/login.css"; // ✅ SAME CSS AS LOGIN

function DisposerDetails() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    phone: "",
    pincode: "",
    location: "",
    panchayath: "",
    ward: "",
  });

  /* 🔁 AUTO-FILL IF DATA EXISTS */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("disposerProfile"));
    if (saved) setFormData(saved);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ SAVE PROFILE DATA
    localStorage.setItem("disposerProfile", JSON.stringify(formData));

    navigate("/disposer");
  };

  return (
    <div className="body">
      {/* 🔝 SAME HEADER AS LOGIN */}
      <header className="headerHome">
        <nav>
          <div className="containerHomeNav">
            <h1 onClick={() => navigate("/")}>HARITHA KARMA SENA</h1>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
            </ul>
          </div>
        </nav>
      </header>

      {/* 🔽 SAME CENTER CARD */}
      <div className="tray">
        <div className="container-login">
          <h1>Complete Your Profile</h1>

          <form onSubmit={handleSubmit} className="input-container">
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="pincode"
              placeholder="Pin Code"
              value={formData.pincode}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="panchayath"
              placeholder="Panchayath"
              value={formData.panchayath}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="ward"
              placeholder="Ward"
              value={formData.ward}
              onChange={handleChange}
              required
            />

            <input type="submit" value="Save & Continue" />
          </form>
        </div>
      </div>
    </div>
  );
}

export default DisposerDetails;
