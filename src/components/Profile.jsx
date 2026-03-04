import React, { useState, useEffect, useRef, useCallback } from "react";
import { MdLogout } from "react-icons/md";
import { FaLocationDot, FaUser, FaBell, FaTrash } from "react-icons/fa6";
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
  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    const disposerId = user._id || user.id;
    if (!disposerId) return;

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/notifications/${disposerId}`);
      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Notification fetch error:", err);
      setNotifications([]);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 30000); // 🔃 poll every 30s
    return () => clearInterval(intervalId);
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  /* ---------- NOTIFICATION ACTIONS ---------- */
  const handleToggleNotify = async () => {
    const nextState = !showNotify;
    setShowNotify(nextState);
    if (nextState) setExpand(false);

    // ✅ MARK AS READ WHEN OPENED
    if (nextState && unreadCount > 0 && user) {
      try {
        const disposerId = user._id || user.id;
        await fetch(`${process.env.REACT_APP_API_URL}/api/notifications/mark-read/${disposerId}`, {
          method: "PATCH",
        });
        // local update to clear badge immediately
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      } catch (err) {
        console.error("Mark read error:", err);
      }
    }
  };

  const handleDeleteAll = async () => {
    if (!user || !window.confirm("Clear all notifications?")) return;
    try {
      const disposerId = user._id || user.id;
      await fetch(`${process.env.REACT_APP_API_URL}/api/notifications/${disposerId}`, {
        method: "DELETE",
      });
      setNotifications([]);
    } catch (err) {
      console.error("Delete all error:", err);
    }
  };

  const handleDeleteOne = async (id) => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/api/notifications/single/${id}`, {
        method: "DELETE",
      });
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Delete one error:", err);
    }
  };

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
              onClick={handleToggleNotify}
            />

            {/* 🔴 NOTIFICATION COUNT */}
            {unreadCount > 0 && (
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
                {unreadCount}
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
            <div className="profileContainerMenu" ref={dropdownRef} style={{ width: "250px", maxHeight: "300px", overflowY: "auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <h4 style={{ margin: 0 }}>Notifications</h4>
                {notifications.length > 0 && (
                  <button
                    onClick={handleDeleteAll}
                    style={{ fontSize: "10px", padding: "2px 6px", color: "red", border: "1px solid red", background: "none", cursor: "pointer", borderRadius: "4px" }}
                  >
                    Clear All
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <p style={{ fontSize: "12px", color: "#666" }}>No notifications</p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n._id}
                    style={{
                      padding: "10px 0",
                      borderBottom: "1px solid #eee",
                      fontSize: "13px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "10px"
                    }}
                  >
                    <span>{n.message}</span>
                    <FaTrash
                      size={12}
                      color="#999"
                      style={{ cursor: "pointer", flexShrink: 0, marginTop: "4px" }}
                      onClick={() => handleDeleteOne(n._id)}
                    />
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
