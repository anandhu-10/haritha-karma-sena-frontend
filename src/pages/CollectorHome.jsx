import React from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

import Profile from "../components/Profile";
import Sidebar from "../components/Sidebar";
import ServiceSlider from "../components/ServiceSlider";

import { FaPlus, FaSearch } from "react-icons/fa";
import "../styles/dashboard.css";
import axios from "axios";
import ChatBox from "../components/ChatBox";

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

  /* ---------- CONTEXT & STATE ---------- */
  const [activeDisposerId, setActiveDisposerId] = React.useState(null);

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

  /* ---------- FETCH ACTIVE DISPOSER (🔥 IMPORTANT) ---------- */
  React.useEffect(() => {
    const fetchActiveDisposer = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/disposer-requests`,
        );
        const data = res.data || [];
        // Find a request picked up by this collector
        const activeReq = data.find(
          (r) => r.collectorId === user._id && r.status === "Picked Up"
        );
        if (activeReq) {
          setActiveDisposerId(activeReq.disposerId);
        } else {
          setActiveDisposerId(null);
        }
      } catch (err) {
        console.error("Failed to fetch active disposer requests", err);
      }
    };

    if (user && user._id) {
      fetchActiveDisposer();

      // Optional: Poll every 10 seconds to keep ChatBox synced if new requests are picked up
      const intervalId = setInterval(fetchActiveDisposer, 10000);
      return () => clearInterval(intervalId);
    }
  }, [user]);

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

        {/* 💬 CHAT (REAL LOGIC) */}
        <ChatBox
          disposerId={activeDisposerId}
          collectorId={user._id}
          userRole="collector"
        />
      </div>
    </div>
  );
}

export default CollectorHome;
