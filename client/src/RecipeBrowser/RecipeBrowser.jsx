import React, { useState, useMemo, useEffect } from "react";
import "./RecipeBrowser.css";
import Logo from "../Logo/Logo";
import { useNavigate } from "react-router-dom";
const apiUrl = process.env.REACT_APP_API_URL;

const RecipeBrowser = ({ recipes }) => {
  const [filters, setFilters] = useState(new Set()); // State for multiple filters using Set
  const [filtersOptions, setFiltersOptions] = useState(new Set());//State for all the labels 
  const [sortOption, setSortOption] = useState("default"); // State for sorting
  const [sortOrder, setSortOrder] = useState("asc"); // State for sort order
  const navigate = useNavigate();
  // Function to handle adding/removing filters

  useEffect(() => {
    fetch(`${apiUrl}/get-labels`)
      .then((response) => response.json())
      .then((data) => {
        setFiltersOptions(new Set(data));
      })
      .catch((error) => console.error("Error fetching labels:", error));
    
  }, []);
  const toggleFilter = (filter) => {
    setFilters((prevFilters) => {
      const newFilters = new Set(prevFilters); // Create a new Set based on the previous filters
      if (newFilters.has(filter)) {
        newFilters.delete(filter); // Remove filter if already selected
      } else {
        newFilters.add(filter); // Add filter if not selected
      }
      return newFilters; // Return the updated Set
    });
  };

  // Filter recipes based on multiple selected filters
  const filteredRecipes = useMemo(() => {
    if (filters.size === 0) return recipes; // If no filters are selected, include all recipes

    const filtered = [];
    for (const recipe of recipes) {
      let matchesAll = true; // Assume it matches all filters
      for (const filter of filters) {
        if (!recipe.labels.includes(filter)) {
          matchesAll = false; // Found a filter that doesn't match
          break; // No need to check further
        }
      }
      if (matchesAll) filtered.push(recipe); // Add recipe if it matches all filters
    }
    return filtered; // Return the filtered recipes
  }, [recipes, filters]); // Dependencies for memoization

  // Memoized sorting function to avoid unnecessary re-sorting
  const sortedRecipes = useMemo(() => {
    if (sortOption === "default") return filteredRecipes; // No sorting needed

    const sortFunctions = {
      name: (a, b) => a.name.localeCompare(b.name),
      steps: (a, b) =>
        sortOrder === "asc"
          ? a.steps.length - b.steps.length
          : b.steps.length - a.steps.length,
      ingredients: (a, b) =>
        sortOrder === "asc"
          ? a.ingredients.length - b.ingredients.length
          : b.ingredients.length - a.ingredients.length,
    };

    return [...filteredRecipes].sort(sortFunctions[sortOption]);
  }, [filteredRecipes, sortOption, sortOrder]); // Dependencies for memoization

  return (
    <div className="recipe-browser">
      <div className="browser-controls">
        <div className="add-recipe">
          <Logo />
        </div>

        <div className="filters">
          <button
            className={filters.size === 0 ? "active" : ""}
            onClick={() => setFilters(new Set())} // Clear filters
          >
            הכל
          </button>
          {[...filtersOptions].map((filter) => (
            <button
              key={filter}
              className={filters.has(filter) ? "active" : ""}
              onClick={() => toggleFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="sort-options">
          <select onChange={(e) => setSortOption(e.target.value)}>
            <option value="default">מיין לפי</option>
            <option value="name">שם</option>
            <option value="steps">כמות שלבים</option>
            <option value="ingredients">כמות מצרכים</option>
          </select>
          <select onChange={(e) => setSortOrder(e.target.value)}>
            <option value="asc">מהקטן לגדול</option>
            <option value="desc">מהגדול לקטן</option>
          </select>
        </div>
      </div>
      <div className="recipes-div">
        <div className="recipe-grid">
          {sortedRecipes.map((recipe, index) => (
            <div key={index} className="recipe-card">
              <img
                src={`http://localhost:3001${recipe.firstImageUrl}`}
                alt={recipe.name}
              />
              <h3>{recipe.name}</h3>
              <p>מחבר: {recipe.author}</p>
              <p>{recipe.description}</p>
              <div className="labels">
                {recipe.labels.map((label, index) => (
                  <span key={index} className="label">
                    {label}
                  </span>
                ))}
              </div>
              <button
                className="view-recipe"
                onClick={() => navigate(`/recipe/:${recipe.id}`)}
              >
                צפיה במתכון
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecipeBrowser;





