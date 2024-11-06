import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import cors from "cors";
import bodyParser from "body-parser";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = 3001;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Recipes",
  password: "159633",
  port: 55555,
});

// אתחול השרת ויצירת הטבלה
(async () => {
  try {
    await db.connect();
    console.log("Connected to PostgreSQL");

    await createTable(); // יצירת הטבלה
  } catch (error) {
    console.error("Error connecting to database:", error);
    process.exit(1); // סגירת התהליך אם החיבור נכשל
  }
})();

app.use(express.json()); // For parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors()); // Enable CORS

//setup file-system to save recipes images
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const recipeName = req.body.name;
//     const dir = `images/${recipeName}`;

//     // Create the folder if it doesn't exist
//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir, { recursive: true });
//     }

//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     const recipeName = req.body.name;
//     const ext = path.extname(file.originalname);

//     // Find the number of files already in the directory for sequential naming
//     const files = fs.readdirSync(`images/${recipeName}`);
//     const seqNumber = files.length + 1; // Next sequence number

//     cb(null, `${recipeName}-${seqNumber}${ext}`);
//   },
// });
const upload = multer({ dest: "/upload-temp" }); //folder to save the images befor move to new folder base on the name of the recipe+id

//create the DB table if not exsist
async function createTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS recipes (
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      name TEXT,
      author TEXT,
      description TEXT,
      labels TEXT[],
      ingredients TEXT[],
      steps TEXT[]
    );
  `;

  try {
    await db.query(createTableQuery);
    console.log("Table 'recipes' created or already exists.");
  } catch (error) {
    console.error("Error creating table:", error);
  }
}

// function to insert recipe to db
async function insertRecipe(recipe) {
  // console.log(JSON.parse(recipe.ingredients));

  const name = recipe.name;
  const author = recipe.author;
  const description = recipe.description;
  const labels = JSON.parse(recipe.labels);
  const ingredients = JSON.parse(recipe.ingredients);
  const steps = JSON.parse(recipe.steps);

  try {
    const result = await db.query(
      `INSERT INTO recipes (name, author, description, labels, ingredients, steps)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, author, description, labels || [], ingredients || [], steps || []]
    );
    console.log(`Recipe insert to db, recipe ID:`, result.rows[0]["id"]);
    return result.rows[0]["id"];
  } catch (error) {
    console.error("Error insert recipe to db: ", error);
  }
}

// טיפול בבקשה לנתיב "/"
app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT NOW()");
    res.json({
      message: "Database connected successfully",
      time: result.rows[0].now,
    });
  } catch (error) {
    res.status(500).json({ error: "Database connection failed" });
  }
});

app.get("/get-recipes", async (req, res) => {
  try {
    const recipes = await db.query("SELECT * FROM recipes");
    // console.log(recipes.rows);

    res.json(recipes.rows);
  } catch (error) {
    res.status(500).json({ error: "Database connection failed" });
  }
});

app.post("/new-recipe", upload.array("images"), async (req, res) => {
  const images = req.files;
  const recipeName = req.body.name;
  try {
    // Insert the new recipe into the 'recipes' table

    const recipeId = await insertRecipe(req.body); //save the recipe data to DB and get back the id

    const recipeDir = path.join(
      __dirname,
      "images",
      `${recipeName}-${recipeId}`
    );
    fs.mkdirSync(recipeDir, { recursive: true });

    images.forEach((image, index) => {
      const ext = path.extname(image.originalname);
      const newFileName = `${recipeName}-${index + 1}${ext}`;
      const destPath = path.join(recipeDir, newFileName);

      fs.renameSync(image.path, destPath);
    });
    // Respond with the newly created recipe
    res.status(201).json({ message: "Recipe images save successfully!" });
  } catch (error) {
    console.error("Error inserting recipe:", error);
    res.status(500).json({ error: "Failed to save the recipe" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
