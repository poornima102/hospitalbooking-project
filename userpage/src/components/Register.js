import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SimpleNavbar from "./SimpleNavbar";
import SimpleFooter from "./SimpleFooter";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        dob: "",
        gender: "",
        address: "",
        phone: "",
        password: "",
        confirmPassword: ""
    });

    const [errors, setErrors] = useState({});

    const [popup, setPopup] = useState({
        show: false,
        message: "",
        type: ""
    });

    // ================= HANDLE CHANGE =================
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // ================= POPUP =================
    const showPopup = (message, type) => {
        setPopup({ show: true, message, type });

        setTimeout(() => {
            setPopup({ show: false, message: "", type: "" });
        }, 2500);
    };

    // ================= VALIDATION =================
    const validate = () => {
        let newErrors = {};

        if (!formData.name) newErrors.name = "Full name is required";

        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }

        if (!formData.dob) newErrors.dob = "Date of birth is required";
        if (!formData.gender) newErrors.gender = "Select gender";
        if (!formData.address) newErrors.address = "Address is required";

        if (!formData.phone) {
            newErrors.phone = "Phone required";
        } else if (!/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = "Must be exactly 10 digits";
        }

        if (!formData.password) {
            newErrors.password = "Password required";
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        return newErrors;
    };

    // ================= SUBMIT =================
    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) return;

        console.log("Sending data:", formData);

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/signup/",
                {
                    name: formData.name,
                    email: formData.email,
                    dob: formData.dob,
                    gender: formData.gender,
                    address: formData.address,
                    phone: formData.phone,
                    password: formData.password
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            console.log("Success:", response.data);

            showPopup("Account created successfully 🎉", "success");

            setTimeout(() => {
                navigate("/login");
            }, 2000);

        } catch (error) {
            console.log("Error:", error.response?.data);

            showPopup(
                error.response?.data?.message || "Signup failed ❌",
                "error"
            );
        }
    };

    return (
        <div style={styles.container}>
            <SimpleNavbar />

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
                            {popup.type === "success" ? "Success 🎉" : "Error ❌"}
                        </h3>
                        <p style={{ marginTop: "10px", color: "#555" }}>
                            {popup.message}
                        </p>
                    </div>
                </div>
            )}

            {/* ================= FORM ================= */}
            <form style={styles.card} onSubmit={handleSubmit}>
                <h2 style={styles.title}>Create Account</h2>

                <div style={styles.row}>
                    <div style={styles.inputGroup}>
                        <label>Full Name</label>
                        <input name="name" onChange={handleChange} style={styles.input} />
                        {errors.name && <span style={styles.error}>{errors.name}</span>}
                    </div>

                    <div style={styles.inputGroup}>
                        <label>Email</label>
                        <input name="email" onChange={handleChange} style={styles.input} />
                        {errors.email && <span style={styles.error}>{errors.email}</span>}
                    </div>
                </div>

                <div style={styles.row}>
                    <div style={styles.inputGroup}>
                        <label>DOB</label>
                        <input type="date" name="dob" onChange={handleChange} style={styles.input} />
                        {errors.dob && <span style={styles.error}>{errors.dob}</span>}
                    </div>

                    <div style={styles.inputGroup}>
                        <label>Gender</label>
                        <select name="gender" onChange={handleChange} style={styles.input}>
                            <option value="">Select</option>
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                        </select>
                        {errors.gender && <span style={styles.error}>{errors.gender}</span>}
                    </div>
                </div>

                <div style={styles.inputGroup}>
                    <label>Address</label>
                    <textarea name="address" onChange={handleChange} style={styles.input} />
                    {errors.address && <span style={styles.error}>{errors.address}</span>}
                </div>

                {/* ✅ FIXED PHONE INPUT */}
                <div style={styles.inputGroup}>
                    <label>Phone</label>
                    <input
                        name="phone"
                        value={formData.phone}
                        placeholder="Enter 10-digit number"
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                            setFormData({
                                ...formData,
                                phone: value
                            });
                        }}
                        style={styles.input}
                    />
                    {errors.phone && <span style={styles.error}>{errors.phone}</span>}
                </div>

                <div style={styles.row}>
                    <div style={styles.inputGroup}>
                        <label>Password</label>
                        <input type="password" name="password" onChange={handleChange} style={styles.input} />
                        {errors.password && <span style={styles.error}>{errors.password}</span>}
                    </div>

                    <div style={styles.inputGroup}>
                        <label>Confirm Password</label>
                        <input type="password" name="confirmPassword" onChange={handleChange} style={styles.input} />
                        {errors.confirmPassword && (
                            <span style={styles.error}>{errors.confirmPassword}</span>
                        )}
                    </div>
                </div>

                <button type="submit" style={styles.button}>
                    Sign Up
                </button>
            </form>

            <SimpleFooter />
        </div>
    );
}

export default Register;
/* ================= STYLES ================= */
const styles = {
    container: {
        minHeight: "100vh",
        backgroundColor: "#f4f6f9",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },

    card: {
        width: "500px",
        background: "#fff",
        padding: "25px",
        borderRadius: "10px",
        boxShadow: "0 5px 12px rgba(0,0,0,0.1)",
        margin: "20px 0"
    },

    title: { textAlign: "center", marginBottom: "20px" },

    row: { display: "flex", gap: "10px" },

    inputGroup: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        marginBottom: "15px"
    },

    input: {
        padding: "10px",
        borderRadius: "5px",
        border: "1px solid #ccc",
        marginTop: "5px"
    },

    error: {
        color: "red",
        fontSize: "12px",
        marginTop: "3px"
    },

    button: {
        width: "100%",
        padding: "12px",
        backgroundColor: "#2c3e50",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer"
    },

    /* POPUP */
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
        padding: "25px 30px",
        borderRadius: "10px",
        textAlign: "center",
        minWidth: "320px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    },
};