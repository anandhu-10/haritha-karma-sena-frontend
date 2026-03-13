import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { DISTRICTS, KERALA_DATA } from "../data/keralaData";
import "../styles/login.css"; // ✅ SAME CSS AS LOGIN

function DisposerDetails() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    phone: "",
    pincode: "",
    location: "",
    district: "",
    panchayath: "",
    ward: "",
  });

  const user = JSON.parse(localStorage.getItem("user"));

  /* 🔁 AUTO-FILL IF DATA EXISTS */
  useEffect(() => {
    if (user?.profile) {
      setFormData({
        phone: user.profile.phone || "",
        pincode: user.profile.pincode || "",
        location: user.profile.location || "",
        district: user.profile.district || "",
        panchayath: user.profile.panchayath || "",
        ward: user.profile.ward || "",
      });
    }
  }, [user?.profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      if (name === "district") {
        newData.panchayath = "";
      }
      return newData;
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${(process.env.REACT_APP_API_URL || "https://haritha-karma-sena-backend.onrender.com")}/api/auth/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) throw new Error("Failed to update profile");

      const data = await res.json();

      // ✅ SYNC LOCAL STORAGE
      const updatedUser = { ...user, profile: data.user.profile };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      alert("Profile updated successfully!");
      navigate(user.role === "collector" ? "/collector" : "/disposer");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
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

            {/* 🏘️ KERALA GEOGRAPHY SELECTION */}
            <select
              name="district"
              required
              onChange={handleChange}
              value={formData.district}
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', marginTop: '10px' }}
            >
              <option value="">Select District</option>
              {DISTRICTS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <select
              name="panchayath"
              required
              onChange={handleChange}
              value={formData.panchayath}
              disabled={!formData.district}
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', marginTop: '10px' }}
            >
              <option value="">Select Local Body</option>
              {formData.district && KERALA_DATA[formData.district].map(lb => (
                <option key={lb} value={lb}>{lb}</option>
              ))}
            </select>

            <select
              name="ward"
              required
              onChange={handleChange}
              value={formData.ward}
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', marginTop: '10px' }}
            >
              <option value="">Select Ward</option>
              {[...Array(50)].map((_, i) => (
                <option key={i + 1} value={`Ward ${i + 1}`}>Ward {i + 1}</option>
              ))}
            </select>

            <input type="submit" value="Save & Continue" />
          </form>
        </div>
      </div>
    </div>
  );
}

export default DisposerDetails;
