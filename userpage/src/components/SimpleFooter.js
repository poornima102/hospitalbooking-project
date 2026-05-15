import React from "react";

function SimpleFooter() {
  return (
    <div style={styles.footer}>
      <p>© 2026 MediCare. All rights reserved.</p>
    </div>
  );
}

export default SimpleFooter;

const styles = {
  footer: {
    width: "100%",
    backgroundColor: "#2c3e50", // ✅ SAME COLOR
    color: "white",
    textAlign: "center",
    padding: "10px",
  },
};