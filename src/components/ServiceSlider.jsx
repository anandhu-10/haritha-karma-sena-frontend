import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/serviceSlider.css";

function ServiceSlider({
  sliderData = [],
  icons = [],
  changeServicePage,
}) {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();

  const handleClick = (index, path) => {
    setActive(index);

    // Optional callback (for non-routing usage)
    if (typeof changeServicePage === "function") {
      changeServicePage(index);
    }

    // ✅ FIX: always navigate (handles index route correctly)
    navigate(path || ".");
  };

  return (
    <div className="sliderContainer">
      {sliderData.map((item, index) => {
        const Icon = icons[index];

        return (
          <div
            key={`${item.label}-${index}`}
            className={`slider ${active === index ? "active" : ""}`}
            onClick={() => handleClick(index, item.path)}
          >
            {/* ICON */}
            {Icon && (
              <span className="icon">
                <Icon />
              </span>
            )}

            {/* LABEL */}
            <span className="label">{item.label}</span>

            {/* PROGRESS BAR */}
            <div
              className={`progressBar ${active === index ? "show" : ""}`}
            />
          </div>
        );
      })}
    </div>
  );
}

export default ServiceSlider;
