import React, { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import "./RecipeCreatorEditor.css";
const apiUrl = process.env.REACT_APP_API_URL;

function RecipeCreatorEditor({ recipe, recipeImages, editStatus }) {
  const navigate = useNavigate();

  const [images, setImages] = useState([]);
  const [imagesUrls, setImagesUrls] = useState(recipeImages);
  const [recipeData, setRecipeData] = useState(recipe); //a json that contain the data the user enter

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setRecipeData((prevRecipe) => ({ ...prevRecipe, [name]: value }));
  }, []);

  const handleArrayChange = useCallback((e, index, field) => {
    const { value } = e.target;
    setRecipeData((prevRecipe) => {
      const updatedField = [...prevRecipe[field]];
      updatedField[index] = value;
      return { ...prevRecipe, [field]: updatedField };
    });
  }, []);

  const addField = useCallback((field) => {
    setRecipeData((prevRecipe) => ({
      ...prevRecipe,
      [field]: [...prevRecipe[field], ""],
    }));
  }, []);

  const removeField = useCallback((index, field) => {
    setRecipeData((prevRecipe) => {
      const updatedField = prevRecipe[field].filter((_, i) => i !== index);
      return { ...prevRecipe, [field]: updatedField };
    });
  }, []);

  const renderArrayFields = useMemo(
    () => (field, title, holder) =>
      (
        <div className={`${field}-section-new`}>
          <h3>:{title}</h3>
          {recipeData[field].map((item, index) => (
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
    [recipeData, handleArrayChange, removeField, addField]
  );

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setImages(files); // Store all selected files
    setImagesUrls(urls);
  };
  const clearImages = async () => {
    setImagesUrls([]);
  };
  const addNewRecipe = async (recipe) => {
    try {
      const response = await fetch("http://localhost:3001/new-recipe", {
        method: "POST",
        body: recipe,
      });

      if (!response.ok) {
        alert("Failed to upload recipe.");
        throw Error(response);
      }
      alert("Recipe uploaded successfully!");
      navigate(`/`);
    } catch (error) {
      console.error("Error uploading recipe:", error);
    }
  };
  const updateRecipe = async (recipe, id) => {
    try {
      const response = await fetch(`${apiUrl}/update-recipe/${id}`, {
        method: "PUT",
        body: recipe,
      });
      if (!response.ok) {
        alert("Failed to updated recipe.");
        throw Error(response);
      }
      alert("Recipe updated successfully!");
      navigate(`/`);
    } catch (error) {
      console.error("Error updateing recipe:", error);
      navigate(`/`);
    }
  };
  const handleSubmit = async (e) => {
    const recipeFormData = new FormData(); // the data that send to server
    recipeFormData.append("name", recipeData.name);
    recipeFormData.append("author", recipeData.author);
    recipeFormData.append("description", recipeData.description);
    recipeFormData.append(
      "ingredients",
      JSON.stringify(recipeData.ingredients)
    );
    recipeFormData.append("steps", JSON.stringify(recipeData.steps));
    recipeFormData.append("labels", JSON.stringify(recipeData.labels));

    // Append each image to the form data
    images.forEach((image) => {
      recipeFormData.append("images", image);
    });

    if (editStatus) {
      recipeFormData.append("id", recipeData.id); //add the id of the recipe to the data
      await updateRecipe(recipeFormData, recipeData.id); //send a put request to server
      return;
    }
    await addNewRecipe(recipeFormData); //send a post request to server
  };

  return (
    <div className="recipe-form">
      <button className="home-btn-create" onClick={() => navigate(`/`)}>
        לדף הבית
      </button>
      {editStatus ? (
        <h2>עדכון מתכון {recipe.name}</h2>
      ) : (
        <h2>הוספת מתכון חדש</h2>
      )}
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
            value={recipeData.description}
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
            value={recipeData.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="author"
            placeholder="מחבר המתכון"
            value={recipeData.author}
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
      <button onClick={() => handleSubmit()} className="submit-btn">
        {editStatus ? "שמור שינויים" : "שמור מתכון"}
      </button>
    </div>
  );
}

export default RecipeCreatorEditor;
