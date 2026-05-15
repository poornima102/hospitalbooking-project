import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Doctorprofile() {
  const { doctor_id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [availableDays, setAvailableDays] = useState([]);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [feedbacks, setFeedbacks] = useState([]);
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");

  const [popup, setPopup] = useState({ show: false, message: "" });

  // ================= GET DAY NAME =================
  const getDayName = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
    });

  // ================= FETCH DOCTOR =================
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/doctor-details/${doctor_id}/`, {
      headers: { Authorization: `Token ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setDoctor(data.doctor);
        setAvailableTimes(data.doctor.available_time_slots || []);
        setAvailableDays(data.doctor.available_days || []);
      });
  }, [doctor_id]);

  // ================= FEEDBACK =================
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/doctor-feedback/${doctor_id}/`, {
      headers: { Authorization: `Token ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setFeedbacks(data));
  }, [doctor_id]);

  const avgRating =
    feedbacks.length > 0
      ? (
          feedbacks.reduce((sum, f) => sum + f.rating, 0) /
          feedbacks.length
        ).toFixed(1)
      : 0;

  // ================= DATE VALIDATION =================
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    const dayName = getDayName(selectedDate);

    if (!availableDays.includes(dayName)) {
      setPopup({
        show: true,
        message: `❌ Doctor not available on ${dayName}`,
      });
      setDate("");
      return;
    }

    setDate(selectedDate);
  };

  // ================= BOOK =================
  const handleBook = () => {
    if (!date || !time) {
      setPopup({
        show: true,
        message: "Please select date and time",
      });
      return;
    }

    navigate("/appointment", {
      state: { doctor, doctor_id, date, time },
    });
  };

  // ================= FEEDBACK =================
  const submitFeedback = () => {
    if (!rating || !comment) {
      setPopup({
        show: true,
        message: "Please fill all fields",
      });
      return;
    }

    fetch(`http://127.0.0.1:8000/doctor-feedback/${doctor_id}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ rating, comment }),
    })
      .then((res) => res.json())
      .then((data) => {
        setFeedbacks([data, ...feedbacks]);
        setRating("");
        setComment("");
      });
  };

  if (!doctor) return <h2 style={styles.loading}>Loading...</h2>;

  return (
    <div style={styles.page}>
      <Navbar />

      {/* ================= POPUP ================= */}
      {popup.show && (
        <div style={styles.overlay}>
          <div style={styles.popup}>
            <h3>Notice</h3>
            <p>{popup.message}</p>
            <button onClick={() => setPopup({ show: false })}>
              OK
            </button>
          </div>
        </div>
      )}

      {/* ================= MAIN LAYOUT ================= */}
      <div style={styles.container}>

        {/* ================= LEFT CARD ================= */}
        <div style={styles.leftCard}>
          <img
            src={
              doctor.image ||
              "https://cdn-icons-png.flaticon.com/512/387/387561.png"
            }
            alt={doctor.name}
            style={styles.image}
          />

          <h2>{doctor.name}</h2>

          <p>👨‍⚕️ {doctor.field}</p>
          <p>🎓 {doctor.qualification}</p>
          <p>⏳ {doctor.experience} years</p>
          <p>⭐ Rating: {avgRating}</p>
          <p>⚧ Gender: {doctor.gender || "Not available"}</p>
          <p>📧 {doctor.email || "Not available"}</p>

          {/* AVAILABLE DAYS */}
          <div style={styles.daysBox}>
            <h4>Available Days</h4>
            <div style={styles.days}>
              {availableDays.map((d, i) => (
                <span key={i} style={styles.dayBadge}>
                  {d}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ================= RIGHT CARD ================= */}
        <div style={styles.rightCard}>
          <h3>Book Appointment</h3>

          <input
            type="date"
            value={date}
            onChange={handleDateChange}
            style={styles.input}
          />

          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            style={styles.input}
          >
            <option value="">Select Time</option>
            {availableTimes.map((t, i) => (
              <option key={i}>{t}</option>
            ))}
          </select>

          <button style={styles.bookBtn} onClick={handleBook}>
            Continue Booking
          </button>

          {/* ================= FEEDBACK ================= */}
          <div style={{ marginTop: "30px" }}>
            <h3>Reviews</h3>

            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              style={styles.input}
            >
              <option value="">Rating</option>
              <option value="5">⭐⭐⭐⭐⭐</option>
              <option value="4">⭐⭐⭐⭐</option>
              <option value="3">⭐⭐⭐</option>
              <option value="2">⭐⭐</option>
              <option value="1">⭐</option>
            </select>

            <textarea
              placeholder="Write your review..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={styles.textarea}
            />

            <button style={styles.reviewBtn} onClick={submitFeedback}>
              Submit Review
            </button>

            <div style={styles.reviewBox}>
              {feedbacks.map((f, i) => (
                <div key={i} style={styles.reviewCard}>
                  <b>{f.user_name}</b>
                  <p>{"⭐".repeat(f.rating)}</p>
                  <p>{f.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Doctorprofile;

/* ================= STYLES ================= */
const styles = {
  page: {
    background: "#f4f6f9",
    minHeight: "100vh",
  },

  container: {
    display: "flex",
    gap: "20px",
    padding: "30px",
    justifyContent: "center",
    flexWrap: "wrap",
  },

  leftCard: {
    width: "320px",
    background: "#fff",
    borderRadius: "15px",
    padding: "25px",
    textAlign: "center",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  },

  rightCard: {
    width: "450px",
    background: "#fff",
    borderRadius: "15px",
    padding: "25px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  },

  image: {
    width: "130px",
    height: "130px",
    borderRadius: "50%",
    border: "4px solid #2c3e50",
  },

  input: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },

  textarea: {
    width: "100%",
    height: "80px",
    marginTop: "10px",
    borderRadius: "8px",
    padding: "10px",
  },

  bookBtn: {
    width: "100%",
    marginTop: "15px",
    padding: "10px",
    background: "#2c3e50",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
  },

  reviewBtn: {
    width: "100%",
    marginTop: "10px",
    padding: "10px",
    background: "#27ae60",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
  },

  reviewBox: {
    marginTop: "15px",
  },

  reviewCard: {
    background: "#f8f9fa",
    padding: "10px",
    borderRadius: "8px",
    marginTop: "10px",
  },

  daysBox: {
    marginTop: "15px",
  },

  days: {
    display: "flex",
    flexWrap: "wrap",
    gap: "5px",
    justifyContent: "center",
  },

  dayBadge: {
    background: "#2c3e50",
    color: "#fff",
    padding: "5px 8px",
    borderRadius: "20px",
    fontSize: "12px",
  },

  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  popup: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
  },

  loading: {
    textAlign: "center",
    marginTop: "50px",
  },
};