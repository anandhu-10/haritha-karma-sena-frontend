import React from "react";
import ReactDOM from "react-dom/client";

import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import "leaflet/dist/leaflet.css";

/* ---------- PAGES ---------- */
import Home from "./Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import CollectorHome from "./pages/CollectorHome";
import DisposerHome from "./pages/DisposerHome";
import DisposerDetails from "./pages/DisposerDetails";
import ProfilePage from "./pages/ProfilePage";
import CollectorHelp from "./pages/CollectorHelp"; // ✅ ADD THIS

/* ---------- COMPONENTS ---------- */
import AddItemsC from "./components/AddItemsC";
import ViewCollectionAreas from "./components/ViewCollectionAreas";
import NewRqFromD from "./components/NewRqFromD";

import "./index.css";

/* ---------- PROTECTED ROUTE ---------- */
const ProtectedRoute = ({ children, role }) => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;

  return children;
};

/* ---------- ROUTER ---------- */
const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/about", element: <About /> },

  {
    path: "/collector",
    element: (
      <ProtectedRoute role="collector">
        <CollectorHome />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AddItemsC /> }, // Dashboard
      { path: "areas", element: <ViewCollectionAreas /> },
      { path: "requests", element: <NewRqFromD /> },
      { path: "help", element: <CollectorHelp /> }, // ✅ ADD THIS
    ],
  },

  {
    path: "/disposer/details",
    element: (
      <ProtectedRoute role="disposer">
        <DisposerDetails />
      </ProtectedRoute>
    ),
  },

  {
    path: "/disposer",
    element: (
      <ProtectedRoute role="disposer">
        <DisposerHome />
      </ProtectedRoute>
    ),
    children: [
      { path: "profile", element: <ProfilePage /> },
    ],
  },

  { path: "*", element: <Navigate to="/" replace /> },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
