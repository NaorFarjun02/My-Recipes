import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, ChevronRight, ChevronLeft } from "lucide-react";
import "./RecipeCook.css";

function RecipeCook({ recipe }) {
  const navigate = useNavigate();
  const [cookStep, setCookStep] = useState(0);
  const totalSteps = recipe.steps.length;

  const prevStep = () => setCookStep((s) => Math.max(0, s - 1));
  const nextStep = () => {
    if (cookStep === totalSteps - 1) {
      navigate(`/recipe/${recipe.id}`);
    } else {
      setCookStep((s) => s + 1);
    }
  };

  return (
    <div className="recipe-cook">
      <div className="recipe-cook-topbar">
        <button className="btn btn-ghost" onClick={() => navigate(`/recipe/${recipe.id}`)}>
          <X size={18} />
          יציאה ממצב בישול
        </button>
        <span className="tag tag-accent">{recipe.name}</span>
      </div>

      <div className="recipe-cook-progress">
        {recipe.steps.map((_, index) => (
          <div
            key={index}
            className={index <= cookStep ? "recipe-cook-bar on" : "recipe-cook-bar"}
          />
        ))}
      </div>

      <div className="card elev-md recipe-cook-card">
        <div className="card-kicker" style={{ fontSize: 12 }}>
          שלב {cookStep + 1} מתוך {totalSteps}
        </div>
        <p className="recipe-cook-text">{recipe.steps[cookStep]}</p>
      </div>

      <div className="recipe-cook-nav">
        <button className="btn btn-secondary recipe-cook-nav-btn" onClick={prevStep}>
          <ChevronRight size={18} />
          השלב הקודם
        </button>
        <button className="btn btn-primary recipe-cook-nav-btn" onClick={nextStep}>
          השלב הבא
          <ChevronLeft size={18} />
        </button>
      </div>

      <div className="recipe-cook-ingredients">
        <h4>מה צריך שיהיה בהישג יד</h4>
        <div className="recipe-cook-ingredients-list">
          {recipe.ingredients.map((ing, index) => (
            <span key={index} className="tag tag-neutral recipe-cook-ingredient">
              {ing}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RecipeCook;
