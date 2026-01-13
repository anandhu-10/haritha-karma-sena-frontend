import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import Profile from "../components/Profile";
import Sidebar from "../components/Sidebar";
import ServiceSlider from "../components/ServiceSlider";

import { FaPlus, FaSearch } from "react-icons/fa";
import "../styles/dashboard.css";

/* ---------- SLIDER DATA ---------- */
const sliderData = [
  {
    label: "Add New Collection Area",
    path: ".", // ✅ FIX: index route
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
  // ✅ SAFE localStorage read (no logic change)
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  /* ---------- SAFETY ROLE CHECK ---------- */
  if (!user || user.role !== "collector") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="collectorhome">
      {/* LEFT SIDEBAR */}
      <Sidebar user={user} userType={user.role} />

      {/* RIGHT CONTENT */}
      <div className="main-content">
        <Profile user={user} userType={user.role} />

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
