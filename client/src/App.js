import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useParams,
} from "react-router-dom";
import RecipeBrowser from "./RecipeBrowser/RecipeBrowser"; // Import the RecipeBrowser component
import RecipeView from "./RecipeView/RecipeView";
import "./App.css"; // Add global styles if needed

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
    steps: {
      1: "לחתוך את העוף",
      2: "לתבל ולצלות בתנור",
    },
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
    steps: {
      1: "לקלף ולחתוך את כל הירקות לקוביות.",
      2: "לחמם שמן זית בסיר גדול ולהוסיף את הבצל והשום.",
      3: "לטגן עד שהבצל הופך לשקוף.",
      4: "להוסיף את שאר הירקות ולערבב למשך 5 דקות.",
      5: "להוסיף את התבלינים ולערבב היטב.",
      6: "להוסיף את המים ולערבב.",
      7: "להביא לרתיחה ולהוריד את האש לבישול איטי.",
      8: "לבשל במשך 40 דקות עד שהירקות מתרככים.",
      9: "להוציא את עלי הדפנה ולהוסיף מלח לפי הטעם.",
      10: "להגיש את המרק חם עם מעט שמן זית מעל.",
    },
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
    steps: {
      1: "לבשל את הקוסקוס",
      2: "לבשל את הירקות ולהגיש יחד",
    },
  },
  {
    id: 4,
    name: "חומוס ביתי",
    author: "נאוה כהן",
    description: "חומוס עשיר עם תוספות של גרגירי חומוס חמים.",
    labels: ["בישול", "טבעוני"],
    images: ["./img13.png", "img14.png", "img15.png", "img16.png"],
    ingredients: [
      "500 גרם חומוס יבש",
      "2 שיני שום",
      "כף טחינה",
      "מיץ מלימון אחד",
      "מלח לפי הטעם",
    ],
    steps: {
      1: "להשרות ולבשל את החומוס",
      2: "לטחון ולהוסיף תבלינים",
    },
  },
  {
    id: 5,
    name: "שקשוקה חריפה",
    author: "שלומי יעקובוביץ",
    description: "שקשוקה חריפה עם ביצים ורוטב עגבניות פיקנטי.",
    labels: ["בישול", "צמחוני"],
    images: ["./img17.png", "img18.png", "img19.png", "img20.png"],
    ingredients: [
      "6 ביצים",
      "4 עגבניות",
      "1 פלפל חריף",
      "בצל אחד",
      "שום כתוש",
      "כף שמן זית",
    ],
    steps: {
      1: "לטגן את הבצל והשום",
      2: "להוסיף את העגבניות והתבלינים ולהכניס את הביצים",
    },
  },
  {
    id: 6,
    name: "מרק עגבניות",
    author: "דנה הררי",
    description: "מרק עגבניות עשיר עם בזיליקום ושמן זית.",
    labels: ["בישול", "טבעוני"],
    images: ["./img21.png", "img22.png", "img23.png", "img24.png"],
    ingredients: [
      "6 עגבניות בשלות",
      "2 שיני שום",
      "כף שמן זית",
      "עלים של בזיליקום",
      "כפית מלח",
      "חצי כפית סוכר",
    ],
    steps: {
      1: "לטחון את העגבניות",
      2: "לבשל עם התבלינים ולהגיש",
    },
  },
  {
    id: 7,
    name: "פלאפל ביתי",
    author: "אורן אוחנה",
    description: "כדורי פלאפל קריספיים מהמטבח המסורתי.",
    labels: ["בישול", "טבעוני"],
    images: ["./img25.png", "img26.png", "img27.png", "img28.png"],
    ingredients: [
      "500 גרם חומוס יבש",
      "2 שיני שום",
      "חצי בצל",
      "כף כמון",
      "כף כוסברה טחונה",
      "שמן לטיגון עמוק",
    ],
    steps: {
      1: "לטחון את החומוס עם התבלינים",
      2: "לגלגל כדורים ולטגן",
    },
  },
  {
    id: 8,
    name: "סלט קיסר",
    author: "ירדן שפריר",
    description: "סלט קיסר קלאסי עם רוטב קרמי וקרוטונים.",
    labels: ["בישול", "חלבי"],
    images: ["./img29.png", "img30.png", "img31.png", "img32.png"],
    ingredients: [
      "לבבות חסה",
      "קרוטונים",
      "2 כפות מיונז",
      "מיץ מלימון אחד",
      "פרמזן מגורר",
    ],
    steps: {
      1: "לשטוף את החסה",
      2: "לערבב את הרוטב ולהוסיף את הקרוטונים",
    },
  },
  {
    id: 9,
    name: "סושי ביתי",
    author: "איילת רבינוביץ",
    description: "רולים של סושי עם ירקות ודגים טריים.",
    labels: ["בישול", "דגים"],
    images: ["./img33.png", "img34.png", "img35.png", "img36.png"],
    ingredients: ["דפי אצות", "אורז סושי", "אבוקדו", "מלפפון", "סלמון טרי"],
    steps: {
      1: "לבשל את האורז",
      2: "לגלגל את הרולים ולחתוך",
    },
  },
  {
    id: 10,
    name: "בורקס גבינה",
    author: "גלית זמיר",
    description: "בורקס עם מילוי גבינה מתוק וחמאתי.",
    labels: ["בישול", "חלבי"],
    images: ["./img37.png", "img38.png", "img39.png", "img40.png"],
    ingredients: [
      "חבילת בצק עלים",
      "250 גרם גבינת קוטג'",
      "2 ביצים",
      "כף סוכר",
    ],
    steps: {
      1: "לערבב את הגבינה והביצים",
      2: "למלא את הבצק ולאפות",
    },
  },
  {
    id: 11,
    name: "קרפ צרפתי",
    author: "יונתן שרגא",
    description: "קרפ קליל במילוי שוקולד ונוטלה.",
    labels: ["בישול", "חלבי"],
    images: ["./img41.png", "img42.png", "img43.png", "img44.png"],
    ingredients: [
      "כוס קמח",
      "2 ביצים",
      "כף שמן",
      "1/2 כוס חלב",
      "כף סוכר",
      "שוקולד מרוח",
    ],
    steps: {
      1: "לערבב את הבלילה",
      2: "לטגן ולהגיש עם שוקולד",
    },
  },
  {
    id: 12,
    name: "עוגת שוקולד",
    author: "מאיה אלוני",
    description: "עוגת שוקולד עסיסית עם ציפוי גנאש.",
    labels: ["קינוח", "חלבי"],
    images: ["./img45.png", "img46.png", "img47.png", "img48.png"],
    ingredients: [
      "2 כוסות קמח",
      "חבילת שוקולד מריר",
      "כוס סוכר",
      "3 ביצים",
      "חצי כוס שמנת מתוקה",
    ],
    steps: {
      1: "לערבב את הבלילה",
      2: "לאפות ולצפות בגנאש",
    },
  },
  {
    id: 13,
    name: "מרק עדשים",
    author: "ירון לביא",
    description: "מרק חורפי מזין עם עדשים ירוקות וגזרים.",
    labels: ["בישול", "טבעוני"],
    images: ["./img49.png", "img50.png", "img51.png", "img52.png"],
    ingredients: [
      "כוס עדשים ירוקות",
      "3 גזרים",
      "2 שיני שום",
      "בצל אחד",
      "כפית כמון",
      "כף שמן זית",
    ],
    steps: {
      1: "לבשל את העדשים והירקות",
      2: "לתבל ולהגיש",
    },
  },
  {
    id: 14,
    name: "פשטידת ברוקולי",
    author: "שרית כהן",
    description: "פשטידת ברוקולי קלילה וטעימה.",
    labels: ["בישול", "צמחוני"],
    images: ["./img53.png", "img54.png", "img55.png", "img56.png"],
    ingredients: [
      "חבילת ברוקולי קפוא",
      "3 ביצים",
      "כוס גבינת קוטג'",
      "כף שמן זית",
      "מלח ופלפל",
    ],
    steps: {
      1: "לערבב את החומרים",
      2: "לאפות בתנור עד להזהבה",
    },
  },
  {
    id: 15,
    name: "קציצות בשר ברוטב עגבניות",
    author: "אביב ארזי",
    description: "קציצות בשר רכות ברוטב עגבניות ביתי.",
    labels: ["בישול", "בשרי"],
    images: ["./img57.png", "img58.png", "img59.png", "img60.png"],
    ingredients: [
      "500 גרם בשר טחון",
      "בצל מגורד",
      "2 שיני שום",
      "רוטב עגבניות",
      "כף פפריקה",
      "כפית כמון",
    ],
    steps: {
      1: "לעצב את הקציצות",
      2: "לטגן ולבשל ברוטב",
    },
  },
  // להמשיך עם עוד דוגמאות בהתאם לצורך
];

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* עמוד ברירת מחדל - כלל המתכונים */}
          <Route path="/" element={<RecipeBrowser recipes={sampleRecipes} />} />

          {/* עמוד צפייה במתכון יחיד */}
          <Route path="/recipe/:id" element={<RecipeViewWrapper />} />
        </Routes>
      </div>
    </Router>
  );
}

// פונקציה שעוטפת את RecipeView ומעבירה את המתכון לפי ה-ID מה-URL
function RecipeViewWrapper() {
  const { id } = useParams();
  const recipe = sampleRecipes.find((recipe) => recipe.id === parseInt(id));

  if (!recipe) {
    return <div>המתכון לא נמצא</div>;
  }

  return <RecipeView recipe={recipe} />;
}

export default App;
