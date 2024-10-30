import express from "express";
import pg from "pg";
import cors from "cors";
import bodyParser from "body-parser";

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

async function createTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS recipes (
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      name TEXT,
      author TEXT,
      description TEXT,
      labels TEXT[],
      images TEXT[],
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
  const { name, author, description, labels, images, ingredients, steps } =
    recipe;

  try {
    const result = await db.query(
      `INSERT INTO recipes (name, author, description, labels, images, ingredients, steps)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        name,
        author,
        description,
        labels || [],
        images || [],
        ingredients || [],
        steps || [],
      ]
    );
    console.log(`Recipe insert to db`);
    return result;
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

app.post("/new-recipe", async (req, res) => {
  try {
    // Insert the new recipe into the 'recipes' table
    result = insertRecipe(req.body);

    // Respond with the newly created recipe
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error inserting recipe:", error);
    res.status(500).json({ error: "Failed to save the recipe" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
