import React, { useState, useMemo, useEffect } from "react";
import "./RecipeBrowser.css";
import Logo from "../Logo/Logo";
import { useNavigate } from "react-router-dom";
const apiUrl = process.env.REACT_APP_API_URL;

const RecipeBrowser = () => {
  const [recipes, setRecipes] = useState([]);
  const [filters, setFilters] = useState(new Set()); // State for multiple filters using Set
  const [filtersOptions, setFiltersOptions] = useState(new Set()); //State for all the labels
  const [sortOption, setSortOption] = useState("default"); // State for sorting
  const [sortOrder, setSortOrder] = useState("asc"); // State for sort order
  const navigate = useNavigate();
  // Function to handle adding/removing filters

  const getData = async () => {
    fetch(`${apiUrl}/get-labels`) //get the labels to set the filters
      .then((response) => response.json())
      .then((data) => {
        setFiltersOptions(new Set(data));
      })
      .catch((error) => console.error("Error fetching labels:", error));

    fetch(`${apiUrl}/get-recipes`) //get the recipe to display them
      .then((response) => response.json())
      .then((data) => {
        setRecipes(data);
      })
      .catch((error) => console.error("Error fetching recipes:", error));
  };

  useEffect(() => {
    getData();
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
  <div className="container-fluid py-4">
    {/* Header עם לוגו */}
    <div className="row mb-4">
      <div className="col-12">
        <div className="card shadow-lg border-0" style={{background: 'linear-gradient(45deg, #ff6b6b, #ffa500)'}}>
          <div className="card-body text-center text-white">
            <Logo />
            <h1 className="display-4 fw-bold">ברוכים הבאים לאתר המתכונים</h1>
            <p className="lead">גלו מתכונים טעימים ומגוונים</p>
          </div>
        </div>
      </div>
    </div>

    {/* פילטרים וסינון */}
    <div className="row mb-4">
      <div className="col-12">
        <div className="card shadow-sm">
          <div className="card-body">
            <div className="row align-items-center">
              {/* פילטרים */}
              <div className="col-lg-8 col-md-12 mb-3 mb-lg-0">
                <h5 className="card-title mb-3">
                  <i className="bi bi-funnel-fill me-2"></i>
                  סינון מתכונים
                </h5>
                <div className="d-flex flex-wrap gap-2">
                  <button
                    className={`btn ${filters.size === 0 ? 'btn-primary' : 'btn-outline-primary'} rounded-pill`}
                    onClick={() => setFilters(new Set())}
                  >
                    <i className="bi bi-grid-3x3-gap me-1"></i>
                    הכל
                  </button>
                  {[...filtersOptions].map((filter) => (
                    <button
                      key={filter}
                      className={`btn ${filters.has(filter) ? 'btn-success' : 'btn-outline-success'} rounded-pill`}
                      onClick={() => toggleFilter(filter)}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* מיון */}
              <div className="col-lg-4 col-md-12">
                <h6 className="mb-2">
                  <i className="bi bi-sort-down me-2"></i>
                  מיון
                </h6>
                <div className="row g-2">
                  <div className="col-6">
                    <select 
                      className="form-select form-select-sm" 
                      onChange={(e) => setSortOption(e.target.value)}
                    >
                      <option value="default">מיין לפי</option>
                      <option value="name">שם</option>
                      <option value="steps">כמות שלבים</option>
                      <option value="ingredients">כמות מצרכים</option>
                    </select>
                  </div>
                  <div className="col-6">
                    <select 
                      className="form-select form-select-sm" 
                      onChange={(e) => setSortOrder(e.target.value)}
                    >
                      <option value="asc">עולה</option>
                      <option value="desc">יורד</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* רשת המתכונים */}
    <div className="row">
      {sortedRecipes.map((recipe, index) => (
        <div key={index} className="col-xl-3 col-lg-4 col-md-6 col-sm-12 mb-4">
          <div className="card h-100 shadow-sm border-0 recipe-card">
            <div className="position-relative">
              <img
                src={`${apiUrl}${recipe.firstImageUrl}`}
                className="card-img-top"
                alt={recipe.name}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <div className="position-absolute top-0 start-0 p-2">
                <span className="badge bg-warning text-dark">
                  <i className="bi bi-star-fill me-1"></i>
                  חדש
                </span>
              </div>
            </div>
            
            <div className="card-body d-flex flex-column">
              <h5 className="card-title text-primary fw-bold">{recipe.name}</h5>
              <h6 className="text-muted mb-2">
                <i className="bi bi-person-fill me-1"></i>
                {recipe.author}
              </h6>
              <p className="card-text text-muted flex-grow-1">{recipe.description}</p>
              
              {/* תגיות */}
              <div className="mb-3">
                {recipe.labels.slice(0, 3).map((label, idx) => (
                  <span key={idx} className="badge bg-success me-1 mb-1 rounded-pill">
                    {label}
                  </span>
                ))}
                {recipe.labels.length > 3 && (
                  <span className="badge bg-secondary rounded-pill">+{recipe.labels.length - 3}</span>
                )}
              </div>
              
              {/* פרטי המתכון */}
              <div className="row text-center mb-3">
                <div className="col-6">
                  <small className="text-muted">
                    <i className="bi bi-list-ol me-1"></i>
                    {Array.isArray(recipe.steps) ? recipe.steps.length : Object.keys(recipe.steps).length} שלבים
                  </small>
                </div>
                <div className="col-6">
                  <small className="text-muted">
                    <i className="bi bi-basket me-1"></i>
                    {recipe.ingredients.length} מצרכים
                  </small>
                </div>
              </div>
              
              <button
                className="btn btn-primary w-100 mt-auto"
                onClick={() => {
                  console.log(recipe);
                  navigate(`/recipe/${recipe.id}`);
                }}
              >
                <i className="bi bi-eye me-2"></i>
                צפיה במתכון
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
};

export default RecipeBrowser;
