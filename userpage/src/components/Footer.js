import React from "react";

function Footer() {
  return (
    <footer style={styles.footer}>
      <div>
        <h3>About</h3>
        <p>Online hospital booking system for easy doctor appointments.</p>
      </div>

      <div>
        <h3>Contact</h3>
        <p>Email: support@docbook.com</p>
        <p>Phone: +91 9876543210</p>
      </div>

      <div>
        <h3>Follow Us</h3>
        <p><a href="/#" style={styles.link}>Instagram</a></p>
        <p><a href="/#" style={styles.link}>Facebook</a></p>
      </div>
    </footer>
  );
}

export default Footer;

const styles = {
  footer: {
    backgroundColor: "#2c3e50",
    color: "white",
    padding: "20px",
    display: "flex",
    justifyContent: "space-around",
  },

  link: {
    color: "#ecf0f1",
    textDecoration: "none",
  },
};