import React, { useState, useCallback, useMemo } from "react";
import "./NewRecipe.css";

function NewRecipe({ onSubmit }) {
  const [images, setImages] = useState([]);
  const [recipe, setRecipe] = useState({
    name: "",
    author: "",
    description: "",
    ingredients: [""],
    steps: [""],
    labels: [""],
    images: [],
  }); //a json that contain the data the user enter

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setRecipe((prevRecipe) => ({ ...prevRecipe, [name]: value }));
  }, []);

  const handleArrayChange = useCallback((e, index, field) => {
    const { value } = e.target;
    setRecipe((prevRecipe) => {
      const updatedField = [...prevRecipe[field]];
      updatedField[index] = value;
      return { ...prevRecipe, [field]: updatedField };
    });
  }, []);

  const addField = useCallback((field) => {
    setRecipe((prevRecipe) => ({
      ...prevRecipe,
      [field]: [...prevRecipe[field], ""],
    }));
  }, []);

  const removeField = useCallback((index, field) => {
    setRecipe((prevRecipe) => {
      const updatedField = prevRecipe[field].filter((_, i) => i !== index);
      return { ...prevRecipe, [field]: updatedField };
    });
  }, []);

  const renderArrayFields = useMemo(
    () => (field, title) =>
      (
        <div className={`${field}-section-new`}>
          <h3>:{title}</h3>
          {recipe[field].map((item, index) => (
            <div key={index} className={`${field}-item`}>
              <input
                type="text"
                value={item}
                onChange={(e) => handleArrayChange(e, index, field)}
                required
              />
              <button
                type="button"
                className={`remove-${field}-field-btn`}
                onClick={() => removeField(index, field)}
              >
                הסר
              </button>
            </div>
          ))}
          <button
            type="button"
            className={`add-${field}-btn`}
            onClick={() => addField(field)}
          >
            הוסף {title}
          </button>
        </div>
      ),
    [recipe, handleArrayChange, removeField, addField]
  );

  const handleImageChange = (e) => {
    setImages([...e.target.files]); // Store all selected files
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setRecipe({
      name: "מרק ירקות עשיר",
      author: "מירב כהן",
      description: "מרק ירקות עשיר ומזין עם הרבה ירקות ותיבול מיוחד.",
      labels: ["בישול", "צמחוני", "מרקים"],
      ingredients: [
        "4 תפוחי אדמה",
        "2 גזרים",
        "2 בצלים",
        "1 קישוא",
        "1 בטטה",
        "4 כפות שמן זית",
        "2 כפות מלח",
        "1 כף פלפל שחור",
        "1 כף כמון",
        "3 עלי דפנה",
        "1/2 כף כורכום",
        "2 ליטר מים",
        "4 שיני שום קצוצות",
        "1/2 כף פפריקה מתוקה",
        "כף אבקת מרק ירקות",
      ],
      steps: [
        "לקל peel ולחתוך את כל הירקות לקוביות.",
        "לחמם שמן זית בסיר גדול ולהוסיף את הבצל והשום.",
        "לטגן עד שהבצל הופך לשקוף.",
        "להוסיף את שאר הירקות ולערבב למשך 5 דקות.",
        "להוסיף את התבלינים ולערבב היטב.",
        "להוסיף את המים ולערבב.",
        "להביא לרתיחה ולהוריד את האש לבישול איטי.",
        "לבשל במשך 40 דקות עד שהירקות מתרככים.",
        "להוציא את עלי הדפנה ולהוסיף מלח לפי הטעם.",
        "להגיש את המרק חם עם מעט שמן זית מעל.",
      ],
    });
    const recipeFormData = new FormData(); // the data that send to server
    recipeFormData.append("name", recipe.name);
    recipeFormData.append("author", recipe.author);
    recipeFormData.append("description", recipe.description);
    recipeFormData.append("ingredients", JSON.stringify(recipe.ingredients));
    recipeFormData.append("steps", JSON.stringify(recipe.steps));
    recipeFormData.append("labels", JSON.stringify(recipe.labels));

    // Append each image to the form data
    images.forEach((image) => {
      recipeFormData.append("images", image);
    });

    onSubmit(recipeFormData);
  };

  return (
    <form className="recipe-form" onSubmit={handleSubmit}>
      <h2>הוספת מתכון חדש</h2>
      <div className="name-section">
        <label>:שם המתכון</label>
        <input
          type="text"
          name="name"
          value={recipe.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="author-section">
        <label>:מחבר המתכון</label>
        <input
          type="text"
          name="author"
          value={recipe.author}
          onChange={handleChange}
          required
        />
      </div>
      <div className="description-section">
        <label>:תיאור</label>
        <textarea
          name="description"
          value={recipe.description}
          onChange={handleChange}
          rows="4"
          required
        />
      </div>
      <div className="image-upload-section">
        <label>:העלה תמונות</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>
      {renderArrayFields("ingredients", "מצרכים")}
      {renderArrayFields("labels", "תגיות")}
      {renderArrayFields("steps", "שלבי הכנה")}

      <button type="submit" className="submit-btn">
        שמור מתכון
      </button>
    </form>
  );
}

export default NewRecipe;
