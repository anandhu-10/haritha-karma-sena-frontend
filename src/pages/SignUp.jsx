import React, { useState, useEffect } from "react";
import "../styles/signup.css";
import { Link, useNavigate } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import axios from "axios";
import { DISTRICTS, KERALA_DATA } from "../data/keralaData";

import SearchableSelect from "../components/SearchableSelect";

const API = (process.env.REACT_APP_API_URL || "https://haritha-karma-sena-backend.onrender.com");


function SignUp() {
  const navigate = useNavigate();

  const [width, setWidth] = useState(window.innerWidth);
  const [hide, setHide] = useState(true);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    password: "",
    role: "",
    district: "",
    localBodyType: "",
    localBodyName: "",
    ward: "",
    villageOrArea: "",
  });

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

    if (!formData.role) {
      alert("Please select Disposer or Collector");
      return;
    }

    // Check if location is fully filled
    if (!formData.district || !formData.localBodyType || !formData.localBodyName || !formData.ward || !formData.villageOrArea) {
      alert("Please complete all location fields.");
      return;
    }

    const payload = {
      name: `${formData.firstName} ${formData.middleName} ${formData.lastName}`
        .replace(/\s+/g, " ")
        .trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      role: formData.role,
      phone: formData.phoneNo,
      district: formData.district,
      localBodyType: formData.localBodyType,
      localBodyName: formData.localBodyName,
      ward: formData.ward,
      villageOrArea: formData.villageOrArea,
    };

    try {
      await axios.post(`${API}/api/auth/signup`, payload);
      alert("Signup successful. Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <>
      <header className="headerHome">
        <nav>
          <div className={width > 568 ? "containerHomeNav" : "containerHomeNavMob"}>
            <h1 onClick={() => navigate("/")}>HARITHA KARMA SENA</h1>

            {width <= 568 ? (
              <div className="optionC">
                <button className="optionBtn" onClick={() => setHide(!hide)}>
                  <RxHamburgerMenu color="white" size={20} />
                </button>
                {!hide && (
                  <div className="Options">
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/signup">Sign up</Link></li>
                  </div>
                )}
              </div>
            ) : (
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/signup">Sign up</Link></li>
                <li><Link to="/about">About</Link></li>
              </ul>
            )}
          </div>
        </nav>
      </header>

      <div className="grid-container">
        <div className="container-signup">
          <h1>Sign Up</h1>

          <form className="input-container" onSubmit={handleSubmit}>
            <input name="firstName" placeholder="First Name" required onChange={handleChange} />
            <input name="middleName" placeholder="Middle Name" onChange={handleChange} />
            <input name="lastName" placeholder="Last Name" onChange={handleChange} />
            <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
            <input name="phoneNo" placeholder="Phone Number" required onChange={handleChange} />
            <input type="password" name="password" placeholder="Password" required onChange={handleChange} />

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

            <div className="usertype">
              <p>Register as</p>

              <label>
                <input
                  type="radio"
                  name="role"
                  value="disposer"
                  checked={formData.role === "disposer"}
                  onChange={handleChange}
                />
                Disposer
              </label>

              <label>
                <input
                  type="radio"
                  name="role"
                  value="collector"
                  checked={formData.role === "collector"}
                  onChange={handleChange}
                />
                Collector
              </label>
            </div>

            <input type="submit" value="Sign Up" />
          </form>
        </div>
      </div>
    </>
  );
}

export default SignUp;
