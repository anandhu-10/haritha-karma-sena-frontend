import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaChartPie,
  FaInbox,
  FaMapLocationDot,
  FaCircleInfo,
  FaCircleQuestion,
  FaHouse
} from "react-icons/fa6";
import "../styles/sidebar.css";

const Sidebar = ({ user }) => {
  const location = useLocation();

  if (!user) return null;

  const role = user.role;
  const isActive = (path) => location.pathname === path;

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="avatar-circle">
          {user.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <div className="header-text">
          <h2>{user.name}</h2>
          <span className="role-badge">
            {role === "collector" ? "Collector" : "Disposer"}
          </span>
        </div>
      </div>

      <div className="sidebar-menu">
        <ul>
          {/* ---------------- COLLECTOR MENU ---------------- */}
          {role === "collector" && (
            <>
              <li className={isActive("/collector") ? "active" : ""}>
                <Link to="/collector">
                  <FaChartPie className="menu-icon" /> Dashboard
                </Link>
              </li>

              <li className={isActive("/collector/requests") ? "active" : ""}>
                <Link to="/collector/requests">
                  <FaInbox className="menu-icon" /> Requests
                </Link>
              </li>

              <li className={isActive("/collector/areas") ? "active" : ""}>
                <Link to="/collector/areas">
                  <FaMapLocationDot className="menu-icon" /> Collection Areas
                </Link>
              </li>

              <div className="menu-divider">Support</div>

              <li className={isActive("/collector/help") ? "active" : ""}>
                <Link to="/collector/help">
                  <FaCircleInfo className="menu-icon" /> About
                </Link>
              </li>

              <li className={`submenu-item ${isActive("/collector/help") ? "active" : ""}`}>
                <Link to="/collector/help">
                  <FaCircleQuestion className="menu-icon" /> Help Center
                </Link>
              </li>
            </>
          )}

          {/* ---------------- DISPOSER MENU ---------------- */}
          {role === "disposer" && (
            <>
              <li className={isActive("/disposer") ? "active" : ""}>
                <Link to="/disposer">
                  <FaHouse className="menu-icon" /> Home
                </Link>
              </li>
              <li className={isActive("/about") ? "active" : ""}>
                <Link to="/about">
                  <FaCircleInfo className="menu-icon" /> About Us
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
