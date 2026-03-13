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

  const user = JSON.parse(localStorage.getItem("user"));

  /* 🔁 AUTO-FILL IF DATA EXISTS */
  useEffect(() => {
    if (user?.profile) {
      setFormData({
        phone: user.profile.phone || "",
        pincode: user.profile.pincode || "",
        location: user.profile.location || "",
        panchayath: user.profile.panchayath || "",
        ward: user.profile.ward || "",
      });
    }
  }, [user?.profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
