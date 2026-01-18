import React from "react";
import "../styles/CollectorHelp.css";

function CollectorHelp() {
  return (
    <div className="about-page">
      <h1>About Haritha Karma Sena – Collector Portal</h1>

      <section>
        <h2>What is this platform?</h2>
        <p>
          Haritha Karma Sena Collector Portal is a digital system that helps
          waste collectors efficiently manage and respond to waste disposal
          requests submitted by citizens.
        </p>
      </section>

      <section>
        <h2>Role of the Collector</h2>
        <ul>
          <li>View waste requests from disposers</li>
          <li>Manage assigned collection areas</li>
          <li>Pick up waste and update request status</li>
          <li>Ensure proper and timely waste collection</li>
        </ul>
      </section>

      <section>
        <h2>How the Dashboard Works</h2>
        <p>
          The Collector Dashboard provides a quick summary of all waste requests,
          including pending pickups, completed pickups, and requests received
          today.
        </p>
      </section>

      <section>
        <h2>Collector Workflow</h2>
        <ol>
          <li>Login with your Collector account</li>
          <li>View statistics on the Dashboard</li>
          <li>Open “Requests from Disposers”</li>
          <li>Confirm pickup once waste is collected</li>
          <li>Disposers receive automatic notifications</li>
        </ol>
      </section>

      <section>
        <h2>Help & Support</h2>
        <p>If you need assistance, please contact:</p>
        <ul>
          <li>Email: support@harithakarmasena.in</li>
          <li>Phone: +91-XXXXXXXXXX</li>
          <li>Support Hours: 9:00 AM – 5:00 PM</li>
        </ul>
      </section>
    </div>
  );
}

export default CollectorHelp;
