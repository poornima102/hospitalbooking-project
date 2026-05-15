import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  // 🔐 Prevent going back to protected pages after logout/login
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    window.history.pushState(null, "", window.location.href);

    window.onpopstate = () => {
      window.history.pushState(null, "", window.location.href);
    };
  }, []);

  // 🚪 Logout function (PROPER FIX)
  const handleLogout = () => {
    localStorage.clear(); // removes token + user + everything

    // prevent back navigation
    window.history.pushState(null, "", "/login");

    navigate("/login", { replace: true });
  };

  const token = localStorage.getItem("token");

  // 🔒 Hide navbar if not logged in (optional but professional)
  if (!token) return null;

  return (
    <header style={styles.navbar}>
      
      {/* Logo */}
      <div
        style={styles.logoContainer}
        onClick={() => navigate("/home")}
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/2966/2966485.png"
          alt="logo"
          style={styles.logoImg}
        />
        <h2 style={styles.logoText}>DocBook</h2>
      </div>

      {/* Nav Links */}
      <nav>
        <ul style={styles.navLinks}>

          <li>
            <NavLink to="/home" style={styles.link}>
              Home
            </NavLink>
          </li>

          <li>
            <NavLink to="/doctorslist" style={styles.link}>
              Doctors
            </NavLink>
          </li>

          <li>
            <NavLink to="/myappointments" style={styles.link}>
              My Appointments
            </NavLink>
          </li>

          <li>
            <NavLink to="/profile" style={styles.link}>
              Profile
            </NavLink>
          </li>

          <li style={styles.logout} onClick={handleLogout}>
            Logout
          </li>

        </ul>
      </nav>
    </header>
  );
}

export default Navbar;

/* ================= STYLES ================= */
const styles = {
  navbar: {
    backgroundColor: "#2c3e50",
    color: "white",
    padding: "15px 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
  },

  logoImg: {
    width: "35px",
    height: "35px",
  },

  logoText: {
    margin: 0,
    fontSize: "20px",
  },

  navLinks: {
    listStyle: "none",
    display: "flex",
    gap: "20px",
    margin: 0,
    padding: 0,
    alignItems: "center",
  },

  link: {
    textDecoration: "none",
    color: "white",
    fontWeight: "500",
  },

  logout: {
    color: "#e74c3c",
    fontWeight: "bold",
    cursor: "pointer",
  },
};