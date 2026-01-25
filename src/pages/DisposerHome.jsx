import React, { useState, useEffect } from "react";
import { Navigate, useNavigate, Outlet } from "react-router-dom";
import axios from "axios";

import Profile from "../components/Profile";
import WasteCard from "../components/WasteCard";
import ServiceSlider from "../components/ServiceSlider";
import ListWaste from "../components/ListWaste";
import ChatBox from "../components/ChatBox"; // ✅ ADD THIS

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

  /* ---------- PAYMENT CHECK ---------- */
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

  /* ---------- PAY ₹50 ---------- */
  const handlePayment = async () => {
    try {
      await axios.post(
        `${API}/api/payment/pay`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Payment successful ✅");
      setPaid(true);
    } catch (err) {
      alert(err.response?.data?.message || "Payment failed");
    }
  };

  /* ---------- LOGOUT ---------- */
  const reportLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  /* ---------- ROLE PROTECTION ---------- */
  if (!user || user.role !== "disposer") {
    return <Navigate to="/" replace />;
  }

  /* ---------- LOADING ---------- */
  if (loadingPayment) {
    return <h2 style={{ textAlign: "center" }}>Checking payment...</h2>;
  }

  /* ---------- DASHBOARD ---------- */
  return (
    <div className="main">
      <WasteContext.Provider value={{ wasteDetails, setWasteDetails, user }}>
        {/* TOP BAR */}
        <Profile
          user={user}
          userType={user.role}
          reportLogout={reportLogout}
        />

        {/* 🔔 PAYMENT BANNER */}
        {!paid && (
          <div style={styles.paymentBanner}>
            <span>
              <strong>Monthly Disposal Fee:</strong> ₹50 required to dispose
              waste
            </span>
            <button onClick={handlePayment} style={styles.payBtnSmall}>
              Pay ₹50
            </button>
          </div>
        )}

        {/* DASHBOARD CARD */}
        <WasteCard paid={paid} />

        <ServiceSlider
          sliderData={sliderData}
          icons={[FaTrashCanArrowUp]}
          changeServicePage={setChangeSlider}
        />

        {changeSlider === 0 && (
          <ListWaste
            setShowItemBox={setIsOn}
            isOn={isOn}
            paid={paid}
          />
        )}

        <Outlet />

        {/* 💬 CHAT BOX (FLOATING) */}
        <ChatBox
          disposerId={user._id}
          collectorId={user.assignedCollectorId || "default-collector"}
          userRole="disposer"
        />
      </WasteContext.Provider>
    </div>
  );
}

/* ---------- STYLES ---------- */
const styles = {
  paymentBanner: {
    background: "#fff3cd",
    padding: "10px 16px",
    margin: "10px",
    borderRadius: "6px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "14px",
  },
  payBtnSmall: {
    padding: "6px 14px",
    backgroundColor: "green",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default DisposerHome;
