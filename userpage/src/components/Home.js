import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Home() {
  return (
    <div style={styles.container}>

      {/* ✅ Navbar */}
      <Navbar />

      {/* Main Content */}
      <div style={styles.main}>
        <div style={styles.card}>
          <h1>Welcome to DocBook</h1>
          <p>
            Book appointments with experienced doctors quickly and easily.
            Manage your healthcare services in one place.
          </p>
        </div>
      </div>

      {/* ✅ Footer */}
      <Footer />

    </div>
  );
}

export default Home;

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },

  main: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f6f9",
  },

  card: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "10px",
    textAlign: "center",
    width: "420px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
};