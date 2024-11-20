import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RecipeView.css"; // Add appropriate styling
const apiUrl = process.env.REACT_APP_API_URL;

function RecipeView({ recipe }) {
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [userAnswer, setUserAnswer] = useState(false);

  const renderIngredients = () =>
    recipe.ingredients.map((item, index) => <li key={index}>{item}</li>);

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
      <img key={index} src={`${apiUrl}${image}`} alt={`תמונה ${index + 1}`} />
    ));

  const deleteRecipe = async () => {
    try {
      fetch(`${apiUrl}/delete-recipe/${recipe.id}`, { method: "DELETE" })
        .then((response) => response.json())
        .then((data) => console.log(data));
    } catch (err) {
      console.error(err.message);
    }
  };
  useEffect(() => {
    if (userAnswer === false) return;
    navigate(`/`)
    console.log("recipe delete");
    // send delete request to server
  }, [userAnswer]);

  return (
    <div className="container">
      <button className="home-btn" onClick={() => navigate(`/`)}>
        לדף הבית
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
      <button className="delete-btn" onClick={() => setShowConfirmDialog(true)}>
        מחיקת מתכון
      </button>

      {showConfirmDialog && (
        <div className="confirm-dialog">
          <h3> ??האם למחוק את המתכון - {recipe.name} </h3>
          <button
            className="confirm-btn"
            onClick={() => {
              setUserAnswer(true);
              setShowConfirmDialog(false);
              deleteRecipe();
            }}
          >
            למחוק
          </button>
          <button
            className="cencel-btn"
            onClick={() => {
              setUserAnswer(false);
              setShowConfirmDialog(false);
            }}
          >
            לא למחוק
          </button>
        </div>
      )}
    </div>
  );
}

export default RecipeView;
