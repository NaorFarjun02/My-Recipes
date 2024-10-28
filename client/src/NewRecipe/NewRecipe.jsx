import React, { useState, useCallback, useMemo } from "react";
import "./NewRecipe.css";

function NewRecipe({ onSubmit }) {
  const [recipe, setRecipe] = useState({
    name: "",
    author: "",
    ingredients: [""],
    steps: [""],
    labels: [""],
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(recipe);
    // onSubmit(recipe);
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

      {renderArrayFields("labels", "תגיות")}
      {renderArrayFields("steps", "שלבי הכנה")}
      {renderArrayFields("ingredients", "מצרכים")}

      <button type="submit" className="submit-btn">
        שמור מתכון
      </button>
    </form>
  );
}

export default NewRecipe;
