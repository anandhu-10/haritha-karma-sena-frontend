import React, { useState } from "react";
import { Navigate, useNavigate, Outlet } from "react-router-dom";

import Profile from "../components/Profile";
import WasteCard from "../components/WasteCard";
import ServiceSlider from "../components/ServiceSlider";
import ListWaste from "../components/ListWaste";

import { FaTrashCanArrowUp } from "react-icons/fa6";

/* ---------- CONTEXT ---------- */
export const WasteContext = React.createContext();

/* ---------- SLIDER DATA ---------- */
const sliderData = [{ label: "Dispose Waste", path: "" }];

function DisposerHome() {
  const navigate = useNavigate();

  /* ---------- STATE HOOKS (ALWAYS RUN) ---------- */
  const [wasteDetails, setWasteDetails] = useState([]);
  const [isOn, setIsOn] = useState(false);
  const [changeSlider, setChangeSlider] = useState(0);

  /* ---------- USER ---------- */
  const user = JSON.parse(localStorage.getItem("user"));

  /* ---------- ROLE PROTECTION (AFTER HOOKS) ---------- */
  if (!user || user.role !== "disposer") {
    return <Navigate to="/" replace />;
  }

  /* ---------- LOGOUT ---------- */
  const reportLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <div className="main">
      <WasteContext.Provider value={{ wasteDetails, setWasteDetails, user }}>
        {/* TOP BAR */}
        <Profile
          user={user}
          userType={user.role}
          reportLogout={reportLogout}
        />

        {/* DASHBOARD */}
        <WasteCard />

        <ServiceSlider
          sliderData={sliderData}
          icons={[FaTrashCanArrowUp]}
          changeServicePage={setChangeSlider}
        />

        {changeSlider === 0 && (
          <ListWaste setShowItemBox={setIsOn} isOn={isOn} />
        )}

        {/* FOR NESTED ROUTES (PROFILE POPUP / FUTURE) */}
        <Outlet />
      </WasteContext.Provider>
    </div>
  );
}

export default DisposerHome;
