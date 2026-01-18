import React, { useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/MapComponent.css";
import customIcon from "../assets/marker_map_icon.png";

/* CUSTOM MARKER */
const markerIcon = new L.Icon({
  iconUrl: customIcon,
  iconSize: [24, 24],
  iconAnchor: [12, 24],
});

function MapComponent({ onLocationSelect }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [mapCenter, setMapCenter] = useState([9.6258, 76.761]); // Kerala default
  const [markerPosition, setMarkerPosition] = useState(null);

  const mapRef = useRef(null);

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

  /* 🔍 SEARCH LOCATION (FIXED — NO API KEY) */
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}`
      );

      const data = await res.json();

      if (!data.length) {
        alert("Location not found");
        return;
      }

      const lat = parseFloat(data[0].lat);
      const lng = parseFloat(data[0].lon);

      setMapCenter([lat, lng]);
      setMarkerPosition([lat, lng]);
      onLocationSelect?.([lng, lat]);

      // ✅ move map
      mapRef.current?.flyTo([lat, lng], 14);
    } catch (err) {
      console.error("Search failed", err);
      alert("Search failed");
    }
  };

  return (
    <div className="map-wrapper">
      {/* SEARCH BAR */}
      <div className="search-bar">
        <input
          className="search-box"
          type="text"
          placeholder="Enter location..."
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
        style={{ height: "420px", width: "100%" }}
        whenCreated={(map) => (mapRef.current = map)}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
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
