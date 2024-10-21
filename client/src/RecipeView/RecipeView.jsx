import React from "react";
// import { useParams } from "react-router-dom"; // Hook to access route parameters
import "./RecipeView.css"; // Add appropriate styling

function RecipeView({ recipe }) {
  // const { id } = useParams(); // Get recipe ID from the route
  // const recipe = recipes.find((r) => r.id === parseInt(id)); // Find the recipe by ID
  // console.log(id)
  // if (!recipe) {
  //   return <div>מתכון לא נמצא</div>;
  // }

  return (
    <div className="container">
      {/* Left Side - Ingredients */}
      <div className="ingredients-section">
        <h2>רשימת מצרכים</h2>
        <ul>
          {recipe.ingredients.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Middle Side - Steps */}
      <div className="steps-section">
        <h2>שלבי הכנה</h2>
        <ol>
          {recipe.steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
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
