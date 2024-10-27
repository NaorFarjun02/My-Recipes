import React from "react";
import { useNavigate } from "react-router-dom";
import "./RecipeView.css"; // Add appropriate styling

function RecipeView({ recipe }) {
  const navigate = useNavigate();

  const renderIngredients = () =>
    recipe.ingredients.map((item, index) => (
      <li key={index}>{item}</li>
    ));

  const renderSteps = () =>
    Object.entries(recipe.steps).map(([key, item], index) => (
      <li key={index} id={item.id}>
        <h3>:שלב {index + 1}</h3>
        <span>{item}</span>
      </li>
    ));

  const renderLabels = () =>
    recipe.labels.map((label, index) => (
      <span key={index} className="label">
        {label}
      </span>
    ));

  const renderImages = () =>
    recipe.images.map((image, index) => (
      <img key={index} src={image} alt={`תמונה ${index + 1}`} />
    ));

  return (
    <div className="container">
      <button className="home-btn" onClick={() => navigate(`/`)}>
        Home
      </button>

      <div className="ingredients-section">
        <h2>רשימת מצרכים</h2>
        <ul className="ingredients-div">{renderIngredients()}</ul>
      </div>

      <div className="steps-section">
        <h2>שלבי הכנה</h2>
        <ul className="steps-div">{renderSteps()}</ul>
      </div>

      <div className="info-section">
        <div className="recipe-info">
          <h2>{recipe.name}</h2>
          <p>נכתב על ידי: {recipe.author}</p>
          <div className="labels">{renderLabels()}</div>
        </div>

        <div className="image-gallery">{renderImages()}</div>
      </div>
    </div>
  );
}

export default RecipeView;
