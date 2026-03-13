import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { DISTRICTS, KERALA_DATA } from "../data/keralaData";
import "../styles/login.css"; // ✅ SAME CSS AS LOGIN

function DisposerDetails() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    phone: "",
    pincode: "",
    district: "",
    localBodyType: "",
    localBodyName: "",
    ward: "",
    villageOrArea: "",
  });

  const user = JSON.parse(localStorage.getItem("user"));

  /* 🔁 AUTO-FILL IF DATA EXISTS */
  useEffect(() => {
    if (user?.profile) {
      setFormData({
        phone: user.profile.phone || "",
        pincode: user.profile.pincode || "",
        district: user.profile.district || "",
        localBodyType: user.profile.localBodyType || "",
        localBodyName: user.profile.localBodyName || "",
        ward: user.profile.ward || "",
        villageOrArea: user.profile.villageOrArea || "",
      });
    }
  }, [user?.profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      if (name === "district") {
        newData.localBodyType = "";
        newData.localBodyName = "";
        newData.ward = "";
        newData.villageOrArea = "";
      } else if (name === "localBodyType") {
        newData.localBodyName = "";
        newData.ward = "";
        newData.villageOrArea = "";
      } else if (name === "localBodyName") {
        newData.ward = "";
        newData.villageOrArea = "";
      } else if (name === "ward") {
        newData.villageOrArea = "";
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

            {/* 🏘️ REFINED KERALA GEOGRAPHY SELECTION */}
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
              name="localBodyType"
              required
              onChange={handleChange}
              value={formData.localBodyType}
              disabled={!formData.district}
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', marginTop: '10px' }}
            >
              <option value="">Select Local Body Type</option>
              {formData.district && Object.keys(KERALA_DATA[formData.district]).map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <select
              name="localBodyName"
              required
              onChange={handleChange}
              value={formData.localBodyName}
              disabled={!formData.localBodyType}
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', marginTop: '10px' }}
            >
              <option value="">Select Local Body Name</option>
              {formData.localBodyType && Object.keys(KERALA_DATA[formData.district][formData.localBodyType]).map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>

            <select
              name="ward"
              required
              onChange={handleChange}
              value={formData.ward}
              disabled={!formData.localBodyName}
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', marginTop: '10px' }}
            >
              <option value="">Select Ward</option>
              {formData.localBodyName && [...Array(KERALA_DATA[formData.district][formData.localBodyType][formData.localBodyName].wards)].map((_, i) => (
                <option key={i + 1} value={`Ward ${i + 1}`}>Ward {i + 1}</option>
              ))}
            </select>

            <select
              name="villageOrArea"
              required
              onChange={handleChange}
              value={formData.villageOrArea}
              disabled={!formData.ward}
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', marginTop: '10px' }}
            >
              <option value="">Select Village / Area</option>
              {formData.localBodyName && KERALA_DATA[formData.district][formData.localBodyType][formData.localBodyName].areas.map(area => (
                <option key={area} value={area}>{area}</option>
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
