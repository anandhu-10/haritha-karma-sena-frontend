import React from "react";
import { Link } from "react-router-dom";
import "../styles/sidebar.css";

const Sidebar = ({ user }) => {
  if (!user) return null;

  const role = user.role;

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>{user.name}</h2>
        <p style={{ fontSize: "12px", opacity: 0.7 }}>
          {role === "collector" ? "Collector" : "Disposer"}
        </p>
      </div>

      <div className="sidebar-menu">
        <ul>
          {/* ROLE BASED HOME */}
          {role === "collector" && (
            <li>
              <Link to="/collector">Dashboard</Link>
            </li>
          )}

          {role === "disposer" && (
            <li>
              <Link to="/disposer">Dashboard</Link>
            </li>
          )}

          {/* COMMON LINKS */}
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
