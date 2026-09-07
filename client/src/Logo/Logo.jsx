import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import logoImage from "./logo.png";
import "./Logo.css";

function Logo() {
  const navigate = useNavigate();

  return (
    <div className="site-header">
      <div className="nav site-header-inner">
        <div
          className="nav-brand site-brand"
          onClick={() => navigate("/")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && navigate("/")}
        >
          <img src={logoImage} alt="לוגו" className="site-brand-logo" />
          <span>מטבח בית</span>
        </div>
        <a href="/" onClick={(e) => { e.preventDefault(); navigate("/"); }}>
          מתכונים
        </a>
        <a href="/new-recipe" onClick={(e) => { e.preventDefault(); navigate("/new-recipe"); }}>
          מתכון חדש
        </a>
        <button className="btn btn-primary" onClick={() => navigate("/new-recipe")}>
          <Plus size={18} />
          הוספת מתכון
        </button>
      </div>
    </div>
  );
}

export default Logo;
