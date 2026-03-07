import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import axios from "axios";
import "../styles/login.css";

const API_URL = process.env.REACT_APP_API_URL;

function ForgotPassword() {
    const navigate = useNavigate();

    const [width, setWidth] = useState(window.innerWidth);
    const [hide, setHide] = useState(true);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        newPassword: "",
        confirmPassword: ""
    });

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

        if (formData.newPassword !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post(`${API_URL}/api/auth/forgot-password`, {
                email: formData.email.trim().toLowerCase(),
                newPassword: formData.newPassword,
            });

            alert(res.data.message || "Password updated successfully!");
            navigate("/login");
        } catch (err) {
            console.error("Forgot password error:", err?.response || err);
            alert(err.response?.data?.message || "Failed to reset password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="body">
            {/* HEADER */}
            <header className="headerHome">
                <nav>
                    <div className={width > 568 ? "containerHomeNav" : "containerHomeNavMob"}>
                        <h1 onClick={() => navigate("/")}>HARITHA KARMA SENA</h1>

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

            {/* RECOVER FORM */}
            <div className="tray">
                <div className="container-login">
                    <h1>Reset Password</h1>

                    <form onSubmit={handleSubmit} className="input-container">
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
                            name="newPassword"
                            placeholder="New Password"
                            value={formData.newPassword}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm New Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="submit"
                            value={loading ? "Updating..." : "Reset Password"}
                            disabled={loading}
                            style={{ marginTop: "5px" }}
                        />

                        <div style={{ marginTop: "15px", fontSize: "14px", width: "100%", textAlign: "center" }}>
                            Remember your password? <Link to="/login" style={{ color: "#4CAF50", textDecoration: "none", fontWeight: "600" }}>Log in here</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
