import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import axios from "axios";
import "../styles/signup.css";

import logo from "../assets/logo_header.png";

/* ✅ API URL from CRA environment */
const API_URL = (process.env.REACT_APP_API_URL || "https://haritha-karma-sena-backend.onrender.com");

function Login() {
  const navigate = useNavigate();

  const [width, setWidth] = useState(window.innerWidth);
  const [hide, setHide] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  /* ---------- DEBUG (REMOVE LATER) ---------- */
  useEffect(() => {
    console.log("API_URL =", API_URL);
  }, []);

  /* ---------- HANDLE RESIZE ---------- */
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ---------- INPUT HANDLER ---------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    /* 📍 ATTEMPT TO GET GEOLOCATION FOR COLLECTORS */
    let location = null;
    try {
      if ("geolocation" in navigator) {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
        });
        location = [position.coords.longitude, position.coords.latitude];
      }
    } catch (err) {
      console.warn("Geolocation permission denied or timed out. Continuing without location.");
    }

    try {
      const res = await axios.post(
        `${API_URL}/api/auth/login`,
        {
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          location, // Send to backend
        }
      );

      /* ✅ SAVE AUTH DATA */
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      /* ✅ REDIRECT BASED ON ROLE */
      if (res.data.user.role === "admin") {
        navigate("/admin", { replace: true });
      } else if (res.data.user.role === "collector") {
        navigate("/collector", { replace: true });
      } else {
        navigate("/disposer", { replace: true });
      }
    } catch (err) {
      console.error("Login error:", err?.response || err);
      alert(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      {/* HEADER */}
      <header className="headerHome">
        <nav>
          <div
            className={width > 568 ? "containerHomeNav" : "containerHomeNavMob"}
          >
            <div 
              onClick={() => navigate("/")} 
              style={{ display: "flex", alignItems: "center", gap: "0px", cursor: "pointer" }}
            >
              <img src={logo} alt="Hygieno Logo" style={{ height: "40px", width: "auto" }} />
              <h1 style={{ margin: 0, marginLeft: "-30px" }}>HYGIENO</h1>
            </div>

            {width <= 568 ? (
              <div className="optionC">
                <button
                  className="optionBtn"
                  onClick={() => setHide(!hide)}
                >
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

      {/* LOGIN FORM */}
      <div className="grid-container">
        <div className="container-signup">
          <div className="signup-header">
            <h1>Log In</h1>
          </div>

          <form onSubmit={handleSubmit} className="input-container">
            <div className="form-step animate-fade">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />


              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Log In"}
              </button>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px", fontSize: "14px", width: "100%" }}>
                <Link to="/forgot-password" style={{ color: "#6c8469", textDecoration: "none", fontWeight: "600" }}>Forgot password?</Link>
              </div>
            </div>
          </form>

          <div className="login-link">
             Not registered? <Link to="/signup">Create account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
