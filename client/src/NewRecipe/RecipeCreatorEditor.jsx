import React, { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, X, Plus, ImagePlus, Trash2, Check } from "lucide-react";

import "./RecipeCreatorEditor.css";
const apiUrl = process.env.REACT_APP_API_URL;

function RecipeCreatorEditor({ recipe, recipeImages, editStatus }) {
  const navigate = useNavigate();

  const [images, setImages] = useState([]);
  const [imagesUrls, setImagesUrls] = useState(recipeImages);
  const [recipeData, setRecipeData] = useState(recipe);
  const [newTag, setNewTag] = useState("");

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

  const addTag = useCallback(() => {
    const tag = newTag.trim();
    if (!tag) return;
    setRecipeData((prevRecipe) => ({
      ...prevRecipe,
      labels: prevRecipe.labels.includes(tag) ? prevRecipe.labels : [...prevRecipe.labels, tag],
    }));
    setNewTag("");
  }, [newTag]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setImages(files);
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
    const recipeFormData = new FormData();
    recipeFormData.append("name", recipeData.name);
    recipeFormData.append("author", recipeData.author);
    recipeFormData.append("description", recipeData.description);
    recipeFormData.append("ingredients", JSON.stringify(recipeData.ingredients));
    recipeFormData.append("steps", JSON.stringify(recipeData.steps));
    recipeFormData.append("labels", JSON.stringify(recipeData.labels));

    images.forEach((image) => {
      recipeFormData.append("images", image);
    });

    if (editStatus) {
      recipeFormData.append("id", recipeData.id);
      await updateRecipe(recipeFormData, recipeData.id);
      return;
    }
    await addNewRecipe(recipeFormData);
  };

  const ingredientsCount = useMemo(() => recipeData.ingredients.length, [recipeData.ingredients]);
  const stepsCount = useMemo(() => recipeData.steps.length, [recipeData.steps]);

  return (
    <div className="recipe-editor">
      <button className="btn btn-ghost" onClick={() => navigate("/")}>
        <ArrowRight size={18} />
        חזרה
      </button>
      <h1 className="recipe-editor-title">
        {editStatus ? `עריכת מתכון: ${recipe.name}` : "מתכון חדש"}
      </h1>
      <p className="text-muted recipe-editor-subtitle">
        שלוש שאלות על המתכון, ואחר כך המצרכים והשלבים. אפשר לשמור ולהמשיך בהמשך.
      </p>

      <div className="card elev-sm recipe-editor-card">
        <h3 style={{ margin: 0 }}>פרטי המתכון</h3>
        <div className="recipe-editor-basic-grid">
          <div className="field">
            <label>שם המתכון</label>
            <input
              className="input"
              type="text"
              name="name"
              placeholder="מרק ירקות עשיר"
              value={recipeData.name}
              onChange={handleChange}
              style={{ minHeight: 44 }}
              required
            />
          </div>
          <div className="field">
            <label>מחבר המתכון</label>
            <input
              className="input"
              type="text"
              name="author"
              placeholder="מירב כהן"
              value={recipeData.author}
              onChange={handleChange}
              style={{ minHeight: 44 }}
              required
            />
          </div>
        </div>
        <div className="field">
          <label>תיאור קצר</label>
          <textarea
            className="input"
            name="description"
            rows="3"
            placeholder="מה מיוחד במתכון הזה?"
            value={recipeData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="field">
          <label>תגיות</label>
          <div className="recipe-editor-tags-row">
            {recipeData.labels.map((label, index) => (
              <span key={index} className="tag tag-accent-2 recipe-editor-tag-chip">
                {label}
                <button type="button" onClick={() => removeField(index, "labels")}>
                  <X size={13} />
                </button>
              </span>
            ))}
            <input
              className="input recipe-editor-tag-input"
              type="text"
              placeholder="תגית חדשה"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
            />
            <button type="button" className="btn btn-secondary recipe-editor-tag-add" onClick={addTag}>
              <Plus size={14} />
              תגית
            </button>
          </div>
        </div>
      </div>

      <div className="card elev-sm recipe-editor-images-card">
        <h3 style={{ margin: 0 }}>תמונות</h3>
        <div className="recipe-editor-images-grid">
          {imagesUrls.map((image, index) => (
            <img key={index} className="washed recipe-editor-image" src={image} alt="תמונה" />
          ))}
          <label htmlFor="imageUpload" className="btn recipe-editor-upload-btn">
            <ImagePlus size={24} />
            העלאת תמונה
          </label>
          <input
            id="imageUpload"
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </div>
        {imagesUrls.length > 0 && (
          <button type="button" className="btn btn-ghost" onClick={clearImages}>
            <Trash2 size={15} />
            מחיקת כל התמונות
          </button>
        )}
      </div>

      <div className="recipe-editor-lists-grid">
        <div className="card elev-sm recipe-editor-list-card">
          <h3 style={{ margin: 0 }}>מצרכים</h3>
          {recipeData.ingredients.map((ingredient, index) => (
            <div key={index} className="recipe-editor-list-row">
              <span className="recipe-editor-list-index">{index + 1}</span>
              <input
                className="input"
                type="text"
                value={ingredient}
                placeholder={`מצרך ${index + 1}`}
                onChange={(e) => handleArrayChange(e, index, "ingredients")}
                style={{ minHeight: 42 }}
                required
              />
              <button
                type="button"
                className="btn btn-icon btn-secondary"
                onClick={() => removeField(index, "ingredients")}
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-secondary btn-block" onClick={() => addField("ingredients")}>
            <Plus size={18} />
            הוספת מצרך
          </button>
          <div className="recipe-editor-count text-muted">{ingredientsCount} מצרכים</div>
        </div>

        <div className="card elev-sm recipe-editor-list-card">
          <h3 style={{ margin: 0 }}>שלבי הכנה</h3>
          {recipeData.steps.map((step, index) => (
            <div key={index} className="recipe-editor-list-row recipe-editor-step-row">
              <span className="recipe-editor-list-index recipe-editor-step-index">{index + 1}</span>
              <textarea
                className="input"
                rows="2"
                value={step}
                placeholder={`שלב ${index + 1}`}
                onChange={(e) => handleArrayChange(e, index, "steps")}
                style={{ minHeight: 60 }}
                required
              />
              <button
                type="button"
                className="btn btn-icon btn-secondary recipe-editor-step-remove"
                onClick={() => removeField(index, "steps")}
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-secondary btn-block" onClick={() => addField("steps")}>
            <Plus size={18} />
            הוספת שלב
          </button>
          <div className="recipe-editor-count text-muted">{stepsCount} שלבים</div>
        </div>
      </div>

      <div className="recipe-editor-submit-row">
        <button className="btn btn-primary recipe-editor-save-btn" onClick={handleSubmit}>
          <Check size={18} />
          {editStatus ? "שמירת שינויים" : "שמירת המתכון"}
        </button>
        <button className="btn btn-ghost" onClick={() => navigate("/")}>
          ביטול
        </button>
      </div>
    </div>
  );
}

export default RecipeCreatorEditor;
