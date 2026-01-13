import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import "../styles/Table.css";

function ViewCollectionAreas() {
  const { user } = useOutletContext();

  const [collectionAreaDetails, setCollectionAreaDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const ROWS_PER_PAGE = 10;

  useEffect(() => {
    if (!user) return;

    async function fetchCollectionAreas() {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/collectionAreas`
        );

        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        setCollectionAreaDetails(data);
      } catch (err) {
        console.error(err);
        alert("Failed to load collection areas");
      }
    }

    fetchCollectionAreas();
  }, [user]);

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
            </tr>
          </thead>
          <tbody>
            {currentPageData.map((item, index) => (
              <tr key={item._id}>
                <td>{startIndex + index + 1}</td>
                <td>{item._id.slice(-6)}</td>
                <td>
                  {item.location?.coordinates?.[1]},{" "}
                  {item.location?.coordinates?.[0]}
                </td>
                <td>{item.wasteTypes?.join(", ")}</td>
                <td>{item.date}</td>
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
