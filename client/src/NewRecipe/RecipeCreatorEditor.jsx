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
    <div className="container-fluid py-4">
      {/* כותרת */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="display-5 text-primary fw-bold">
              <i className="bi bi-plus-circle-fill me-3"></i>
              {editStatus ? `עדכון מתכון: ${recipe.name}` : 'הוספת מתכון חדש'}
            </h1>
            <button className="btn btn-outline-primary" onClick={() => navigate('/')}>
              <i className="bi bi-house-fill me-2"></i>
              דף הבית
            </button>
          </div>
          <hr className="border-primary border-3" />
        </div>
      </div>

      <div className="row">
        {/* פרטים בסיסיים */}
        <div className="col-lg-8 col-md-12 mb-4">
          <div className="card shadow border-0">
            <div className="card-header bg-primary text-white">
              <h3 className="card-title mb-0">
                <i className="bi bi-info-circle me-2"></i>
                פרטי המתכון
              </h3>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-bold">שם המתכון:</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    name="name"
                    placeholder="הכנס שם מתכון..."
                    value={recipeData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">מחבר המתכון:</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    name="author"
                    placeholder="הכנס שם המחבר..."
                    value={recipeData.author}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label fw-bold">תיאור המתכון:</label>
                  <textarea
                    className="form-control"
                    name="description"
                    placeholder="תיאור קצר על המתכון..."
                    value={recipeData.description}
                    onChange={handleChange}
                    rows="4"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* תמונות */}
        <div className="col-lg-4 col-md-12 mb-4">
          <div className="card shadow border-0">
            <div className="card-header bg-info text-white">
              <h3 className="card-title mb-0">
                <i className="bi bi-images me-2"></i>
                תמונות המתכון
              </h3>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="imageUpload" className="btn btn-outline-info w-100">
                  <i className="bi bi-upload me-2"></i>
                  העלאת תמונות
                </label>
                <input
                  id="imageUpload"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="d-none"
                />
              </div>
              
              {imagesUrls.length > 0 && (
                <button className="btn btn-outline-danger w-100 mb-3" onClick={clearImages}>
                  <i className="bi bi-trash me-2"></i>
                  מחיקת כל התמונות
                </button>
              )}

              <div className="row g-2">
                {imagesUrls.map((image, index) => (
                  <div key={index} className="col-6">
                    <img
                      src={image}
                      className="img-fluid rounded shadow-sm"
                      alt={`תמונה ${index + 1}`}
                      style={{ height: '100px', width: '100%', objectFit: 'cover' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* תכונות המתכון */}
      <div className="row">
        {/* מצרכים */}
        <div className="col-lg-4 col-md-12 mb-4">
          <div className="card shadow border-0 h-100">
            <div className="card-header bg-success text-white">
              <h3 className="card-title mb-0">
                <i className="bi bi-basket me-2"></i>
                מצרכים
              </h3>
            </div>
            <div className="card-body">
              {recipeData.ingredients.map((ingredient, index) => (
                <div key={index} className="input-group mb-2">
                  <input
                    type="text"
                    className="form-control"
                    value={ingredient}
                    placeholder="הכנס מצרך..."
                    onChange={(e) => handleArrayChange(e, index, 'ingredients')}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => removeField(index, 'ingredients')}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-success w-100"
                onClick={() => addField('ingredients')}
              >
                <i className="bi bi-plus me-2"></i>
                הוסף מצרך
              </button>
            </div>
          </div>
        </div>

        {/* תגיות */}
        <div className="col-lg-4 col-md-12 mb-4">
          <div className="card shadow border-0 h-100">
            <div className="card-header bg-warning text-dark">
              <h3 className="card-title mb-0">
                <i className="bi bi-tags me-2"></i>
                תגיות
              </h3>
            </div>
            <div className="card-body">
              {recipeData.labels.map((label, index) => (
                <div key={index} className="input-group mb-2">
                  <input
                    type="text"
                    className="form-control"
                    value={label}
                    placeholder="הכנס תגית..."
                    onChange={(e) => handleArrayChange(e, index, 'labels')}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => removeField(index, 'labels')}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-warning w-100"
                onClick={() => addField('labels')}
              >
                <i className="bi bi-plus me-2"></i>
                הוסף תגית
              </button>
            </div>
          </div>
        </div>

        {/* שלבי הכנה */}
        <div className="col-lg-4 col-md-12 mb-4">
          <div className="card shadow border-0 h-100">
            <div className="card-header bg-danger text-white">
              <h3 className="card-title mb-0">
                <i className="bi bi-list-ol me-2"></i>
                שלבי הכנה
              </h3>
            </div>
            <div className="card-body">
              {recipeData.steps.map((step, index) => (
                <div key={index} className="mb-3">
                  <label className="form-label fw-bold">שלב {index + 1}:</label>
                  <div className="input-group">
                    <textarea
                      className="form-control"
                      value={step}
                      placeholder={`תיאור שלב ${index + 1}...`}
                      onChange={(e) => handleArrayChange(e, index, 'steps')}
                      rows="2"
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => removeField(index, 'steps')}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-danger w-100"
                onClick={() => addField('steps')}
              >
                <i className="bi bi-plus me-2"></i>
                הוסף שלב
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* כפתור שמירה */}
      <div className="row">
        <div className="col-12 text-center">
          <button
            onClick={handleSubmit}
            className="btn btn-lg btn-primary px-5"
            style={{ borderRadius: '50px' }}
          >
            <i className="bi bi-save me-2"></i>
            {editStatus ? 'שמור שינויים' : 'שמור מתכון'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecipeCreatorEditor;
