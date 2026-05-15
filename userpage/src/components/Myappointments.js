import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Myappointments() {
  const [appointments, setAppointments] = useState([]);

  const [popup, setPopup] = useState({
    show: false,
    message: "",
    type: "",
  });

  const showPopup = (msg, type = "error") => {
    setPopup({ show: true, message: msg, type });

    setTimeout(() => {
      setPopup({ show: false, message: "", type: "" });
    }, 2000);
  };

  // ================= FETCH =================
  useEffect(() => {
    fetch("http://127.0.0.1:8000/my-appointments/", {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setAppointments(data))
      .catch(() => showPopup("Failed to load appointments"));
  }, []);

  // ================= CANCEL =================
  const handleCancel = async (id) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/cancel-appointment/${id}/`,
        {
          method: "POST",
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        showPopup("Appointment cancelled successfully", "success");

        setAppointments((prev) =>
          prev.map((a) =>
            a.id === id ? { ...a, status: "cancelled" } : a
          )
        );
      } else {
        showPopup(data.error || "Cancel failed");
      }
    } catch {
      showPopup("Server error");
    }
  };

  // ================= DATE FIX (IMPORTANT) =================
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = appointments.filter((a) => {
    const apptDate = new Date(a.appointment_date);
    apptDate.setHours(0, 0, 0, 0);

    return apptDate >= today && a.status !== "cancelled";
  });

  const past = appointments.filter((a) => {
    const apptDate = new Date(a.appointment_date);
    apptDate.setHours(0, 0, 0, 0);

    return apptDate < today || a.status === "completed" || a.status === "cancelled";
  });

  // ================= STATUS COLOR =================
  const getStatusColor = (status) => {
    if (status === "confirmed") return "#2ecc71";
    if (status === "cancelled") return "#e74c3c";
    if (status === "completed") return "#3498db";
    return "#7f8c8d";
  };

  return (
    <div style={styles.container}>
      <Navbar />

      {/* ================= POPUP ================= */}
      {popup.show && (
        <div style={styles.overlay}>
          <div style={styles.popupCard}>
            <div style={styles.icon}>
              {popup.type === "success" ? "✅" : "⚠️"}
            </div>
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

      <div style={styles.main}>
        <h1 style={styles.title}>My Appointments</h1>

        {/* UPCOMING */}
        <h2 style={styles.section}>🟢 Upcoming Appointments</h2>

        <div style={styles.grid}>
          {upcoming.length > 0 ? (
            upcoming.map((a) => (
              <div key={a.id} style={styles.card}>
                <h3>{a.doctor_name}</h3>
                <p>📅 {a.appointment_date}</p>
                <p>⏰ {a.time_slot}</p>

                <span
                  style={{
                    ...styles.badge,
                    background: getStatusColor(a.status),
                  }}
                >
                  {a.status}
                </span>

                {a.status !== "cancelled" && (
                  <button
                    style={styles.cancelBtn}
                    onClick={() => handleCancel(a.id)}
                  >
                    Cancel
                  </button>
                )}
              </div>
            ))
          ) : (
            <p>No upcoming appointments</p>
          )}
        </div>

        {/* PAST */}
        <h2 style={styles.section}>🔵 Past Appointments</h2>

        <div style={styles.grid}>
          {past.length > 0 ? (
            past.map((a) => (
              <div key={a.id} style={styles.card}>
                <h3>{a.doctor_name}</h3>
                <p>📅 {a.appointment_date}</p>
                <p>⏰ {a.time_slot}</p>

                <span
                  style={{
                    ...styles.badge,
                    background: getStatusColor(a.status),
                  }}
                >
                  {a.status}
                </span>
              </div>
            ))
          ) : (
            <p>No past appointments</p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Myappointments;

/* ================= STYLES ================= */
const styles = {
  container: {
    minHeight: "100vh",
    background: "#f4f6f9",
    fontFamily: "Arial",
  },

  main: {
    padding: "30px",
    textAlign: "center",
  },

  title: {
    color: "#2c3e50",
    marginBottom: "20px",
  },

  section: {
    marginTop: "30px",
    marginBottom: "15px",
    color: "#34495e",
  },

  grid: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "20px",
  },

  card: {
    background: "#fff",
    padding: "18px",
    borderRadius: "12px",
    width: "260px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    transition: "0.3s",
  },

  badge: {
    display: "inline-block",
    padding: "5px 12px",
    borderRadius: "20px",
    color: "#fff",
    fontSize: "12px",
    marginTop: "10px",
  },

  cancelBtn: {
    marginTop: "12px",
    width: "100%",
    padding: "9px",
    background: "#e74c3c",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  /* POPUP */
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
    fontSize: "28px",
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
};