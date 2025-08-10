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
  <div className="container-fluid py-4">
    {/* כפתורי ניווט */}
    <div className="row mb-4">
      <div className="col-12">
        <div className="d-flex justify-content-between flex-wrap gap-2">
          <div className="btn-group" role="group">
            <button className="btn btn-outline-primary" onClick={() => navigate('/')}>
              <i className="bi bi-house-fill me-2"></i>
              דף הבית
            </button>
            <button className="btn btn-outline-warning" onClick={() => navigate(`/edit-recipe/${recipe.id}`)}>
              <i className="bi bi-pencil-square me-2"></i>
              עריכה
            </button>
          </div>
          
          <div className="btn-group" role="group">
            <button className="btn btn-outline-info" onClick={handlePrint}>
              <i className="bi bi-printer me-2"></i>
              הדפסה
            </button>
            <button className="btn btn-outline-danger" onClick={() => setShowConfirmDialog(true)}>
              <i className="bi bi-trash me-2"></i>
              מחיקה
            </button>
          </div>
        </div>
      </div>
    </div>

    <div className="row">
      {/* פרטי המתכון */}
      <div className="col-lg-4 col-md-12 mb-4">
        <div className="card shadow border-0 h-100">
          <div className="card-header bg-primary text-white text-center">
            <h2 className="card-title mb-0">{recipe.name}</h2>
            <p className="mb-0">
              <i className="bi bi-person-fill me-2"></i>
              {recipe.author}
            </p>
          </div>
          
          <div className="card-body">
            <p className="card-text text-muted mb-4">{recipe.description}</p>
            
            {/* תגיות */}
            <div className="mb-4">
              <h6 className="text-muted mb-2">תגיות:</h6>
              <div className="d-flex flex-wrap gap-1">
                {recipe.labels.map((label, index) => (
                  <span key={index} className="badge bg-success rounded-pill">
                    {label}
                  </span>
                ))}
              </div>
            </div>
            
            {/* גלריית תמונות */}
            <div className="image-gallery">
              <h6 className="text-muted mb-3">תמונות:</h6>
              <div className="row g-2">
                {recipe.images.map((image, index) => (
                  <div key={index} className="col-6">
                    <img
                      src={`${apiUrl}${image}`}
                      className="img-fluid rounded shadow-sm"
                      alt={`תמונה ${index + 1}`}
                      style={{ height: '120px', width: '100%', objectFit: 'cover' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* מצרכים */}
      <div className="col-lg-4 col-md-6 mb-4">
        <div className="card shadow border-0 h-100 ingredients-section">
          <div className="card-header bg-success text-white">
            <h3 className="card-title mb-0">
              <i className="bi bi-basket me-2"></i>
              רשימת מצרכים
            </h3>
          </div>
          <div className="card-body" style={{ maxHeight: '500px', overflowY: 'auto' }}>
            <ul className="list-group list-group-flush">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="list-group-item border-0 py-2">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* שלבי הכנה */}
      <div className="col-lg-4 col-md-6 mb-4">
        <div className="card shadow border-0 h-100 steps-section">
          <div className="card-header bg-warning text-dark">
            <h3 className="card-title mb-0">
              <i className="bi bi-list-ol me-2"></i>
              שלבי הכנה
            </h3>
          </div>
          <div className="card-body" style={{ maxHeight: '500px', overflowY: 'auto' }}>
            <div className="steps-list">
              {Object.entries(recipe.steps).map(([key, step], index) => (
                <div key={index} className="step-item mb-3 p-3 bg-light rounded">
                  <div className="d-flex align-items-center mb-2">
                    <span className="badge bg-warning text-dark rounded-circle me-2" style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {index + 1}
                    </span>
                    <h5 className="mb-0">שלב {index + 1}</h5>
                  </div>
                  <p className="mb-0 pe-4">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* דיאלוג מחיקה */}
    {showConfirmDialog && (
      <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-danger text-white">
              <h5 className="modal-title">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                אישור מחיקה
              </h5>
            </div>
            <div className="modal-body text-center">
              <h5>האם אתה בטוח שברצונך למחוק את המתכון:</h5>
              <p className="text-primary fw-bold fs-4">"{recipe.name}"</p>
              <div className="alert alert-warning">
                <i className="bi bi-info-circle-fill me-2"></i>
                פעולה זו אינה ניתנת לביטול!
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-success"
                onClick={() => {
                  setShowConfirmDialog(false);
                  setUserAnswer(false);
                }}
              >
                <i className="bi bi-x-circle me-2"></i>
                ביטול
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  setUserAnswer(true);
                  setShowConfirmDialog(false);
                  deleteRecipe();
                }}
              >
                <i className="bi bi-trash me-2"></i>
                מחק סופית
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
);
}

export default RecipeView;
