import React, { useState, useEffect } from "react";
import { Navigate, useNavigate, Outlet } from "react-router-dom";
import axios from "axios";

import Profile from "../components/Profile";
import WasteCard from "../components/WasteCard";
import ServiceSlider from "../components/ServiceSlider";
import ListWaste from "../components/ListWaste";
import ChatBox from "../components/ChatBox";
import Monitoring from "../components/Monitoring";

import { FaTrashCanArrowUp, FaChartLine } from "react-icons/fa6";

/* ---------- CONTEXT ---------- */
export const WasteContext = React.createContext();

/* ---------- SLIDER DATA ---------- */
const sliderData = [
  { label: "Dispose Waste", path: "" },
  { label: "Monitoring & Awareness", path: "" }
];

const API = process.env.REACT_APP_API_URL;

function DisposerHome() {
  const navigate = useNavigate();

  /* ---------- STATE ---------- */
  const [wasteDetails, setWasteDetails] = useState([]);
  const [isOn, setIsOn] = useState(false);
  const [changeSlider, setChangeSlider] = useState(0);

  /* ---------- PAYMENT ---------- */
  const [paid, setPaid] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(true);

  /* ---------- REQUESTS ---------- */
  const [myRequests, setMyRequests] = useState([]);

  /* ---------- USER ---------- */
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id || user?._id;
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

  /* ---------- FETCH MY REQUESTS (🔥 IMPORTANT) ---------- */
  useEffect(() => {
    const fetchMyRequests = async () => {
      try {
        const res = await axios.get(
          `${API}/api/disposer-requests/my`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("API RESPONSE:", res.data);
        setMyRequests(res.data || []);
      } catch (err) {
        console.error("Failed to fetch my requests", err);
      }
    };

    if (token) fetchMyRequests();
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

  /* ---------- ROLE CHECK ---------- */
  if (!user || user.role !== "disposer") {
    return <Navigate to="/" replace />;
  }

  if (loadingPayment) {
    return <h2 style={{ textAlign: "center" }}>Checking payment...</h2>;
  }

  /* ---------- GET ASSIGNED COLLECTOR ---------- */
  const assignedRequest = myRequests.find(
    (r) => r.collectorId && r.status === "Picked Up"
  );

  const assignedCollector = assignedRequest
    ? assignedRequest.collectorId
    : null;
  /* ---------- UI ---------- */
  return (
    <div className="main">
      <WasteContext.Provider value={{ wasteDetails, setWasteDetails, user }}>
        {/* TOP BAR */}
        <Profile
          user={user}
          userType={user.role}
          reportLogout={reportLogout}
        />

        {/* PAYMENT BANNER */}
        {!paid && (
          <div style={styles.paymentBanner}>
            <span>
              <strong>Monthly Disposal Fee:</strong> ₹50 required
            </span>
            <button onClick={handlePayment} style={styles.payBtnSmall}>
              Pay ₹50
            </button>
          </div>
        )}

        <WasteCard paid={paid} />

        {/* 🔔 REMINDERS */}
        {myRequests.length > 0 && myRequests[0].status === "Pending" && (
          <div style={styles.reminderBanner}>
            <strong>Reminder:</strong> Please keep your waste ready before collector arrival. Segregate plastic and organic waste before disposal.
          </div>
        )}

        <ServiceSlider
          sliderData={sliderData}
          icons={[FaTrashCanArrowUp, FaChartLine]}
          changeServicePage={setChangeSlider}
        />

        {changeSlider === 0 && (
          <ListWaste
            setShowItemBox={setIsOn}
            isOn={isOn}
            paid={paid}
          />
        )}

        {changeSlider === 1 && (
          <Monitoring myRequests={myRequests} />
        )}

        <Outlet />

        {/* 💬 CHAT (REAL LOGIC) */}
        <ChatBox
          disposerId={userId}
          collectorId={assignedCollector}
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
  reminderBanner: {
    background: "#d1ecf1",
    color: "#0c5460",
    padding: "12px 16px",
    margin: "10px",
    borderRadius: "6px",
    fontSize: "14px",
    borderLeft: "5px solid #0c5460",
  },
};

export default DisposerHome;
