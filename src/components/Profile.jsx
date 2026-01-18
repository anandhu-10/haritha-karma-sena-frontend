import React, { useState, useEffect, useRef } from "react";
import { MdLogout } from "react-icons/md";
import { FaLocationDot, FaUser, FaBell } from "react-icons/fa6";
import avatar from "../assets/noun-user-avatar-5787297.png";
import ProfilePopup from "./ProfilePopup";

function Profile({ user, userType, reportLogout }) {
  const [expand, setExpand] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotify, setShowNotify] = useState(false);
  const [locationName, setLocationName] = useState("");
  const [notifications, setNotifications] = useState([]);

  const dropdownRef = useRef(null);

  /* ---------- GEO LOCATION ---------- */
  useEffect(() => {
    if (!user || !navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`
        );
        const data = await res.json();

        setLocationName(
          data.address?.village ||
            data.address?.town ||
            data.address?.city ||
            ""
        );
      } catch (err) {
        console.error("Location fetch error:", err);
      }
    });
  }, [user]);

  /* ---------- FETCH NOTIFICATIONS (FIXED) ---------- */
  useEffect(() => {
    if (!user) return;

    const disposerId = user._id || user.id; // ✅ IMPORTANT FIX

    if (!disposerId) {
      console.error("No disposerId found in user object", user);
      return;
    }

    fetch(
      `${process.env.REACT_APP_API_URL}/api/notifications/${disposerId}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched notifications:", data); // 🔍 debug
        setNotifications(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Notification fetch error:", err);
        setNotifications([]);
      });
  }, [user]);

  /* ---------- CLOSE DROPDOWNS ON OUTSIDE CLICK ---------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setExpand(false);
        setShowNotify(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <>
      <div className="profileContainer">
        {/* LEFT */}
        <div className="sub1">
          <h1>Welcome, {user.name || user.email}</h1>
        </div>

        {/* RIGHT */}
        <div className="sub2">
          {userType === "disposer" && locationName && (
            <div className="locationContainer">
              <FaLocationDot />
              <h4>{locationName}</h4>
            </div>
          )}

          {/* 🔔 NOTIFICATION ICON */}
          <div style={{ position: "relative", marginRight: "15px" }}>
            <FaBell
              size={18}
              style={{ cursor: "pointer" }}
              onClick={() => {
                setShowNotify(!showNotify);
                setExpand(false);
              }}
            />

            {/* 🔴 NOTIFICATION COUNT */}
            {notifications.length > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-6px",
                  right: "-6px",
                  background: "red",
                  color: "white",
                  borderRadius: "50%",
                  fontSize: "10px",
                  padding: "2px 6px",
                }}
              >
                {notifications.length}
              </span>
            )}
          </div>

          {/* AVATAR */}
          <img
            src={avatar}
            alt="profile"
            className="beforeExp"
            onClick={() => {
              setExpand(!expand);
              setShowNotify(false);
            }}
          />

          {/* PROFILE DROPDOWN */}
          {expand && (
            <div className="profileContainerMenu" ref={dropdownRef}>
              <p>{user.email}</p>

              <button
                onClick={() => {
                  setExpand(false);
                  setShowProfile(true);
                }}
              >
                <FaUser /> View Profile
              </button>

              <button onClick={reportLogout}>
                <MdLogout /> Logout
              </button>
            </div>
          )}

          {/* 🔔 NOTIFICATION DROPDOWN */}
          {showNotify && (
            <div className="profileContainerMenu" ref={dropdownRef}>
              <h4 style={{ marginBottom: "8px" }}>Notifications</h4>

              {notifications.length === 0 ? (
                <p>No notifications</p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n._id}
                    style={{
                      padding: "6px 0",
                      borderBottom: "1px solid #ddd",
                      fontSize: "14px",
                    }}
                  >
                    {n.message}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* 👤 PROFILE POPUP */}
      {showProfile && (
        <ProfilePopup onClose={() => setShowProfile(false)} />
      )}
    </>
  );
}

export default Profile;
