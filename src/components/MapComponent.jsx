import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/MapComponent.css";
import customIcon from "../assets/marker_map_icon.png";

/* CUSTOM MARKER */
const markerIcon = new L.Icon({
  iconUrl: customIcon,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

function MapComponent({ onLocationSelect }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [mapCenter, setMapCenter] = useState([9.6258, 76.761]); // Kerala default
  const [markerPosition, setMarkerPosition] = useState(null);
  const [map, setMap] = useState(null);

  /* CLICK TO SELECT LOCATION */
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarkerPosition([lat, lng]);
        onLocationSelect?.([lng, lat]); // keep your format
      },
    });
    return null;
  };

  /* 📏 SEARCH LOCATION */
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}`
      );

      const data = await res.json();

      if (!data || data.length === 0) {
        alert("Location not found");
        return;
      }

      const lat = parseFloat(data[0].lat);
      const lng = parseFloat(data[0].lon);

      setMarkerPosition([lat, lng]);
      onLocationSelect?.([lng, lat]);

      if (map) {
        map.flyTo([lat, lng], 14);
      }
    } catch (err) {
      console.error("Search failed", err);
      alert("Search failed or service unavailable. Try a simpler name.");
    }
  };

  /* 🔥 FIX FOR MAP NOT LOADING TILES CORRECTLY (GRAY AREAS) */
  useEffect(() => {
    if (map) {
      setTimeout(() => {
        map.invalidateSize();
      }, 500);
    }
  }, [map]);

  return (
    <div className="map-wrapper">
      {/* SEARCH BAR */}
      <div className="search-bar">
        <input
          className="search-box"
          type="text"
          placeholder="Enter location (e.g. Kottayam)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* MAP */}
      <MapContainer
        center={mapCenter}
        zoom={10}
        className="map-container"
        style={{ height: "420px", width: "100%", zIndex: 1 }}
        ref={setMap}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClickHandler />

        {markerPosition && (
          <Marker position={markerPosition} icon={markerIcon} />
        )}
      </MapContainer>
    </div>
  );
}

export default MapComponent;
