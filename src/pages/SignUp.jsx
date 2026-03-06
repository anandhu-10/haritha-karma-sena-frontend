import React, { useState, useEffect } from "react";
import "../styles/signup.css";
import { Link, useNavigate } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;


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
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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
