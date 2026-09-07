import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ArrowUpDown,
  Check,
  Heart,
  ListOrdered,
  ShoppingBasket,
  BookOpen,
  ChefHat,
} from "lucide-react";
import "./RecipeBrowser.css";

const apiUrl = process.env.REACT_APP_API_URL;
const FAVORITES_KEY = "myrecipes:favorites";

const SORTS = [
  { key: "default", label: "ברירת מחדל" },
  { key: "name", label: "לפי שם" },
  { key: "steps", label: "לפי מספר שלבים" },
  { key: "ingredients", label: "לפי מספר מצרכים" },
];

function loadFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

const RecipeBrowser = () => {
  const [recipes, setRecipes] = useState([]);
  const [labelOptions, setLabelOptions] = useState([]);
  const [filters, setFilters] = useState(new Set());
  const [search, setSearch] = useState("");
  const [sortIndex, setSortIndex] = useState(0);
  const [favorites, setFavorites] = useState(loadFavorites);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${apiUrl}/get-labels`)
      .then((response) => response.json())
      .then((data) => setLabelOptions(data))
      .catch((error) => console.error("Error fetching labels:", error));

    fetch(`${apiUrl}/get-recipes`)
      .then((response) => response.json())
      .then((data) => setRecipes(data))
      .catch((error) => console.error("Error fetching recipes:", error));
  }, []);

  const toggleFilter = (label) => {
    setFilters((prev) => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([...next]));
      return next;
    });
  };

  const query = search.trim();

  const visibleRecipes = useMemo(() => {
    let list = recipes.filter((r) =>
      [...filters].every((f) => (r.labels || []).includes(f))
    );
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((r) =>
        [r.name, r.author, r.description, ...(r.labels || [])]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }
    const sort = SORTS[sortIndex];
    if (sort.key === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name, "he"));
    if (sort.key === "steps") list = [...list].sort((a, b) => a.steps.length - b.steps.length);
    if (sort.key === "ingredients")
      list = [...list].sort((a, b) => a.ingredients.length - b.ingredients.length);
    return list;
  }, [recipes, filters, query, sortIndex]);

  const heroRecipe = useMemo(() => {
    if (recipes.length === 0) return null;
    return [...recipes].sort((a, b) => b.id - a.id)[0];
  }, [recipes]);

  const heroOn = Boolean(heroRecipe) && filters.size === 0 && !query;

  return (
    <div className="recipe-browser">
      {heroOn && (
        <section className="hero-section">
          <div>
            <span className="tag tag-accent-2" style={{ marginBottom: "var(--space-3)" }}>
              המתכון של השבוע
            </span>
            <h1 className="hero-title">{heroRecipe.name}</h1>
            <p className="hero-desc">{heroRecipe.description}</p>
            <div className="hero-actions">
              <button
                className="btn btn-primary hero-btn"
                onClick={() => navigate(`/recipe/${heroRecipe.id}`)}
              >
                <BookOpen size={18} />
                לפתיחת המתכון
              </button>
              <button
                className="btn btn-secondary hero-btn"
                onClick={() => navigate(`/recipe/${heroRecipe.id}/cook`)}
              >
                <ChefHat size={18} />
                מצב בישול
              </button>
            </div>
            <div className="hero-stats">
              <div>
                <div className="hero-stat-num">{heroRecipe.ingredients.length}</div>
                <div className="text-muted hero-stat-label">מצרכים</div>
              </div>
              <div>
                <div className="hero-stat-num">{heroRecipe.steps.length}</div>
                <div className="text-muted hero-stat-label">שלבים</div>
              </div>
            </div>
          </div>
          <div className="hero-image-wrap">
            <div className="hero-blob hero-blob-2" />
            <div className="hero-blob hero-blob-1" />
            {heroRecipe.firstImageUrl ? (
              <img
                className="washed hero-image"
                src={`${apiUrl}${heroRecipe.firstImageUrl}`}
                alt={heroRecipe.name}
              />
            ) : (
              <div className="hero-image hero-image-placeholder" />
            )}
          </div>
        </section>
      )}

      <section className="toolbar-section">
        <div className="search-field">
          <label className="text-muted search-label">חיפוש מתכון, מחבר או תגית</label>
          <div className="search-input-wrap">
            <input
              className="input search-input"
              type="search"
              placeholder="למשל: שקשוקה, מירב, קינוחים…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search size={18} className="search-icon" />
          </div>
        </div>
        <div className="sort-field">
          <span className="text-muted" style={{ fontSize: 12 }}>מיון:</span>
          <button
            className="btn btn-secondary"
            onClick={() => setSortIndex((i) => (i + 1) % SORTS.length)}
          >
            <ArrowUpDown size={18} />
            {SORTS[sortIndex].label}
          </button>
        </div>
      </section>

      <section className="chips-section">
        <button
          className={`btn ${filters.size === 0 ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setFilters(new Set())}
        >
          הכל
        </button>
        {labelOptions.map((label) => {
          const on = filters.has(label);
          return (
            <button
              key={label}
              className={`btn ${on ? "btn-primary" : "btn-secondary"}`}
              onClick={() => toggleFilter(label)}
            >
              {on && <Check size={18} />}
              {label}
            </button>
          );
        })}
      </section>

      <section className="result-header">
        <h2 style={{ margin: 0 }}>
          {filters.size || query ? "תוצאות החיפוש" : "כל המתכונים"}
        </h2>
        <span className="text-muted" style={{ fontSize: 13 }}>
          {visibleRecipes.length} מתכונים
        </span>
      </section>

      <section className="recipe-grid">
        {visibleRecipes.map((recipe) => {
          const isFav = favorites.has(recipe.id);
          return (
            <article key={recipe.id} className="card elev-sm recipe-card">
              <div className="recipe-card-image-wrap">
                {recipe.firstImageUrl ? (
                  <img
                    className="washed recipe-card-image"
                    src={`${apiUrl}${recipe.firstImageUrl}`}
                    alt={recipe.name}
                  />
                ) : (
                  <div className="recipe-card-image recipe-card-image-placeholder" />
                )}
                <button
                  className="btn btn-icon recipe-fav-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(recipe.id);
                  }}
                  aria-label={isFav ? "הסרה ממועדפים" : "הוספה למועדפים"}
                >
                  <Heart
                    size={18}
                    color={isFav ? "var(--color-accent-600)" : "var(--color-neutral-700)"}
                    fill={isFav ? "currentColor" : "none"}
                  />
                </button>
              </div>
              <div className="recipe-card-body">
                <div className="card-kicker">{recipe.author}</div>
                <h3 className="card-title" style={{ fontSize: 21 }}>{recipe.name}</h3>
                <p className="card-body" style={{ fontSize: 14, opacity: 0.75 }}>
                  {recipe.description}
                </p>
                <div className="recipe-card-tags">
                  {(recipe.labels || []).filter(Boolean).map((label) => (
                    <span key={label} className="tag tag-accent-2">{label}</span>
                  ))}
                </div>
                <div className="recipe-card-stats">
                  <span>
                    <ListOrdered size={15} />
                    {recipe.steps.length} שלבים
                  </span>
                  <span>
                    <ShoppingBasket size={15} />
                    {recipe.ingredients.length} מצרכים
                  </span>
                </div>
                <button
                  className="btn btn-primary btn-block"
                  onClick={() => navigate(`/recipe/${recipe.id}`)}
                >
                  צפייה במתכון
                </button>
              </div>
            </article>
          );
        })}
      </section>

      {visibleRecipes.length === 0 && (
        <div className="empty-state">
          <h3>לא מצאנו מתכון כזה</h3>
          <p className="text-muted">נסו מילה אחרת או נקו את הסינון.</p>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setFilters(new Set());
              setSearch("");
            }}
          >
            ניקוי סינון
          </button>
        </div>
      )}
    </div>
  );
};

export default RecipeBrowser;
