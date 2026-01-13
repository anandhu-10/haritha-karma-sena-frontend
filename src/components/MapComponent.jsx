import React, { useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/MapComponent.css";
import customIcon from "../assets/marker_map_icon.png";

const markerIcon = new L.Icon({
  iconUrl: customIcon,
  iconSize: [24, 24],
  iconAnchor: [12, 24],
});

function MapComponent({ onLocationSelect }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [mapCenter, setMapCenter] = useState([9.6258, 76.761]);
  const [markerPosition, setMarkerPosition] = useState(null);

  const mapRef = useRef(null);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarkerPosition([lat, lng]);
        onLocationSelect?.([lng, lat]);
      },
    });
    return null;
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const res = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
          searchQuery
        )}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`
      );

      const data = await res.json();
      if (!data.results?.length) {
        alert("Location not found");
        return;
      }

      const { lat, lng } = data.results[0].geometry;

      setMapCenter([lat, lng]);
      setMarkerPosition([lat, lng]);
      onLocationSelect?.([lng, lat]);

      mapRef.current?.flyTo([lat, lng], 14);
    } catch (err) {
      console.error("Geocoding failed", err);
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
