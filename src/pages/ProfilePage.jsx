import React from "react";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const profile = JSON.parse(localStorage.getItem("disposerProfile"));

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div style={{ padding: "30px", background: "#e1e8dd", minHeight: "100vh" }}>
      <div
        style={{
          maxWidth: "700px",
          margin: "auto",
          background: "#fff",
          borderRadius: "16px",
          padding: "30px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        }}
      >
        <h2>My Profile</h2>

        <hr />

        <h3>User Info</h3>
        <p><strong>Name:</strong> {user.name || "Disposer"}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>

        <hr />

        <h3>Contact & Location</h3>
        <p><strong>Phone:</strong> {profile?.phone || "-"}</p>
        <p><strong>Pin Code:</strong> {profile?.pincode || "-"}</p>
        <p><strong>Location:</strong> {profile?.location || "-"}</p>
        <p><strong>Panchayath:</strong> {profile?.panchayath || "-"}</p>
        <p><strong>Ward:</strong> {profile?.ward || "-"}</p>

        <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
          <button
            onClick={() => navigate("/disposer/details")}
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              border: "none",
              background: "#6c8469",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Edit Profile
          </button>

          <button
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              border: "none",
              background: "#c0392b",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
