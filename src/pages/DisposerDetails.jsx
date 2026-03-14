import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { DISTRICTS, KERALA_DATA } from "../data/keralaData";
import "../styles/login.css"; // ✅ SAME CSS AS LOGIN

import SearchableSelect from "../components/SearchableSelect";

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

    if (!formData.district || !formData.localBodyType || !formData.localBodyName || !formData.ward || !formData.villageOrArea) {
      alert("Please complete all location fields.");
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    const pincodeRegex = /^[0-9]{6}$/;
    if (formData.pincode && !pincodeRegex.test(formData.pincode)) {
      alert("Please enter a valid 6-digit pin code.");
      return;
    }

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

            {/* 🏘️ REFINED KERALA GEOGRAPHY SELECTION WITH SEARCH */}
            <SearchableSelect
              name="district"
              options={DISTRICTS}
              placeholder="Select District"
              value={formData.district}
              onChange={handleChange}
            />

            <SearchableSelect
              name="localBodyType"
              options={formData.district ? Object.keys(KERALA_DATA[formData.district]) : []}
              placeholder="Select Local Body Type"
              value={formData.localBodyType}
              onChange={handleChange}
              disabled={!formData.district}
            />

            <SearchableSelect
              name="localBodyName"
              options={formData.localBodyType ? Object.keys(KERALA_DATA[formData.district][formData.localBodyType]) : []}
              placeholder="Select Local Body Name"
              value={formData.localBodyName}
              onChange={handleChange}
              disabled={!formData.localBodyType}
            />

            <SearchableSelect
              name="ward"
              options={formData.localBodyName ? [...Array(KERALA_DATA[formData.district][formData.localBodyType][formData.localBodyName].wards)].map((_, i) => `Ward ${i + 1}`) : []}
              placeholder="Select Ward"
              value={formData.ward}
              onChange={handleChange}
              disabled={!formData.localBodyName}
            />

            <SearchableSelect
              name="villageOrArea"
              options={formData.localBodyName ? KERALA_DATA[formData.district][formData.localBodyType][formData.localBodyName].areas : []}
              placeholder="Select Village / Area"
              value={formData.villageOrArea}
              onChange={handleChange}
              disabled={!formData.ward}
            />

            <input type="submit" value="Save & Continue" />
          </form>
        </div>
      </div>
    </div>
  );
}

export default DisposerDetails;
