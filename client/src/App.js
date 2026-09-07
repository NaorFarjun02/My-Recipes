import { BrowserRouter as Router, Route, Routes, useParams } from "react-router-dom";
import RecipeBrowser from "./RecipeBrowser/RecipeBrowser";
import RecipeView from "./RecipeView/RecipeView";
import RecipeCook from "./RecipeView/RecipeCook";
import RecipeCreatorEditor from "./NewRecipe/RecipeCreatorEditor";
import Logo from "./Logo/Logo";
import { useEffect, useState } from "react";
import "./styles/variables.css";
import "./App.css";

const apiUrl = process.env.REACT_APP_API_URL;

const BLANK_RECIPE = {
  name: "",
  author: "",
  description: "",
  labels: [],
  ingredients: [""],
  steps: [""],
};

function App() {
  return (
    <Router>
      <div className="App">
        <Logo />
        <div className="container-fluid">
          <Routes>
            <Route path="/" element={<RecipeBrowser />} />
            <Route path="/recipe/:id" element={<RecipeViewWrapper />} />
            <Route path="/recipe/:id/cook" element={<RecipeCookWrapper />} />
            <Route path="/edit-recipe/:id" element={<RecipeEditWrapper />} />
            <Route
              path="/new-recipe"
              element={
                <RecipeCreatorEditor
                  recipeImages={[]}
                  recipe={BLANK_RECIPE}
                  editStatus={false}
                />
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

// function thet set the RecipeView with the recipe base on the ID in the URL
function RecipeViewWrapper() {
  const [recipe, setRecipe] = useState();
  const { id } = useParams();

  useEffect(() => {
    fetch(`${apiUrl}/get-recipe/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setRecipe(data);
      })
      .catch((error) => console.error("Error fetching recipe:", error));
  }, [id]);

  if (!recipe) {
    return <div>המתכון לא נמצא</div>;
  }

  return <RecipeView recipe={recipe} />;
}

function RecipeCookWrapper() {
  const [recipe, setRecipe] = useState();
  const { id } = useParams();

  useEffect(() => {
    fetch(`${apiUrl}/get-recipe/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setRecipe(data);
      })
      .catch((error) => console.error("Error fetching recipe:", error));
  }, [id]);

  if (!recipe) {
    return <div>המתכון לא נמצא</div>;
  }

  return <RecipeCook recipe={recipe} />;
}

function RecipeEditWrapper() {
  const [recipe, setRecipe] = useState();
  const { id } = useParams();

  useEffect(() => {
    fetch(`${apiUrl}/get-recipe/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setRecipe(data);
      })
      .catch((error) => console.error("Error fetching recipe:", error));
  }, [id]);

  if (!recipe) {
    return <div>המתכון לא נמצא</div>;
  }
  const images = recipe.images.map((image) => `${apiUrl}${image}`);
  return (
    <RecipeCreatorEditor
      recipe={recipe}
      recipeImages={images}
      editStatus={true}
    />
  );
}

export default App;
