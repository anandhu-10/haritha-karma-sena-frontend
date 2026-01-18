import React from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

import Profile from "../components/Profile";
import Sidebar from "../components/Sidebar";
import ServiceSlider from "../components/ServiceSlider";

import { FaPlus, FaSearch } from "react-icons/fa";
import "../styles/dashboard.css";

/* ---------- SLIDER DATA ---------- */
const sliderData = [
  {
    label: "Add New Collection Area",
    path: ".", // index route
  },
  {
    label: "View Collection Areas",
    path: "areas",
  },
  {
    label: "View Requests from Disposers",
    path: "requests",
  },
];

function CollectorHome() {
  const navigate = useNavigate();

  // SAFE localStorage read
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  /* ---------- LOGOUT (FIXED) ---------- */
  const reportLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token"); // if you use token

    navigate("/login", { replace: true });
  };

  /* ---------- SAFETY ROLE CHECK ---------- */
  if (!user || user.role !== "collector") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="collectorhome">
      {/* LEFT SIDEBAR */}
      <Sidebar user={user} userType={user.role} />

      {/* RIGHT CONTENT */}
      <div className="main-content">
        {/* ✅ PASS reportLogout */}
        <Profile
          user={user}
          userType={user.role}
          reportLogout={reportLogout}
        />

        {/* SLIDER NAVIGATION */}
        <ServiceSlider
          sliderData={sliderData}
          icons={[FaPlus, FaSearch, FaSearch]}
        />

        {/* CHILD ROUTES */}
        <div className="collector-page">
          <Outlet context={{ user }} />
        </div>
      </div>
    </div>
  );
}

export default CollectorHome;
