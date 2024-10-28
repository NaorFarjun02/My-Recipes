import React from "react";
import "./Logo.css";
import logoImage from "./logo.png"; // ייבוא הלוגו מ-folder src/imgs
import { useNavigate } from "react-router-dom";

function Logo() {
  const navigate = useNavigate();
  return (
    <div className="logo-container">
      <img
        src={logoImage}
        alt="Website Logo"
        className="logo-image"
        onClick={() => navigate("/new-recipe")}
      />
    </div>
  );
}

export default Logo;
