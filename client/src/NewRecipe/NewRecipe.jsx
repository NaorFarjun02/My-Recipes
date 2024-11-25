import React, { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import "./NewRecipe.css";

function NewRecipe() {
  const navigate = useNavigate();

  const [images, setImages] = useState([]);
  const [imagesUrls, setImagesUrls] = useState([]);
  const [recipe, setRecipe] = useState({
    name: "",
    author: "",
    description: "",
    labels: [""],
    ingredients: [""],
    steps: [""],
  }); //a json that contain the data the user enter

  // {
  //   name: "מרק ירקות עשיר",
  //   author: "מירב כהן",
  //   description: "מרק ירקות עשיר ומזין עם הרבה ירקות ותיבול מיוחד.",
  //   labels: ["בישול", "צמחוני", "מרקים"],
  //   ingredients: [
  //     "4 תפוחי אדמה",
  //     "2 גזרים",
  //     "2 בצלים",
  //     "1 קישוא",
  //     "1 בטטה",
  //     "4 כפות שמן זית",
  //     "2 כפות מלח",
  //     "1 כף פלפל שחור",
  //     "1 כף כמון",
  //     "3 עלי דפנה",
  //     "1/2 כף כורכום",
  //     "2 ליטר מים",
  //     "4 שיני שום קצוצות",
  //     "1/2 כף פפריקה מתוקה",
  //     "כף אבקת מרק ירקות",
  //   ],
  //   steps: [
  //     "לקל peel ולחתוך את כל הירקות לקוביות.",
  //     "לחמם שמן זית בסיר גדול ולהוסיף את הבצל והשום.",
  //     "לטגן עד שהבצל הופך לשקוף.",
  //     "להוסיף את שאר הירקות ולערבב למשך 5 דקות.",
  //     "להוסיף את התבלינים ולערבב היטב.",
  //     "להוסיף את המים ולערבב.",
  //     "להביא לרתיחה ולהוריד את האש לבישול איטי.",
  //     "לבשל במשך 40 דקות עד שהירקות מתרככים.",
  //     "להוציא את עלי הדפנה ולהוסיף מלח לפי הטעם.",
  //     "להגיש את המרק חם עם מעט שמן זית מעל.",
  //   ],
  // }

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
    () => (field, title, holder) =>
      (
        <div className={`${field}-section-new`}>
          <h3>:{title}</h3>
          {recipe[field].map((item, index) => (
            <div key={index} className={`${field}-item`}>
              <input
                className={`${field}-input`}
                type="text"
                value={item}
                placeholder={holder}
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
    const files = Array.from(e.target.files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setImages(files); // Store all selected files
    setImagesUrls(urls);
  };
  const addNewrecipe = async (recipe) => {
    for (let [key, value] of recipe.entries()) {
      console.log(key, value);
    }
    try {
      const response = await fetch("http://localhost:3001/new-recipe", {
        method: "POST",
        body: recipe,
      });

      if (response.ok) {
        alert("Recipe uploaded successfully!");
      } else {
        alert("Failed to upload recipe.");
      }
      navigate(`/`);
    } catch (error) {
      console.error("Error uploading recipe:", error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

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

    await addNewrecipe(recipeFormData);
  };

  const clearImages = async () => {
    setImagesUrls([]);
  };

  return (
    <form className="recipe-form" onSubmit={handleSubmit}>
      <button className="home-btn" onClick={() => navigate(`/`)}>
        לדף הבית
      </button>
      <h2>הוספת מתכון חדש</h2>
      <div className="info-section-new">
        <div className="img-part">
          <div className="images-btns">
            <button className="clear-images" onClick={clearImages}>
              לחץ למחיקת התמונות הנבחרות
            </button>

            <label htmlFor="hhh">לחץ על מנת להעלות קבצים </label>
            <input
              id="hhh"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          <div className="preview-container">
            {imagesUrls.map((image, index) => (
              <div className="image-preview" key={index}>
                <img src={image} alt={`preview ${index}`} />
              </div>
            ))}
          </div>
        </div>
        <div className="description-part">
          {" "}
          <textarea
            name="description"
            placeholder="תיאור המתכון"
            value={recipe.description}
            onChange={handleChange}
            rows="4"
            required
          />
        </div>

        <div className="name-author-part">
          <input
            type="text"
            name="name"
            placeholder="שם המתכון"
            value={recipe.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="author"
            placeholder="מחבר המתכון"
            value={recipe.author}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="renders-section-new">
        {renderArrayFields("ingredients", "מצרכים", " מצרך שנדרש למתכון")}
        {renderArrayFields("labels", "תגיות", "תג לסינון המתכון")}
        {renderArrayFields("steps", "שלבי הכנה", "שלב בהכנת המתכון")}
      </div>
      <button type="submit" className="submit-btn">
        שמור מתכון
      </button>
    </form>
  );
}

export default NewRecipe;
