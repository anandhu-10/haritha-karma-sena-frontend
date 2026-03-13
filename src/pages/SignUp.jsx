import React, { useState, useEffect } from "react";
import "../styles/signup.css";
import { Link, useNavigate } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import axios from "axios";
import { DISTRICTS, KERALA_DATA } from "../data/keralaData";

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
    panchayath: "",
    ward: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      if (name === "district") {
        newData.panchayath = ""; // Reset panchayath if district changes
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

    const payload = {
      name: `${formData.firstName} ${formData.middleName} ${formData.lastName}`
        .replace(/\s+/g, " ")
        .trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      role: formData.role,
      phone: formData.phoneNo,
      district: formData.district,
      panchayath: formData.panchayath,
      ward: formData.ward,
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

            {/* 🏘️ KERALA GEOGRAPHY SELECTION */}
            <select name="district" required onChange={handleChange} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', marginTop: '10px' }}>
              <option value="">Select District</option>
              {DISTRICTS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <select name="panchayath" required onChange={handleChange} disabled={!formData.district} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', marginTop: '10px' }}>
              <option value="">Select Local Body</option>
              {formData.district && KERALA_DATA[formData.district].map(lb => (
                <option key={lb} value={lb}>{lb}</option>
              ))}
            </select>

            <select name="ward" required onChange={handleChange} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', marginTop: '10px' }}>
              <option value="">Select Ward</option>
              {[...Array(50)].map((_, i) => (
                <option key={i + 1} value={`Ward ${i + 1}`}>Ward {i + 1}</option>
              ))}
            </select>

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
