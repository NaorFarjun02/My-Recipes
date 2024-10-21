import React, { useState } from "react";
import "./RecipeBrowser.css";

const RecipeBrowser = ({ recipes }) => {
  const [filter, setFilter] = useState("all"); // State for filtering
  const [sortOption, setSortOption] = useState("default"); // State for sorting

  // Function to handle filtering
  const filteredRecipes = recipes.filter((recipe) =>
    filter === "all" ? true : recipe.category === filter
  );

  // Function to handle sorting
  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    if (sortOption === "name") {
      return a.name.localeCompare(b.name);
    }
    // Default sorting
    return 0;
  });

  return (
    <div className="recipe-browser">
      <div className="browser-controls">
        <h2>המתכונים שלי</h2>
        <div className="filters">
          <button onClick={() => setFilter("all")}>הכל</button>
          <button onClick={() => setFilter("בישול")}>בישול</button>
          <button onClick={() => setFilter("אפייה")}>אפייה</button>
          <button onClick={() => setFilter("צלייה")}>צלייה</button>
        </div>
        <div className="sort-options">
          <label> מיין לפי:</label>
          <select onChange={(e) => setSortOption(e.target.value)}>
            <option value="default">ברירת מחדל</option>
            <option value="name">שם</option>
          </select>
        </div>
      </div>

      <div className="recipe-grid">
        {sortedRecipes.map((recipe, index) => (
          <div key={index} className="recipe-card">
            <img src={recipe.image} alt={recipe.name} />
            <h3>{recipe.name}</h3>
            <p>{recipe.description}</p>
            <div className="labels">
              {recipe.labels.map((label, index) => (
                <span key={index} className="label">
                  {label}
                </span>
              ))}
            </div>
            <button className="view-recipe">צפיה במתכון</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeBrowser;
