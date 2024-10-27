import React from "react";
import "./Logo.css";
import logoImage from "./logo.png"; // ייבוא הלוגו מ-folder src/imgs

function Logo() {
  return (
    <div className="logo-container">
      <img src={logoImage} alt="Website Logo" className="logo-image" />
    </div>
  );
}

export default Logo;
