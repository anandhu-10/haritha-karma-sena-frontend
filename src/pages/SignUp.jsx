import React, { useState, useEffect } from "react";
import "../styles/signup.css";
import { Link, useNavigate } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import axios from "axios";
import { DISTRICTS, KERALA_DATA } from "../data/keralaData";

import SearchableSelect from "../components/SearchableSelect";

import logo from "../assets/logo_header.png";

const API = (process.env.REACT_APP_API_URL || "https://haritha-karma-sena-backend.onrender.com");

function SignUp() {
  const navigate = useNavigate();

  const [width, setWidth] = useState(window.innerWidth);
  const [hide, setHide] = useState(true);
  const [step, setStep] = useState(1); // 1: Personal, 2: Location, 3: Role

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

  const nextStep = () => {
    if (step === 1) {
      if (!formData.firstName || !formData.email || !formData.phoneNo || !formData.password) {
        alert("Please fill all required personal fields.");
        return;
      }

      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(formData.email)) {
        alert("Please enter a valid email address.");
        return;
      }

      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(formData.phoneNo)) {
        alert("Please enter a valid 10-digit phone number.");
        return;
      }
    } else if (step === 2) {
      if (!formData.district || !formData.localBodyType || !formData.localBodyName || !formData.ward || !formData.villageOrArea) {
        alert("Please complete all location fields.");
        return;
      }
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.role) {
      alert("Please select Disposer or Collector");
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
    <div className="signup-page">
      <header className="headerHome">
        <nav>
          <div className={width > 568 ? "containerHomeNav" : "containerHomeNavMob"}>
            <div 
              onClick={() => navigate("/")} 
              style={{ display: "flex", alignItems: "center", gap: "0px", cursor: "pointer" }}
            >
              <img src={logo} alt="Hygieno Logo" style={{ height: "40px", width: "auto" }} />
              <h1 style={{ margin: 0, marginLeft: "-30px" }}>HYGIENO</h1>
            </div>

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
          <div className="signup-header">
            <h1>Sign Up</h1>
            <div className="stepper">
              <div className={`step ${step >= 1 ? "active" : ""}`}>1</div>
              <div className="line"></div>
              <div className={`step ${step >= 2 ? "active" : ""}`}>2</div>
              <div className="line"></div>
              <div className={`step ${step >= 3 ? "active" : ""}`}>3</div>
            </div>
          </div>

          <form className="input-container" onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="form-step animate-fade">
                <h3>Personal details</h3>
                <div className="name-grid">
                  <input name="firstName" placeholder="First Name" required value={formData.firstName} onChange={handleChange} />
                  <input name="middleName" placeholder="Middle Name" value={formData.middleName} onChange={handleChange} />
                  <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} />
                </div>
                <input type="email" name="email" placeholder="Email" required value={formData.email} onChange={handleChange} />
                <input name="phoneNo" placeholder="Phone Number" required value={formData.phoneNo} onChange={handleChange} />
                <input type="password" name="password" placeholder="Password" required value={formData.password} onChange={handleChange} />
                <button type="button" className="next-btn" onClick={nextStep}>Next: Location &rarr;</button>
              </div>
            )}

            {step === 2 && (
              <div className="form-step animate-fade">
                <h3>Location Details</h3>
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

                <div className="btn-group">
                  <button type="button" className="prev-btn" onClick={prevStep}>&larr; Back</button>
                  <button type="button" className="next-btn" onClick={nextStep}>Next: Finalize &rarr;</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="form-step animate-fade">
                <h3>Final Step</h3>
                <div className="usertype-card">
                  <p>I want to join as a:</p>
                  <div className="role-options">
                    <label className={`role-card ${formData.role === "disposer" ? "selected" : ""}`}>
                      <input
                        type="radio"
                        name="role"
                        value="disposer"
                        checked={formData.role === "disposer"}
                        onChange={handleChange}
                      />
                      <div className="role-icon">🏠</div>
                      <span>Disposer</span>
                      <small>I want to request waste pickup</small>
                    </label>

                    <label className={`role-card ${formData.role === "collector" ? "selected" : ""}`}>
                      <input
                        type="radio"
                        name="role"
                        value="collector"
                        checked={formData.role === "collector"}
                        onChange={handleChange}
                      />
                      <div className="role-icon">🚛</div>
                      <span>Collector</span>
                      <small>I am a waste collection agent</small>
                    </label>
                  </div>
                </div>

                <div className="btn-group">
                  <button type="button" className="prev-btn" onClick={prevStep}>&larr; Back</button>
                  <button type="submit" className="submit-btn">Create Account</button>
                </div>
              </div>
            )}
          </form>
          <div className="login-link">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
