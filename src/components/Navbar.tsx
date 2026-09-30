// import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  // Retrieve user info from localStorage (if stored during login)
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    // 1. Clear stored JWT token and user details
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

    // 2. Redirect to Login page
    navigate("/login");
  };

  return (
    <nav style={styles.navbar}>
      {/* Brand / Logo Section */}
      <div style={styles.brand} onClick={() => navigate("/policycalculation")}>
        <span style={styles.logoIcon}>🛡️</span>
        <span style={styles.brandTitle}>PolicyPortal</span>
      </div>

      {/* Navigation Links / Tabs */}
      <div style={styles.navLinks}>
        <NavLink
          to="/policycalculation"
          style={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
        >
          Policy Calculation
        </NavLink>

        <NavLink
          to="/illustration"
          style={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
        >
          Illustration
        </NavLink>
      </div>

      {/* User Info & Logout Button */}
      <div style={styles.userSection}>
        {user.name && <span style={styles.userInfo}>Hello, {user.name}</span>}

        {localStorage.getItem("user") && (
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

// Inline CSS Styles for self-contained usage
const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1e293b", // Slate 800
    padding: "0.8rem 2rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
  },
  logoIcon: {
    fontSize: "1.5rem",
  },
  brandTitle: {
    color: "#ffffff",
    fontSize: "1.25rem",
    fontWeight: "bold",
    letterSpacing: "0.5px",
  },
  navLinks: {
    display: "flex",
    gap: "1.5rem",
  },
  link: {
    color: "#94a3b8", // Slate 400
    textDecoration: "none",
    fontSize: "1rem",
    fontWeight: "500",
    padding: "0.5rem 0.8rem",
    borderRadius: "6px",
    transition: "all 0.2s ease-in-out",
  },
  activeLink: {
    color: "#ffffff",
    backgroundColor: "#3b82f6", // Blue 500
    textDecoration: "none",
    fontSize: "1rem",
    fontWeight: "600",
    padding: "0.5rem 0.8rem",
    borderRadius: "6px",
  },
  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  userInfo: {
    color: "#e2e8f0",
    fontSize: "0.9rem",
  },
  logoutBtn: {
    backgroundColor: "#ef4444", // Red 500
    color: "#ffffff",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "600",

    transition: "background-color 0.2s ease",
  },
};

export default Navbar;
