import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/MapComponent.css";
import customIcon from "../assets/marker_map_icon.png";

// FIX LEAFLET DEFAULT ICONS
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

/* CUSTOM MARKER */
const markerIcon = new L.Icon({
  iconUrl: customIcon,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

// SUB-COMPONENT TO REACT TO PROP CHANGES
const Controller = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 15, { animate: true });
    }
  }, [center, map]);
  return null;
};

// SUB-COMPONENT FOR CLICK EVENTS
const MapClickHandler = ({ setMarkerPosition, onLocationSelect }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setMarkerPosition([lat, lng]);
      onLocationSelect?.([lng, lat]); // Long, Lat format
    },
  });
  return null;
};

function MapComponent({ onLocationSelect, initialLocation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [mapCenter, setMapCenter] = useState([9.6258, 76.761]); // Kerala default
  const [markerPosition, setMarkerPosition] = useState(
    initialLocation ? [initialLocation[1], initialLocation[0]] : null
  );

  /* 📏 SEARCH LOCATION */
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&countrycodes=in` // Limited to India for better results
      );

      const data = await res.json();

      if (!data || data.length === 0) {
        alert("Location not found");
        return;
      }

      const lat = parseFloat(data[0].lat);
      const lng = parseFloat(data[0].lon);

      setMarkerPosition([lat, lng]);
      setMapCenter([lat, lng]);
      onLocationSelect?.([lng, lat]);
    } catch (err) {
      console.error("Search failed:", err);
      alert("Search failed. Check your network.");
    }
  };

  return (
    <div className="map-outer-wrapper">
      {/* SEARCH BAR */}
      <div className="map-search-container">
        <input
          className="map-search-input"
          type="text"
          placeholder="Search location (town, village)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button className="map-search-btn" onClick={handleSearch}>
          Locate
        </button>
      </div>

      {/* MAP */}
      <MapContainer
        center={markerPosition || mapCenter}
        zoom={12}
        className="map-actual-container"
        style={{ height: "400px", width: "100%", borderRadius: "12px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
        />

        <Controller center={mapCenter} />

        <MapClickHandler
          setMarkerPosition={setMarkerPosition}
          onLocationSelect={onLocationSelect}
        />

        {markerPosition && (
          <Marker position={markerPosition} icon={markerIcon} />
        )}
      </MapContainer>
      <small style={{ color: "gray", marginTop: "5px", display: "block" }}>
        * Click on map to pin exact location
      </small>
    </div>
  );
}

export default MapComponent;
