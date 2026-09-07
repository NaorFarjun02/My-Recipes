import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Pencil,
  Printer,
  Trash2,
  ChefHat,
  Check,
  AlertTriangle,
} from "lucide-react";
import "./RecipeView.css";

const apiUrl = process.env.REACT_APP_API_URL;

function RecipeView({ recipe }) {
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [checked, setChecked] = useState(new Set());

  const toggleChecked = (index) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    const ingredientsHTML = document.querySelector(".ingredients-section").outerHTML;
    const stepsHTML = document.querySelector(".steps-section").outerHTML;

    const styles = [...document.styleSheets]
      .map((styleSheet) => {
        try {
          return [...styleSheet.cssRules].map((rule) => rule.cssText).join("");
        } catch (e) {
          return "";
        }
      })
      .join("");

    const contentToPrint = `
      <html>
        <head>
          <title>הדפסת מתכון</title>
          <style>
            ${styles}
            html { overflow: scroll; }
            body { height: 100%; width: 100%; display: flex; flex-direction: column; }
            .ingredients-section, .steps-section { page-break-before: always; }
          </style>
        </head>
        <body>
          ${ingredientsHTML}
          ${stepsHTML}
        </body>
      </html>
    `;

    printWindow.document.write(contentToPrint);
    printWindow.document.close();
    printWindow.print();
  };

  const deleteRecipe = async () => {
    try {
      fetch(`${apiUrl}/delete-recipe/${recipe.id}`, { method: "DELETE" })
        .then((response) => response.json())
        .then((data) => console.log(data));
      navigate(`/`);
    } catch (err) {
      console.error(err.message);
    }
  };

  const authorInitial = recipe.author ? recipe.author.trim()[0] : "";

  return (
    <div className="recipe-view">
      <div className="recipe-view-topbar">
        <button className="btn btn-ghost" onClick={() => navigate("/")}>
          <ArrowRight size={18} />
          חזרה לכל המתכונים
        </button>
        <div className="recipe-view-actions">
          <button className="btn btn-secondary" onClick={() => navigate(`/edit-recipe/${recipe.id}`)}>
            <Pencil size={18} />
            עריכה
          </button>
          <button className="btn btn-secondary" onClick={handlePrint}>
            <Printer size={18} />
            הדפסה
          </button>
          <button
            className="btn btn-secondary recipe-delete-btn"
            onClick={() => setShowConfirmDialog(true)}
          >
            <Trash2 size={18} />
            מחיקה
          </button>
        </div>
      </div>

      <section className="recipe-hero">
        <div>
          <div className="recipe-hero-tags">
            {(recipe.labels || []).filter(Boolean).map((label) => (
              <span key={label} className="tag tag-accent">{label}</span>
            ))}
          </div>
          <h1 className="recipe-hero-title">{recipe.name}</h1>
          <p className="recipe-hero-desc">{recipe.description}</p>
          <div className="recipe-hero-author">
            <div className="recipe-author-avatar">{authorInitial}</div>
            <div>
              <div className="recipe-author-name">{recipe.author}</div>
            </div>
          </div>
          <button
            className="btn btn-primary recipe-cook-btn"
            onClick={() => navigate(`/recipe/${recipe.id}/cook`)}
          >
            <ChefHat size={18} />
            התחלת מצב בישול
          </button>
        </div>
        {recipe.images.length > 0 && (
          <div className="recipe-hero-image-wrap">
            <div className="recipe-hero-blob" />
            <img
              className="washed recipe-hero-image"
              src={`${apiUrl}${recipe.images[0]}`}
              alt={recipe.name}
            />
          </div>
        )}
      </section>

      <section className="recipe-content-grid">
        <div className="card elev-sm ingredients-section recipe-ingredients-card">
          <div className="recipe-ingredients-header">
            <h3 style={{ margin: 0 }}>רשימת מצרכים</h3>
            <span className="tag tag-neutral">
              {checked.size} מתוך {recipe.ingredients.length}
            </span>
          </div>
          <p className="text-muted" style={{ fontSize: 13, margin: 0 }}>
            לחצו על מצרך כדי לסמן שהוא כבר על השיש.
          </p>
          <div className="recipe-ingredients-list">
            {recipe.ingredients.map((text, index) => {
              const done = checked.has(index);
              return (
                <button key={index} className="recipe-ingredient-row" onClick={() => toggleChecked(index)}>
                  {done ? (
                    <span className="recipe-ingredient-check on">
                      <Check size={14} />
                    </span>
                  ) : (
                    <span className="recipe-ingredient-check" />
                  )}
                  <span className={done ? "recipe-ingredient-text done" : "recipe-ingredient-text"}>
                    {text}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="recipe-steps-col">
          <h3 style={{ margin: 0 }}>שלבי ההכנה</h3>
          <div className="steps-section recipe-steps-list">
            {recipe.steps.map((text, index) => (
              <div key={index} className="recipe-step-row">
                <div className="recipe-step-number">{index + 1}</div>
                <div className="card recipe-step-card">
                  <div className="card-kicker">שלב {index + 1}</div>
                  <p style={{ margin: 0, fontSize: 15 }}>{text}</p>
                </div>
              </div>
            ))}
          </div>

          {recipe.images.length > 0 && (
            <div className="card elev-sm recipe-gallery-card">
              <h4 style={{ margin: 0 }}>גלריית המתכון</h4>
              <div className="recipe-gallery-grid">
                {recipe.images.map((image, index) => (
                  <img
                    key={index}
                    className="washed recipe-gallery-image"
                    src={`${apiUrl}${image}`}
                    alt={`תמונת מתכון ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {showConfirmDialog && (
        <div className="dialog-backdrop">
          <div className="dialog">
            <div className="dialog-warning-icon">
              <AlertTriangle size={22} />
            </div>
            <div className="dialog-title">למחוק את המתכון?</div>
            <div className="dialog-body">
              ״{recipe.name}״ יימחק לגמרי, כולל התמונות והשלבים. אין דרך לשחזר.
            </div>
            <div className="dialog-actions">
              <button
                className="btn btn-primary"
                onClick={() => {
                  setShowConfirmDialog(false);
                  deleteRecipe();
                }}
              >
                מחיקה סופית
              </button>
              <button className="btn btn-secondary" onClick={() => setShowConfirmDialog(false)}>
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecipeView;
