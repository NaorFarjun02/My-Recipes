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
  const handlePrint = () => {
    // יצירת חלון חדש
    const printWindow = window.open("", "_blank");
    const ingredientsHTML = document.querySelector(
      ".ingredients-section"
    ).outerHTML;
    const stepsHTML = document.querySelector(".steps-section").outerHTML;

    // שליפת כל הסטיילים מהדף הנוכחי
    const styles = [...document.styleSheets]
      .map((styleSheet) => {
        try {
          return [...styleSheet.cssRules].map((rule) => rule.cssText).join("");
        } catch (e) {
          return ""; // אם יש שגיאה בגישה לסטיילים, מחזירים מחרוזת ריקה
        }
      })
      .join("");

    // יצירת תוכן מותאם להדפסה (כולל HTML וסטיילים)
    const contentToPrint = `
      <html>
        <head>
          <title>הדפסת מתכון</title>
          <style>
            ${styles} /* כאן אנחנו מכניסים את כל הסטיילים שמוגדרים במסמך הנוכחי */
            html{
              overflow: scroll;
            }
            body{
              height: 100%;
              width: 100%;
              display:flex;
              flex-direction: column;
            }
            .ingredients-section, .steps-section {
              page-break-before: always; /* התחלה של כל SECTION בעמוד חדש */
            }
            .steps-section {
              page-break-before: always; /* אם רוצים להוסיף כאן גם עמוד חדש לפני שלבי ההכנה */
            }
          </style>
        </head>
        <body>
          ${ingredientsHTML}
          ${stepsHTML}
        </body>
      </html>
    `;

    // הוספת התוכן החדש לחלון
    printWindow.document.write(contentToPrint);

    // הדפסת העמוד
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
  useEffect(() => {
    if (userAnswer === false) return;
    console.log("recipe delete");
    // send delete request to server
  }, [userAnswer]);

  return (
    <div className="container">
      <div className="buttons-container">
        <button
          className="delete-btn-view"
          onClick={() => setShowConfirmDialog(true)}
        >
          מחיקת מתכון
        </button>
        <button className="print-btn" onClick={handlePrint}>
          הדפסת מתכון
        </button>

        <button
          className="edit-btn-view"
          onClick={() => navigate(`/edit-recipe/${recipe.id}`)}
        >
          {" "}
          עריכת מתכון
        </button>
        <button className="home-btn-view" onClick={() => navigate(`/`)}>
          לדף הבית
        </button>
      </div>

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
