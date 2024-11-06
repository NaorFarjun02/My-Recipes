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
const sampleRecipes = [
  {
    id: 1,
    name: "עוף צלוי בתנור",
    author: "נאור פרג'ון",
    description: "עוף עם תפוחי אדמה צלויים בתנור בתיבול מיוחד.",
    labels: ["בישול", "בשרי"],
    images: [
      require("./imgs/img1.png"),
      require("./imgs/img2.png"),
      require("./imgs/img3.png"),
      require("./imgs/img4.png"),
    ],
    ingredients: [
      "קילו עוף",
      "4 תפוחי אדמה",
      "חצי כפית פפריקה",
      "כפית מלח",
      "חצי כפית פלפל שחור",
      "1 בטטה",
    ],
    steps: ["לחתוך את העוף", "לתבל ולצלות בתנור"],
  },
  {
    id: 2,
    name: "מרק ירקות עשיר",
    author: "מירב כהן",
    description: "מרק ירקות עשיר ומזין עם הרבה ירקות ותיבול מיוחד.",
    labels: ["בישול", "צמחוני", "מרקים"],
    images: [
      require("./imgs/img3_1.png"),
      require("./imgs/img3_2.png"),
      require("./imgs/img3_3.png"),
      require("./imgs/img3_4.png"),
      require("./imgs/img3_5.png"),
      require("./imgs/img3_6.png"),
    ],
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
  },
  {
    id: 3,
    name: "קוסקוס עם ירקות",
    author: "רותם לוי",
    description: "קוסקוס ביתי עם ירקות טריים ומבושלים.",
    labels: ["בישול", "צמחוני"],
    images: ["./img5.png", "img6.png", "img7.png", "img8.png"],
    ingredients: [
      "2 כוסות קוסקוס",
      "4 גזרים",
      "3 תפוחי אדמה",
      "כף שמן זית",
      "כפית מלח",
    ],
    steps: ["לבשל את הקוסקוס", "לבשל את הירקות ולהגיש יחד"],
  },
  {
    id: 4,
    name: "חומוס ביתי",
    author: "נאוה כהן",
    description: "חומוס עשיר עם תוספות של גרגירי חומוס חמים.",
    labels: ["בישול", "טבעוני"],
    images: ["./img13.png", "./img14.png", "./img15.png", "./img16.png"],
    ingredients: [
      "500 גרם חומוס יבש",
      "2 שיני שום",
      "כף טחינה",
      "מיץ מלימון אחד",
      "מלח לפי הטעם",
    ],
    steps: ["להשרות ולבשל את החומוס", "לטחון ולהוסיף תבלינים"],
  },
  {
    id: 5,
    name: "שקשוקה חריפה",
    author: "שלומי יעקובוביץ",
    description: "שקשוקה חריפה עם ביצים ורוטב עגבניות פיקנטי.",
    labels: ["בישול", "צמחוני", "חלבי"],
    images: ["./img17.png", "./img18.png", "./img19.png", "./img20.png"],
    ingredients: [
      "6 ביצים",
      "4 עגבניות",
      "1 פלפל חריף",
      "בצל אחד",
      "שום כתוש",
      "כף שמן זית",
    ],
    steps: [
      "לטגן את הבצל והשום",
      "להוסיף את העגבניות והתבלינים ולהכניס את הביצים",
    ],
  },
  {
    id: 6,
    name: "מרק עגבניות",
    author: "דנה הררי",
    description: "מרק עגבניות עשיר עם בזיליקום ושמן זית.",
    labels: ["בישול", "טבעוני"],
    images: ["./img21.png", "./img22.png", "./img23.png", "./img24.png"],
    ingredients: [
      "6 עגבניות בשלות",
      "2 שיני שום",
      "כף שמן זית",
      "עלים של בזיליקום",
      "כפית מלח",
      "חצי כפית סוכר",
    ],
    steps: ["לטחון את העגבניות", "לבשל עם התבלינים ולהגיש"],
  },
  {
    id: 7,
    name: "פלאפל ביתי",
    author: "אורן אוחנה",
    description: "כדורי פלאפל קריספיים מהמטבח המסורתי.",
    labels: ["בישול", "טבעוני"],
    images: ["./img25.png", "./img26.png", "./img27.png", "./img28.png"],
    ingredients: [
      "500 גרם חומוס יבש",
      "2 שיני שום",
      "חצי בצל",
      "כף כמון",
      "כף כוסברה טחונה",
      "שמן לטיגון עמוק",
    ],
    steps: ["לטחון את החומוס עם התבלינים", "לגלגל כדורים ולטגן"],
  },
  {
    id: 8,
    name: "סלט קיסר",
    author: "ירדן שפריר",
    description: "סלט קיסר קלאסי עם רוטב קרמי וקרוטונים.",
    labels: ["בישול", "חלבי"],
    images: ["./img29.png", "./img30.png", "./img31.png", "./img32.png"],
    ingredients: [
      "לבבות חסה",
      "קרוטונים",
      "2 כפות מיונז",
      "מיץ מלימון אחד",
      "פרמזן מגורר",
    ],
    steps: ["לשטוף את החסה", "לערבב את הרוטב ולהוסיף את הקרוטונים"],
  },
  {
    id: 9,
    name: "סושי ביתי",
    author: "איילת רבינוביץ",
    description: "רולים של סושי עם ירקות ודגים טריים.",
    labels: ["בישול", "דגים"],
    images: ["./img33.png", "./img34.png", "./img35.png", "./img36.png"],
    ingredients: ["דפי אצות", "אורז סושי", "אבוקדו", "מלפפון", "סלמון טרי"],
    steps: ["לבשל את האורז", "לגלגל את הרולים ולחתוך"],
  },
  {
    id: 10,
    name: "בורקס גבינה",
    author: "גלית זמיר",
    description: "בורקס עם מילוי גבינה מתוק וחמאתי.",
    labels: ["בישול", "חלבי"],
    images: ["./img37.png", "./img38.png", "./img39.png", "./img40.png"],
    ingredients: [
      "חבילת בצק עלים",
      "250 גרם גבינת קוטג'",
      "2 ביצים",
      "כף סוכר",
    ],
    steps: ["לערבב את הגבינה והביצים", "למלא את הבצק ולאפות"],
  },
  {
    id: 11,
    name: "קרפ צרפתי",
    author: "יונתן אברהם",
    description: "קרפ צרפתי מתוק עם שוקולד ונוטלה.",
    labels: ["בישול", "חלבי"],
    images: ["./img41.png", "./img42.png", "./img43.png", "./img44.png"],
    ingredients: [
      "2 ביצים",
      "1 כוס קמח",
      "2 כוסות חלב",
      "שוקולד לנמס",
      "אופציה לתוספות כמו פירות",
    ],
    steps: ["לערבב את החומרים", "לצלות על מחבת ולהוסיף תוספות"],
  },
  {
    id: 12,
    name: "אורז עם ירקות",
    author: "לירון אוחנה",
    description: "אורז מבושל עם ירקות צבעוניים.",
    labels: ["בישול", "צמחוני"],
    images: ["./img45.png", "./img46.png", "./img47.png", "./img48.png"],
    ingredients: ["2 כוסות אורז", "1 גזר", "1 קישוא", "1 פלפל מתוק", "כף שמן"],
    steps: ["לבשל את האורז", "לטגן את הירקות ולהגיש יחד"],
  },
  {
    id: 13,
    name: "שניצל עוף",
    author: "אורן אוחנה",
    description: "שניצל עוף פריך וטעים.",
    labels: ["בישול", "בשרי"],
    images: ["./img49.png", "./img50.png", "./img51.png"],
    ingredients: [
      "קילו חזה עוף",
      "2 ביצים",
      "1 כוס פנקו",
      "מלח ופלפל לפי הטעם",
      "שמן לטיגון",
    ],
    steps: ["לטגן את העוף אחרי טיבול בביצים ובפנקו.", "לטגן עד להשחמה."],
  },
  {
    id: 14,
    name: "פסטה ברוטב עגבניות",
    author: "ליהי שמעוני",
    description: "פסטה עם רוטב עגבניות וריחני.",
    labels: ["בישול", "צמחוני"],
    images: ["./img52.png", "./img53.png", "./img54.png"],
    ingredients: [
      "250 גרם פסטה",
      "400 גרם עגבניות קצוצות",
      "2 שיני שום",
      "2 כפות שמן זית",
      "מלח ופלפל לפי הטעם",
      "בזיליקום קצוץ",
    ],
    steps: [
      "לבשל את הפסטה.",
      "לטגן את השום בשמן זית ולהוסיף עגבניות.",
      "לבשל עד שהרוטב מצטמצם.",
      "להוסיף פסטה ולערבב עם בזיליקום.",
    ],
  },
  {
    id: 15,
    name: "סלט טונה",
    author: "מיה לוי",
    description: "סלט טונה טרי ובריא עם ירקות.",
    labels: ["בישול", "דגים", "סלטים"],
    images: ["./img55.png", "./img56.png", "./img57.png"],
    ingredients: [
      "1 קופסה טונה",
      "1 מלפפון",
      "2 עגבניות",
      "1 בצל קטן",
      "מיץ מלימון אחד",
      "מלח ופלפל לפי הטעם",
    ],
    steps: ["לחתוך את כל הירקות.", "לערבב את כל המרכיבים ולהגיש."],
  },
  {
    id: 16,
    name: "פיצה ביתית",
    author: "ליאון רפאל",
    description: "פיצה ביתית עם תוספות לפי הטעם.",
    labels: ["בישול", "חלבי"],
    images: ["./img58.png", "./img59.png", "./img60.png"],
    ingredients: [
      '1 ק"ג קמח',
      "40 גרם שמרים",
      "2 כוסות מים",
      "מלח",
      "רוטב עגבניות",
      "גבינה צהובה",
      "תוספות לפי הטעם",
    ],
    steps: [
      "לערבב את החומרים וללוש את הבצק.",
      "לתת לבצק לתפוח.",
      "לרדד ולמלא ברוטב ובגבינה.",
      "לאפות בחום גבוה.",
    ],
  },
  {
    id: 17,
    name: "עוגת שוקולד",
    author: "תמר עזריה",
    description: "עוגת שוקולד רכה וטעימה.",
    labels: ["אפייה", "חלבי"],
    images: ["./img61.png", "./img62.png", "./img63.png"],
    ingredients: [
      "200 גרם שוקולד מריר",
      "150 גרם חמאה",
      "1 כוס סוכר",
      "4 ביצים",
      "1 כוס קמח",
      "כפית אבקת סודה לשתייה",
    ],
    steps: [
      "למיס את השוקולד עם החמאה.",
      "להקציף ביצים עם סוכר.",
      "לערבב עם החומרים היבשים.",
      "לאפות בתנור בחום של 180 מעלות.",
    ],
  },
  {
    id: 18,
    name: "פנקייקס",
    author: "מאיה לוי",
    description: "פנקייקס רכים עם סירופ מייפל.",
    labels: ["אפייה", "חלבי"],
    images: ["./img64.png", "./img65.png", "./img66.png"],
    ingredients: [
      "1 כוס קמח",
      "1 כף סוכר",
      "1 כף אבקת סודה לשתייה",
      "1/2 כוס חלב",
      "1 ביצה",
      "כף חמאה מומסת",
    ],
    steps: [
      "לערבב את החומרים היבשים.",
      "להוסיף חלב, ביצה וחמאה ולערבב.",
      "לטגן במחבת על חום בינוני עד להשחמה.",
    ],
  },
  {
    id: 19,
    name: "עוגת גבינה",
    author: "גלית שמעוני",
    description: "עוגת גבינה קלה ורכה.",
    labels: ["אפייה", "חלבי"],
    images: ["./img67.png", "./img68.png", "./img69.png"],
    ingredients: [
      "500 גרם גבינת מסקרפונה",
      "1/2 כוס סוכר",
      "4 ביצים",
      "1/2 כוס קמח",
      "1/2 כוס שמן",
    ],
    steps: ["לערבב את כל החומרים בקערה.", "לאפות בתנור בחום של 160 מעלות."],
  },
  {
    id: 20,
    name: "סלט קיץ",
    author: "אנה ולדימיר",
    description: "סלט קיץ טרי עם ירקות ואבוקדו.",
    labels: ["בישול", "צמחוני", "סלטים"],
    images: ["./img70.png", "./img71.png", "./img72.png"],
    ingredients: [
      "1 אבוקדו",
      "2 עגבניות",
      "1 מלפפון",
      "1/2 בצל סגול",
      "מיץ מלימון אחד",
      "מלח ופלפל לפי הטעם",
    ],
    steps: ["לחתוך את כל הירקות.", "לערבב ולהוסיף מלח ופלפל."],
  },
  {
    id: 21,
    name: "מאפה תרד וגבינה",
    author: "רותם אריה",
    description: "מאפה פריך עם מילוי תרד וגבינה.",
    labels: ["בישול", "חלבי"],
    images: ["./img73.png", "./img74.png", "./img75.png"],
    ingredients: [
      "1 חבילת בצק עלים",
      "200 גרם גבינת פטה",
      "300 גרם תרד",
      "1 ביצה",
      "שום קצוץ",
    ],
    steps: [
      "לטגן את התרד עם השום.",
      "לערבב עם גבינת פטה ולמלא את הבצק.",
      "לאפות עד שהמאפה משחים.",
    ],
  },
  {
    id: 22,
    name: "קציצות בשר",
    author: "חיים ברש",
    description: "קציצות בשר טעימות ועסיסיות.",
    labels: ["בישול", "בשרי"],
    images: ["./img76.png", "./img77.png", "./img78.png"],
    ingredients: [
      "500 גרם בשר טחון",
      "1 ביצה",
      "1/2 כוס פירורי לחם",
      "שום קצוץ",
      "מלח ופלפל לפי הטעם",
    ],
    steps: ["לערבב את כל החומרים.", "לגלגל לקציצות ולטגן."],
  },
  {
    id: 23,
    name: "עוגת גזר",
    author: "אורית לוי",
    description: "עוגת גזר רכה עם אגוזים.",
    labels: ["אפייה", "חלבי"],
    images: ["./img79.png", "./img80.png", "./img81.png"],
    ingredients: [
      "2 כוסות גזר מגורר",
      "1 כוס סוכר",
      "1/2 כוס שמן",
      "3 ביצים",
      "2 כוסות קמח",
      "1 כפית קינמון",
    ],
    steps: ["לערבב את כל החומרים.", "לאפות בתנור בחום של 180 מעלות."],
  },
  {
    id: 24,
    name: "תפוחי אדמה אפויים",
    author: "מאיה דנון",
    description: "תפוחי אדמה אפויים עם תיבול כיד המלך.",
    labels: ["בישול", "צמחוני"],
    images: ["./img82.png", "./img83.png", "./img84.png"],
    ingredients: [
      "1 ק'ג תפוחי אדמה",
      "שום קצוץ",
      "מלח ופלפל לפי הטעם",
      "2 כפות שמן זית",
    ],
    steps: [
      "לחמם את התנור ל-200 מעלות.",
      "לחתוך את תפוחי האדמה, לתבל ולבשל.",
      "לאפות עד שהם רכים ושחומים.",
    ],
  },
  {
    id: 25,
    name: "פסטה עם פירות ים",
    author: "נמרוד פישר",
    description: "פסטה עם פירות ים טריים ורוטב עגבניות.",
    labels: ["בישול", "דגים", "פסטה"],
    images: ["./img85.png", "./img86.png", "./img87.png"],
    ingredients: [
      "250 גרם פסטה",
      "200 גרם שרימפס",
      "200 גרם קלמארי",
      "3 עגבניות קצוצות",
      "2 כפות שמן זית",
      "שום קצוץ",
      "מלח ופלפל לפי הטעם",
    ],
    steps: [
      "לבשל את הפסטה לפי ההוראות על האריזה.",
      "לטגן את השום בשמן זית ולהוסיף עגבניות.",
      "להוסיף את פירות הים ולטגן עד שהם מבושלים.",
      "לערבב עם הפסטה ולהגיש חם.",
    ],
  },
];

function App() {
  const [recipes, setRecipes] = useState([]);

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
    } catch (error) {
      console.error("Error uploading recipe:", error);
    }
  };

  useEffect(() => {
    fetch("http://localhost:3001/get-recipes") // Replace with your server's URL
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
          <Route
            path="/new-recipe"
            element={<NewRecipe onSubmit={addNewrecipe} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

// function thet set the RecipeView with the recipe base on the ID in the URL
function RecipeViewWrapper() {
  const { id } = useParams();
  const recipe = sampleRecipes.find((recipe) => recipe.id === parseInt(id));

  if (!recipe) {
    return <div>המתכון לא נמצא</div>;
  }

  return <RecipeView recipe={recipe} />;
}

export default App;
