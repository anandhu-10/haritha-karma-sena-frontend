// src/pages/About.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/about.css";

import anandhu from "../assets/anandhu.jpg";
import abhijith from "../assets/abhijith.png";
import harinath from "../assets/hari.png";
import shibin from "../assets/shibin.jpg";

const teamMembers = [
  {
    name: "Anandhu Anil",
    role: "Front-end Developer",
    department: "CSE",
    email: "anandhu@gmail.com",
    phone: "+91 85901 74538",
    image: anandhu,
  },
  {
    name: "Abhijith B Nair",
    role: "Back-end Developer",
    department: "CSE",
    email: "abhijith@gmail.com",
    phone: "+91 81290 70103",
    image: abhijith,
  },
  {
    name: "Harinath Jayan",
    role: "Back-end Developer",
    department: "CSE",
    email: "harinath@gmail.com",
    phone: "+91 85906 63549",
    image: harinath,
  },
  {
    name: "Shibin",
    role: "Front-end Developer",
    department: "CSE",
    email: "shibin@gmail.com",
    phone: "+91 98476 55138",
    image: shibin,
  },
];

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="about-page">
      {/* NAV BUTTON */}
      <button
        className="nav-btn"
        onClick={() => navigate("/")}
        aria-label="Back to home"
      >
        ⬅ Back to Home
      </button>

      <h1 className="about-title">Meet the Team Behind Haritha Karma Sena</h1>

      <div className="card-wrapper">
        {teamMembers.map((member, index) => (
          <div className="card" key={index}>
            <img
              src={member.image}
              alt={`${member.name} - ${member.role}`}
            />
            <h3>{member.name}</h3>
            <p className="role">{member.role}</p>
            <p>{member.department}</p>
            <p>{member.email}</p>
            <p>{member.phone}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
