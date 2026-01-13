import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/* ✅ FIXED IMPORT PATHS (CASE 1) */
import "./styles/home.css";
import image from "./assets/1000_F_101682732_OejrMC8RzUdpxMVmSQLhgsnTW2HQloO0.jpg";

import { RxHamburgerMenu } from "react-icons/rx";

function Home() {
  const navigate = useNavigate();
  const [width, setWidth] = useState(window.innerWidth);
  const [hide, setHide] = useState(true);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      {/* HEADER */}
      <header className="headerHome">
        <nav>
          <div
            className={
              width > 568 ? "containerHomeNav" : "containerHomeNavMob"
            }
          >
            <h1 onClick={() => navigate("/")}>HARITHA KARMA SENA</h1>

            {width <= 568 ? (
              <div className="optionC">
                <button
                  className="optionBtn"
                  onClick={() => setHide(!hide)}
                >
                  <RxHamburgerMenu color="white" size={20} />
                </button>

                {!hide && (
                  <div className="Options">
                    <li>
                      <Link to="/login">Login</Link>
                    </li>
                    <li>
                      <Link to="/signup">Sign up</Link>
                    </li>
                  </div>
                )}
              </div>
            ) : (
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/signup">Sign up</Link>
                </li>
                <li>
                  <Link to="/about">About</Link>
                </li>
              </ul>
            )}
          </div>
        </nav>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="container-home">
          <h2>Your Trusted Waste Management Partner</h2>
          <p>
            Providing Sustainable Waste Solutions For A Cleaner Environment
          </p>
          <Link className="btn" to="/signup">
            Get Started
          </Link>
        </div>
      </section>

      {/* AIM */}
      <section className="ourAim">
        <div className="ourAimContainer">
          <section className="aimText">
            <p>
              We provide a platform that enables people to list their waste
              for responsible collection and disposal.
            </p>
          </section>

          <img
            src={image}
            alt="Waste management and recycling"
          />
        </div>
      </section>

      {/* SERVICES */}
      <section className="features">
        <div className="container-home">
          <h2>Our Services</h2>

          <div className="feature-box">
            <h3>Reduce</h3>
            <p>
              With every act of waste reduction, we pave the way for a world
              where conservation and harmony reign supreme.
            </p>
          </div>

          <div className="feature-box">
            <h3>Waste Collection</h3>
            <p>
              Reliable waste collection services for residential and
              commercial clients.
            </p>
          </div>

          <div className="feature-box">
            <h3>Hazardous Waste Disposal</h3>
            <p>
              Safe and compliant disposal of hazardous waste materials.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="container-home">
          <p>&copy; 2024 Haritha Karma Sena. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
