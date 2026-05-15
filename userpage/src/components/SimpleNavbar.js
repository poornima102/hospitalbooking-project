import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

function SimpleNavbar() {
  const navigate = useNavigate();

  return (
    <nav style={styles.nav}>

      {/* LEFT: Logo */}
      <div style={styles.left}>
        <h2 style={styles.logo} onClick={() => navigate("/")}>
          DocBook
        </h2>
      </div>

      {/* CENTER: Links */}
      <div style={styles.center}>
        <NavLink to="/" style={styles.link}>
          Home
        </NavLink>

        <NavLink to="/login" style={styles.link}>
          Login
        </NavLink>

        <NavLink to="/register" style={styles.link}>
          Register
        </NavLink>
      </div>

      {/* RIGHT (empty for now for balance) */}
      <div style={styles.right}></div>

    </nav>
  );
}

export default SimpleNavbar;

const styles = {
  nav: {
    width: "100%",
    padding: "14px 30px",
    backgroundColor: "#2c3e50",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
  },

  left: {
    flex: 1,
  },

  center: {
    flex: 2,
    display: "flex",
    justifyContent: "center",
    gap: "30px",
  },

  right: {
    flex: 1,
  },

  logo: {
    color: "white",
    margin: 0,
    fontSize: "22px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  link: ({ isActive }) => ({
    color: isActive ? "#1abc9c" : "white",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: isActive ? "bold" : "500",
    transition: "0.2s",
  }),
};