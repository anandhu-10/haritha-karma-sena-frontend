import React, { useState, useEffect, useRef, useCallback } from "react";
import { MdLogout } from "react-icons/md";
import { FaLocationDot, FaUser, FaBell, FaTrash } from "react-icons/fa6";
import avatar from "../assets/noun-user-avatar-5787297.png";
import ProfilePopup from "./ProfilePopup";
import "../styles/Profile.css";

function Profile({ user, userType, reportLogout }) {
  const [expand, setExpand] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotify, setShowNotify] = useState(false);
  const [locationName, setLocationName] = useState("");
  const [notifications, setNotifications] = useState([]);

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) return interval + " years ago";
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return interval + " months ago";
    interval = Math.floor(seconds / 86400);
    if (interval > 1) return interval + " days ago";
    interval = Math.floor(seconds / 3600);
    if (interval > 1) return interval + " hours ago";
    interval = Math.floor(seconds / 60);
    if (interval > 1) return interval + " mins ago";
    return "Just now";
  };

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
    const intervalId = setInterval(fetchNotifications, 10000); // 🔃 poll every 10s
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
              <span className="notification-badge">
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
            <div className="profile-menu-dropdown" ref={dropdownRef}>
              <div className="user-email-header">
                {user.email}
              </div>

              <button
                className="profile-menu-item"
                onClick={() => {
                  setExpand(false);
                  setShowProfile(true);
                }}
              >
                <span><FaUser size={14} /></span> View Profile
              </button>

              <button className="profile-menu-item logout" onClick={reportLogout}>
                <span><MdLogout size={16} /></span> Logout
              </button>
            </div>
          )}

          {/* 🔔 NOTIFICATION DROPDOWN */}
          {showNotify && (
            <div className="notification-dropdown" ref={dropdownRef}>
              <div className="notification-header">
                <h4>Notifications</h4>
                {notifications.length > 0 && (
                  <button className="clear-all-btn" onClick={handleDeleteAll}>
                    Clear All
                  </button>
                )}
              </div>

              <div className="notification-list">
                {notifications.length === 0 ? (
                  <div className="empty-notifications">
                    <FaBell size={24} color="#e2e8f0" />
                    <p>No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div key={n._id} className="notification-item">
                      {!n.read && <div className="unread-indicator" />}
                      <div className="notification-content">
                        {n.message}
                        <div style={{ fontSize: "10px", color: "#94a3b8", marginTop: "4px", fontWeight: "400" }}>
                          {timeAgo(n.createdAt)}
                        </div>
                      </div>
                      <div className="delete-one-btn" onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteOne(n._id);
                      }}>
                        <FaTrash size={12} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 👤 PROFILE POPUP */}
      {showProfile && (
        <ProfilePopup onClose={() => setShowProfile(false)} userType={userType} />
      )}
    </>
  );
}

export default Profile;
