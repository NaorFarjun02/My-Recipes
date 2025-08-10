import React from "react";
import logoImage from "./logo.png";
import { useNavigate } from "react-router-dom";

function Logo() {
  const navigate = useNavigate();
  return (
    <div className="text-center p-3">
      <img
        src={logoImage}
        alt="Website Logo"
        className="img-fluid rounded-circle shadow-lg"
        style={{ 
          width: '80px', 
          height: '80px', 
          objectFit: 'cover',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        onClick={() => navigate("/new-recipe")}
        onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
      />
    </div>
  );
}

export default Logo;