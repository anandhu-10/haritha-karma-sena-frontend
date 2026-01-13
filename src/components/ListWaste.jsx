import React, { useState, useContext } from "react";
import "../styles/listWaste.css";
import { GrFormNext } from "react-icons/gr";
import wastePreview from "../assets/noun-gallery-3783249.png";
import { WasteContext } from "../pages/DisposerHome";

function ListWaste() {
  const typeWaste = [
    "Plastics",
    "Metal",
    "E-Waste",
    "Paper",
    "Medical",
    "Organic",
    "Hazardous",
  ];

  const { setWasteDetails, user } = useContext(WasteContext);

  const [activeTab, setActiveTab] = useState("wasteType");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [checked, setChecked] = useState(
    new Array(typeWaste.length).fill(false)
  );
  const [loading, setLoading] = useState(false);

  /* ---------- SAFETY ---------- */
  if (!user) {
    return <p style={{ padding: 20 }}>User not loaded</p>;
  }

  /* ---------- WASTE TYPE ---------- */
  const handleCheckboxChange = (index) => {
    const updated = [...checked];
    updated[index] = !updated[index];
    setChecked(updated);

    if (updated[index]) {
      setSelectedTypes((prev) => [...prev, typeWaste[index]]);
    } else {
      setSelectedTypes((prev) =>
        prev.filter((t) => t !== typeWaste[index])
      );
    }
  };

  const verifySelectedTypes = () => {
    if (selectedTypes.length === 0) {
      shake();
      return;
    }
    setActiveTab("image");
  };

  /* ---------- IMAGE ---------- */
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image too large (max 2MB)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => setSelectedImage(ev.target.result);
    reader.readAsDataURL(file);
  };

  const validateImage = () => {
    setActiveTab("confirm");
  };

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async () => {
    // ✅ SAFETY CHECK (IMPORTANT)
    if (!user?._id && !user?.id) {
      alert("User not authenticated");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        disposerId: user._id || user.id, // ✅ FIXED
        disposerName: user.name || user.username,
        wasteTypes: selectedTypes,
        image: selectedImage,
        status: "Pending",
        date: new Date().toLocaleString(),
      };

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/disposer-requests`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Submission failed");
      }

      setWasteDetails((prev) => [data, ...prev]);

      alert("Waste request sent successfully");

      setSelectedTypes([]);
      setSelectedImage(null);
      setChecked(new Array(typeWaste.length).fill(false));
      setActiveTab("wasteType");
    } catch (err) {
      console.error("SUBMIT ERROR:", err);
      alert(err.message || "Failed to send waste request");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- SHAKE ---------- */
  const shake = () => {
    const el = document.getElementById("containerLWD");
    if (!el) return;
    el.classList.add("error");
    setTimeout(() => el.classList.remove("error"), 800);
  };

  return (
    <div className="services">
      <div className="wasteMenuContainer" id="containerLWD">

        {/* STEP 1 */}
        <div className={`wasteType ${activeTab === "wasteType" ? "active" : ""}`}>
          <h3>Select Waste Type</h3>

          <div className="wasteTypesOption">
            {typeWaste.map((value, index) => (
              <button
                key={value}
                className={checked[index] ? "green" : ""}
                onClick={() => handleCheckboxChange(index)}
              >
                {value}
              </button>
            ))}
          </div>

          <GrFormNext className="nextIcon" onClick={verifySelectedTypes} />
        </div>

        {/* STEP 2 */}
        <div
          className={`wasteImageContainer ${
            activeTab === "image" ? "active" : ""
          }`}
        >
          <h3>Add Image</h3>

          <img
            src={selectedImage || wastePreview}
            alt="Waste preview"
            className="selectedWastePreview"
          />

          <input
            className="wasteImgFile"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />

          <GrFormNext
            className="backIcon"
            onClick={() => setActiveTab("wasteType")}
          />
          <GrFormNext
            className="nextIconImage"
            onClick={validateImage}
          />
        </div>

        {/* STEP 3 */}
        <div
          className={`findCollectors ${
            activeTab === "confirm" ? "active" : ""
          }`}
        >
          <h3>Confirm Request</h3>
          <p>Waste Types: {selectedTypes.join(", ")}</p>

          <button
            className="submitC"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>

          <GrFormNext
            className="backIconC"
            onClick={() => setActiveTab("image")}
          />
        </div>

      </div>
    </div>
  );
}

export default ListWaste;
