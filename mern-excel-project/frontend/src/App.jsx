import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import History from "./pages/History.jsx";

// ✅ Import logo from assets
import logo from "./assets/logo.jpg";

function RequireAuth({ children }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user) {
    window.location = "/login";
    return null;
  }
  return children;
}

const Navbar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <div
      className="navbar"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#f5f5f5",
        padding: "10px 20px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      }}
    >
      {/* Left: Logo + Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <img
          src={logo}
          alt="Logo"
          style={{ height: "40px", width: "40px", objectFit: "contain" }}
        />
        <Link
          to="/"
          style={{
            fontWeight: "600",
            fontSize: "18px",
            color: "#292828ff",
            textDecoration: "none",
          }}
        >
          Excel Analytics
        </Link>
      </div>

      {/* Right: Navigation Links */}
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <Link to="/" style={{ textDecoration: "none", color: "#292828ff" }}>
          Dashboard
        </Link>
        <Link to="/history" style={{ textDecoration: "none", color: "#333" }}>
          History
        </Link>

        {user ? (
          <>
            <span style={{ opacity: 0.8 }}>
              Hi, {user.name || user.email}
            </span>
            <button
              className="btn"
              onClick={logout}
              style={{
                background: "#636262ff",
                color: "#fff",
                padding: "5px 12px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" style={{ textDecoration: "none", color: "#333" }}>
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <RequireAuth>
                <AdminDashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/user"
            element={
              <RequireAuth>
                <UserDashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/history"
            element={
              <RequireAuth>
                <History />
              </RequireAuth>
            }
          />
        </Routes>
      </div>
    </>
  );
}
