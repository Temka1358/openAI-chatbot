import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer>
      <div
        style={{
          width: "100%",
          minHeight: "10vh",
          maxHeight: "20vh",
          marginTop: 60,
        }}
      >
        <p style={{ fontSize: "30px", textAlign: "center", padding: "20px" }}>
          Study english with {" "}<a href="https://eigowo.com" target="_blank" rel="noreferrer">Kozmoz</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
