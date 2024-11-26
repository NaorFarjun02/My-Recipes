import {
  BrowserRouter as Router,
  Route,
  Routes,
  useParams,
} from "react-router-dom";
import RecipeBrowser from "./RecipeBrowser/RecipeBrowser"; // Import the RecipeBrowser component
import RecipeView from "./RecipeView/RecipeView";
import "./App.css"; // Add global styles if needed
import RecipeCreatorEditor from "./NewRecipe/RecipeCreatorEditor";
import { useEffect, useState } from "react";

const apiUrl = process.env.REACT_APP_API_URL;
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* עמוד ברירת מחדל - כלל המתכונים */}
          <Route path="/" element={<RecipeBrowser />} />

          {/* עמוד צפייה במתכון יחיד */}
          <Route path="/recipe/:id" element={<RecipeViewWrapper />} />

          {/* עמוד הוספת מתכון */}
          <Route path="/edit-recipe/:id" element={<RecipeEditWrapper />} />
          <Route
            path="/new-recipe"
            element={
              <RecipeCreatorEditor
                recipeImages={[]}
                recipe={{
                  name: "מרק ירקות עשיר",
                  author: "מירב כהן",
                  description:
                    "מרק ירקות עשיר ומזין עם הרבה ירקות ותיבול מיוחד.",
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
                }}
                editStatus={false}
              />
            }
          />
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
    fetch(`${apiUrl}/get-recipe/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setRecipe(data);
        console.log(data);
      })
      .catch((error) => console.error("Error fetching recipe:", error));
  }, [id]);

  if (!recipe) {
    return <div>המתכון לא נמצא</div>;
  }

  return <RecipeView recipe={recipe} />;
}
function RecipeEditWrapper() {
  const [recipe, setRecipe] = useState();
  const { id } = useParams();

  useEffect(() => {
    fetch(`${apiUrl}/get-recipe/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setRecipe(data);
        console.log(data);
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
