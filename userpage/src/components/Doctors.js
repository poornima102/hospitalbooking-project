import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Doctors() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [doctors, setDoctors] = useState([]);

  // ✅ Fetch doctors
  useEffect(() => {
    fetch("http://127.0.0.1:8000/doctors-list/", {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setDoctors(data.doctors))
      .catch((err) => console.error(err));
  }, []);

  // ✅ Navigate using doctor_id
  const handleViewProfile = (doc) => {
    navigate(`/doctorprofile/${doc.id}`);
  };

  const filteredDoctors = doctors.filter((doc) =>
    doc.name.toLowerCase().includes(search.toLowerCase()) ||
    doc.field.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <Navbar />

      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search doctor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      <div style={styles.cardContainer}>
        {filteredDoctors.map((doc) => (
          <div key={doc.id} style={styles.card}>
           <img
  src={
    doc.image
      ? doc.image   // use DB value directly
      : "https://cdn-icons-png.flaticon.com/512/387/387561.png"
  }
  alt={doc.name}
  style={styles.image}
/>

            <h3>{doc.name}</h3>
            <p>{doc.field}</p>

            <button
              style={styles.button}
              onClick={() => handleViewProfile(doc)}
            >
              View Profile
            </button>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}

export default Doctors;

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#f4f6f9",
  },

  searchContainer: {
    textAlign: "center",
    margin: "20px 0",
  },

  searchInput: {
    width: "320px",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    outline: "none",
  },

  cardContainer: {
    flex: 1,
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "20px",
    padding: "20px",
  },

  card: {
    backgroundColor: "white",
    width: "220px",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },

  image: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    marginBottom: "10px",
  },

  button: {
    marginTop: "10px",
    padding: "8px 15px",
    backgroundColor: "#2c3e50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  noResult: {
    textAlign: "center",
    width: "100%",
    fontSize: "16px",
    color: "gray",
  },
};