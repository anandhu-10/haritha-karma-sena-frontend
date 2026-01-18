import React, { useEffect, useState } from "react";
import "../../styles/CollectorDashboard.css";

function CollectorDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    picked: 0,
    today: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/disposer-requests`
        );
        const data = await res.json();

        const total = data.length;
        const pending = data.filter(r => r.status !== "Picked Up").length;
        const picked = data.filter(r => r.status === "Picked Up").length;

        const todayDate = new Date().toLocaleDateString();
        const today = data.filter(r =>
          r.date?.includes(todayDate)
        ).length;

        setStats({ total, pending, picked, today });
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="collector-dashboard">
      <h2>Collector Dashboard</h2>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Total Requests</h3>
          <p>{stats.total}</p>
        </div>

        <div className="dashboard-card warning">
          <h3>Pending Pickups</h3>
          <p>{stats.pending}</p>
        </div>

        <div className="dashboard-card success">
          <h3>Picked Up</h3>
          <p>{stats.picked}</p>
        </div>

        <div className="dashboard-card info">
          <h3>Today</h3>
          <p>{stats.today}</p>
        </div>
      </div>
    </div>
  );
}

export default CollectorDashboard;
