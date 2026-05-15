import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [popup, setPopup] = useState({
    show: false,
    message: "",
    type: "",
  });

  // ================= LOAD PROFILE =================
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch("http://127.0.0.1:8000/profile/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setProfile({
            fullName: data.full_name,
            email: data.email,
            phone: data.phone,
          });
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();
  }, []);

  // ================= POPUP =================
  const showPopup = (message, type) => {
    setPopup({ show: true, message, type });

    setTimeout(() => {
      setPopup({ show: false, message: "", type: "" });
    }, 2000);
  };

  // ================= CHANGE PASSWORD =================
  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      showPopup("All fields are required", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showPopup("Passwords do not match", "error");
      return;
    }

    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/change-password/",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({
            old_password: oldPassword,
            new_password: newPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        showPopup("Password updated successfully 🎉 Logging out...", "success");

        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");

        // 🔥 AUTO LOGOUT + REDIRECT
        setTimeout(() => {
          localStorage.removeItem("token");
          navigate("/login");
        }, 1500);

      } else {
        showPopup(data.error || "Update failed", "error");
      }
    } catch (error) {
      showPopup("Server error ❌", "error");
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
          <div
            style={{
              ...styles.popupCard,
              borderLeft:
                popup.type === "success"
                  ? "6px solid #2ecc71"
                  : "6px solid #e74c3c",
            }}
          >
            <h3>
              {popup.type === "success" ? "Success" : "Error"}
            </h3>
            <p style={{ marginTop: "10px", color: "#555" }}>
              {popup.message}
            </p>
          </div>
        </div>
      )}

      {/* ================= MAIN ================= */}
      <div style={styles.main}>
        <h2>My Profile</h2>

        <div style={styles.wrapper}>
          {/* PROFILE CARD */}
          <div style={styles.card}>
            <h3>Personal Details</h3>
            <p><b>Name:</b> {profile.fullName}</p>
            <p><b>Email:</b> {profile.email}</p>
            <p><b>Phone:</b> {profile.phone}</p>
          </div>

          {/* PASSWORD CARD */}
          <div style={styles.card}>
            <h3>Change Password</h3>

            <input
              type="password"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              style={styles.input}
            />

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={styles.input}
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
            />

            <button onClick={handleChangePassword} style={styles.btn}>
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Profile;

/* ================= STYLES ================= */
const styles = {
  container: {
    fontFamily: "Arial",
  },

  main: {
    padding: "40px",
    textAlign: "center",
  },

  wrapper: {
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    marginTop: "30px",
    flexWrap: "wrap",
  },

  card: {
    width: "350px",
    padding: "25px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
    borderRadius: "12px",
    background: "#fff",
    textAlign: "left",
  },

  input: {
    width: "100%",
    marginBottom: "12px",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    outline: "none",
  },

  btn: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#2c3e50",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
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
    zIndex: 9999,
  },

  popupCard: {
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    textAlign: "center",
    minWidth: "300px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  },
};