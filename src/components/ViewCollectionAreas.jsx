import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { FaTrash } from "react-icons/fa6";
import "../styles/Table.css";

function ViewCollectionAreas() {
  const { user } = useOutletContext();

  const [collectionAreaDetails, setCollectionAreaDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const ROWS_PER_PAGE = 10;
  const API_URL = process.env.REACT_APP_API_URL || "https://haritha-karma-sena-backend.onrender.com";

  useEffect(() => {
    if (!user) return;

    async function fetchCollectionAreas() {
      try {
        const res = await fetch(`${API_URL}/api/collectionAreas`);

        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        setCollectionAreaDetails(data);
      } catch (err) {
        console.error(err);
        alert("Failed to load collection areas");
      }
    }

    fetchCollectionAreas();
  }, [user, API_URL]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this collection area?")) return;

    try {
      const token = localStorage.getItem("token");
      // Trying the most likely variations if the first one fails
      const res = await fetch(`${API_URL}/api/collectionAreas/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setCollectionAreaDetails((prev) => prev.filter((item) => item._id !== id));
        alert("Area removed successfully");
      } else if (res.status === 404) {
        throw new Error("The delete feature is not yet enabled on the backend server (404 Not Found). Please contact the administrator.");
      } else {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to delete (Status: ${res.status})`);
      }
    } catch (err) {
      console.error("DELETE ERROR:", err);
      alert(err.message || "Failed to remove collection area");
    }
  };

  const startIndex = currentPage * ROWS_PER_PAGE;
  const endIndex = startIndex + ROWS_PER_PAGE;
  const currentPageData = collectionAreaDetails.slice(startIndex, endIndex);

  return (
    <div className="table-wrapper">
      <h2>Collection Areas</h2>

      {collectionAreaDetails.length === 0 ? (
        <p>No collection areas found.</p>
      ) : (
        <table className="custom-table">
          <thead>
            <tr>
              <th>#</th>
              <th>ID</th>
              <th>Area (Lat, Lng)</th>
              <th>Types</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentPageData.map((item, index) => (
              <tr key={item._id}>
                <td>{startIndex + index + 1}</td>
                <td title={item._id}>{item._id.slice(-6)}</td>
                <td>
                  {item.location?.coordinates?.[1]?.toFixed(4)},{" "}
                  {item.location?.coordinates?.[0]?.toFixed(4)}
                </td>
                <td>{item.wasteTypes?.join(", ")}</td>
                <td>{item.date}</td>
                <td>
                  <button
                    className="btn-delete-small"
                    onClick={() => handleDelete(item._id)}
                    style={{
                      background: "#ffefef",
                      color: "#e53e3e",
                      border: "1px solid #feb2b2",
                      padding: "6px 10px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    <FaTrash size={12} /> Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* OPTIONAL PAGINATION */}
      {collectionAreaDetails.length > ROWS_PER_PAGE && (
        <div className="pagination">
          <button
            disabled={currentPage === 0}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </button>
          <button
            disabled={endIndex >= collectionAreaDetails.length}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default ViewCollectionAreas;
