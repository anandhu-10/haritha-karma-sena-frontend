import React, { useState, useEffect } from "react";
import { Navigate, useNavigate, Outlet } from "react-router-dom";
import axios from "axios";

import Profile from "../components/Profile";
import WasteCard from "../components/WasteCard";
import ServiceSlider from "../components/ServiceSlider";
import ListWaste from "../components/ListWaste";

import { FaTrashCanArrowUp } from "react-icons/fa6";

/* ---------- CONTEXT ---------- */
export const WasteContext = React.createContext();

/* ---------- SLIDER DATA ---------- */
const sliderData = [{ label: "Dispose Waste", path: "" }];

const API = process.env.REACT_APP_API_URL;

function DisposerHome() {
  const navigate = useNavigate();

  /* ---------- STATE HOOKS ---------- */
  const [wasteDetails, setWasteDetails] = useState([]);
  const [isOn, setIsOn] = useState(false);
  const [changeSlider, setChangeSlider] = useState(0);

  /* ---------- PAYMENT STATES ---------- */
  const [paid, setPaid] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(true);

  /* ---------- USER ---------- */
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  /* ---------- PAYMENT CHECK (ALWAYS RUNS) ---------- */
  useEffect(() => {
    const checkPayment = async () => {
      try {
        const res = await axios.get(`${API}/api/payment/status`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPaid(res.data.paid);
      } catch (err) {
        console.error("Payment check failed", err);
      } finally {
        setLoadingPayment(false);
      }
    };

    if (token) checkPayment();
  }, [token]);

  /* ---------- LOGOUT ---------- */
  const reportLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  /* ---------- ROLE PROTECTION (AFTER HOOKS ✅) ---------- */
  if (!user || user.role !== "disposer") {
    return <Navigate to="/" replace />;
  }

  /* ---------- LOADING ---------- */
  if (loadingPayment) {
    return <h2 style={{ textAlign: "center" }}>Checking payment...</h2>;
  }

  /* ---------- BLOCK IF UNPAID ---------- */
  if (!paid) {
    return (
      <div style={styles.blocked}>
        <h2>Monthly Disposal Fee Required</h2>
        <p>Pay ₹50 to continue disposal services.</p>
        <button style={styles.payBtn}>Pay ₹50</button>
        <button onClick={reportLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>
    );
  }

  /* ---------- NORMAL DASHBOARD ---------- */
  return (
    <div className="main">
      <WasteContext.Provider value={{ wasteDetails, setWasteDetails, user }}>
        <Profile
          user={user}
          userType={user.role}
          reportLogout={reportLogout}
        />

        <WasteCard />

        <ServiceSlider
          sliderData={sliderData}
          icons={[FaTrashCanArrowUp]}
          changeServicePage={setChangeSlider}
        />

        {changeSlider === 0 && (
          <ListWaste setShowItemBox={setIsOn} isOn={isOn} />
        )}

        <Outlet />
      </WasteContext.Provider>
    </div>
  );
}

const styles = {
  blocked: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  payBtn: {
    padding: "10px 20px",
    backgroundColor: "green",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    marginTop: "10px",
  },
  logoutBtn: {
    padding: "8px 16px",
    marginTop: "15px",
    backgroundColor: "#444",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
  },
};

export default DisposerHome;
