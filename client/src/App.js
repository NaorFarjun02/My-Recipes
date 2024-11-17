import {
  BrowserRouter as Router,
  Route,
  Routes,
  useParams,
} from "react-router-dom";
import RecipeBrowser from "./RecipeBrowser/RecipeBrowser"; // Import the RecipeBrowser component
import RecipeView from "./RecipeView/RecipeView";
import "./App.css"; // Add global styles if needed
import NewRecipe from "./NewRecipe/NewRecipe";
import { useEffect, useState } from "react";

const apiUrl = process.env.REACT_APP_API_URL;
function App() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetch(`${apiUrl}/get-recipes`)
      .then((response) => response.json())
      .then((data) => {
        setRecipes(data);
      })
      .catch((error) => console.error("Error fetching recipes:", error));
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* עמוד ברירת מחדל - כלל המתכונים */}
          <Route path="/" element={<RecipeBrowser recipes={recipes} />} />

          {/* עמוד צפייה במתכון יחיד */}
          <Route path="/recipe/:id" element={<RecipeViewWrapper />} />

          {/* עמוד הוספת מתכון */}
          <Route path="/new-recipe" element={<NewRecipe />} />
        </Routes>
      </div>
    </Router>
  );
}

// function thet set the RecipeView with the recipe base on the ID in the URL
function RecipeViewWrapper() {
  const [recipe, setRecipe] = useState();
  const { id } = useParams();

  useEffect(() => {
    fetch(`${apiUrl}/get-recipe/${id}`) // Replace with your server's URL
      .then((response) => response.json())
      .then((data) => {
        setRecipe(data);
        console.log(data[0].firstImageUrl);
      })
      .catch((error) => console.error("Error fetching recipes:", error));
  }, [id]);
  // getRecipe(id);

  if (!recipe) {
    return <div>המתכון לא נמצא</div>;
  }

  return <RecipeView recipe={recipe} />;
}

export default App;
