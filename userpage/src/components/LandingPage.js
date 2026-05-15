import React from "react";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>

      {/* LEFT SIDE */}
      <div style={styles.left}>
        <h1 style={styles.logo}>DocBook</h1>

        <h2 style={styles.heading}>
          Your Health, <br /> Simplified
        </h2>

        <p style={styles.text}>
          Book appointments with top doctors, manage your health records,
          and get the care you deserve — all in one place.
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div style={styles.right}>
        <div style={styles.card}>

          <h2 style={styles.cardTitle}>Welcome</h2>

          <p style={styles.subtitle}>
            Book appointments with trusted doctors easily
          </p>

          {/* Login Button */}
          <button
            style={styles.loginBtn}
            onClick={() => navigate("/login")}
          >
            Login
          </button>

          {/* Register Button */}
          <button
            style={styles.registerBtn}
            onClick={() => navigate("/register")}
          >
            Sign Up
          </button>

        </div>
      </div>

    </div>
  );
}

export default LandingPage;

// 🎨 STYLES
const styles = {
  container: {
    display: "flex",
    height: "100vh",
    fontFamily: "Segoe UI, sans-serif",
  },

  // LEFT SIDE
  left: {
    flex: 1,
    backgroundColor: "#2563EB",
    color: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "60px",
  },

  logo: {
    fontSize: "30px",
    fontWeight: "bold",
    marginBottom: "20px",
  },

  heading: {
    fontSize: "42px",
    marginBottom: "20px",
    lineHeight: "1.2",
  },

  text: {
    fontSize: "16px",
    maxWidth: "420px",
    opacity: 0.9,
    lineHeight: "1.6",
  },

  // RIGHT SIDE
  right: {
    flex: 1,
    background: "#f3f6fb",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  // CARD
  card: {
    backgroundColor: "white",
    padding: "50px 35px",
    borderRadius: "18px",
    width: "330px",
    textAlign: "center",
    boxShadow: "0 15px 35px rgba(0,0,0,0.08)",
    border: "1px solid #eef2f7",
  },

  cardTitle: {
    marginBottom: "10px",
    fontSize: "24px",
    fontWeight: "600",
    color: "#1f2937",
  },

  subtitle: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "30px",
  },

  loginBtn: {
    width: "100%",
    padding: "12px",
    background: "linear-gradient(135deg, #2563EB, #1E40AF)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    marginBottom: "12px",
    cursor: "pointer",
    fontWeight: "600",
  },

  registerBtn: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#10B981",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
};