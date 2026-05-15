import React from "react";
import { useNavigate } from "react-router-dom";
import SimpleNavbar from "./SimpleNavbar";
import SimpleFooter from "./SimpleFooter";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  // ✅ POPUP STATE
  const [popup, setPopup] = React.useState({
    show: false,
    message: "",
    type: "", // success | error
  });

  const handleLogin = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);

        setPopup({
          show: true,
          message: "Login successful 🎉",
          type: "success",
        });

        setTimeout(() => {
          navigate("/home");
        }, 1500);
      } else {
        setPopup({
          show: true,
          message: data.error || "Login failed",
          type: "error",
        });
      }
    } catch (error) {
      setPopup({
        show: true,
        message: "Server error",
        type: "error",
      });
    }
  };

  return (
    <div style={styles.container}>
      <SimpleNavbar />

      {/* ✅ POPUP MODAL */}
      {popup.show && (
        <div style={styles.overlay}>
          <div
            style={{
              ...styles.popupCard,
              borderLeft:
                popup.type === "success"
                  ? "5px solid #27ae60"
                  : "5px solid #e74c3c",
            }}
          >
            <h3>{popup.type === "success" ? "Success" : "Error"}</h3>
            <p>{popup.message}</p>

            <button
              style={styles.popupBtn}
              onClick={() =>
                setPopup({ show: false, message: "", type: "" })
              }
            >
              OK
            </button>
          </div>
        </div>
      )}

      <div style={styles.main}>
        <div style={styles.card}>
          <h2>Login</h2>

          <input
            type="text"
            placeholder="Email"
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button style={styles.button} onClick={handleLogin}>
            Login
          </button>

          <p style={styles.text}>
            Don't have an account?{" "}
            <span
              style={styles.link}
              onClick={() => navigate("/register")}
            >
              Register
            </span>
          </p>
        </div>
      </div>

      <SimpleFooter />
    </div>
  );
}

export default Login;

/* 🎨 STYLES */
const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
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
    padding: "30px",
    borderRadius: "10px",
    width: "320px",
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },

  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },

  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#2c3e50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
  },

  text: {
    marginTop: "15px",
    fontSize: "14px",
  },

  link: {
    color: "#2c3e50",
    fontWeight: "bold",
    cursor: "pointer",
  },

  /* ✅ POPUP */
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
    borderRadius: "10px",
    textAlign: "center",
    width: "300px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  },

  popupBtn: {
    marginTop: "15px",
    padding: "8px 20px",
    background: "#2c3e50",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};