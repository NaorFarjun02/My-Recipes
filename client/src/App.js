import React from "react";
import RecipeBrowser from "./RecipeBrowser/RecipeBrowser"; // Import the RecipeBrowser component
import RecipeView from "./RecipeView/RecipeView";
import "./App.css"; // Add global styles if needed

// Sample recipe data (you can replace this with actual data or fetch it from an API)
const sampleRecipes = {
  id: 1,
  name: "עוף צלוי בתנור",
  author: "נאור פרגון",
  images: ["1.png","1.png","1.png"],
  description: "עוף עם תפוחי אדמה צלויים בתנור בתיבול מיוחד.",
  labels: ["בישול", "בשרי"],
  category: "בישול",
  ingredients: ["עוף", "תפוחי אדמה", "תבלינים"],
  steps: ["1. לחתוך את העוף", "2. לתבל ולצלות בתנור"],
};
// Add more recipes as needed

function App() {
  return (
    <div className="App">
      {/* Pass the sample recipes to the RecipeBrowser component */}
      {/* <RecipeBrowser recipes={sampleRecipes} /> */}
      <RecipeView recipe={sampleRecipes} />
    </div>
  );
}

export default App;
