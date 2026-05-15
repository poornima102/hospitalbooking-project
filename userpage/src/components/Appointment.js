import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Appointment() {
  const location = useLocation();
  const navigate = useNavigate();

  const { doctor, doctor_id, date, time } = location.state || {};

  const [popup, setPopup] = useState({ show: false, message: "" });
  const [loading, setLoading] = useState(false);

  // ❌ NO DATA HANDLING
  if (!doctor || !date || !time) {
    return (
      <div style={styles.center}>
        <h2>No Appointment Data Found</h2>
        <button onClick={() => navigate("/doctorslist")}>
          Go Back
        </button>
      </div>
    );
  }

  // ================= BOOK CONFIRM =================
  const handleConfirm = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "http://127.0.0.1:8000/book-appointment/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({
            doctor_id: doctor_id,
            appointment_date: date,
            time_slot: time,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setPopup({
          show: true,
          message: "Appointment booked successfully!",
        });

        setTimeout(() => {
          navigate("/myappointments");
        }, 1500);
      } else {
        setPopup({
          show: true,
          message: data.error || "Booking failed",
        });
      }
    } catch {
      setPopup({
        show: true,
        message: "Server error. Try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <Navbar />

      {/* ================= POPUP ================= */}
      {popup.show && (
        <div style={styles.overlay}>
          <div style={styles.popupCard}>
            <div style={styles.icon}>📅</div>
            <h3>Confirmation</h3>
            <p>{popup.message}</p>

            <button
              style={styles.okBtn}
              onClick={() => setPopup({ show: false })}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* ================= MAIN ================= */}
      <div style={styles.main}>
        <div style={styles.card}>
          <h2>Confirm Appointment</h2>

          <div style={styles.infoBox}>
            <p><b>Doctor:</b> {doctor.name}</p>
            <p><b>Specialization:</b> {doctor.field}</p>
            <p><b>Date:</b> {date}</p>
            <p><b>Time:</b> {time}</p>
          </div>

          <button
            style={styles.button}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Booking..." : "Confirm Booking"}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Appointment;

/* ================= STYLES ================= */
const styles = {
  container: {
    minHeight: "100vh",
    background: "#f4f6f9",
    display: "flex",
    flexDirection: "column",
  },

  main: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    width: "420px",
    textAlign: "center",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  },

  infoBox: {
    textAlign: "left",
    marginTop: "15px",
    marginBottom: "20px",
    lineHeight: "1.8",
    padding: "10px",
    background: "#f9fafc",
    borderRadius: "8px",
  },

  button: {
    width: "100%",
    padding: "10px",
    background: "#2c3e50",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.55)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  popupCard: {
    background: "#fff",
    padding: "25px",
    borderRadius: "14px",
    width: "300px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  },

  icon: {
    fontSize: "30px",
    marginBottom: "10px",
  },

  okBtn: {
    marginTop: "15px",
    padding: "8px 20px",
    background: "#2c3e50",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  center: {
    textAlign: "center",
    marginTop: "100px",
  },
};