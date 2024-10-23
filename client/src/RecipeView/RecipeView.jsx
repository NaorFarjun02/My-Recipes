import React from "react";
import "./RecipeView.css"; // Add appropriate styling

function RecipeView({ recipe }) {
  return (
    <div className="container">
      {/* Left Side - Ingredients */}
      <div className="ingredients-section">
        <h2>רשימת מצרכים</h2>
        <div className="ingredients-div">
          <ul>
            {recipe.ingredients.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Middle Side - Steps */}
      <div className="steps-section">
        <h2>שלבי הכנה</h2>
        <div className="steps-div">
          <ul>
            {Object.entries(recipe.steps).map(([key, item], index) => (
              <li key={index} id={item.id}>
                <h3>:שלב {key}</h3>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Side - Info and Image Gallery */}
      <div className="info-section">
        <div className="recipe-info">
          <h2>{recipe.name}</h2>
          <p>נכתב על ידי: {recipe.author}</p>
          <div className="labels">
            {recipe.labels.map((label, index) => (
              <span key={index} className="label">
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="image-gallery">
          {recipe.images.map((image, index) => (
            <img key={index} src={image} alt={`תמונה ${index + 1}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default RecipeView;
