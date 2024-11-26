import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import cors from "cors";
import bodyParser from "body-parser";
import { error, log } from "console";
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

    await createTables(); // יצירת הטבלה
  } catch (error) {
    console.error("Error connecting to database:", error);
    process.exit(1); // סגירת התהליך אם החיבור נכשל
  }
})();

app.use(express.json()); // For parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000", // הכתובת של צד הלקוח (React)
  })
); // Enable CORS
app.use("/images", express.static(path.join(__dirname, "images"))); // הגדרת express.static לשירות התמונות מתוך תיקיית images

const upload = multer({ dest: "/upload-temp" }); //folder to save the images befor move to new folder base on the name of the recipe+id

const deleteImages = (dirname) => {
  if (fs.existsSync(recipeDir)) {
    fs.rmSync(recipeDir, { recursive: true, force: true });
    console.log(`Deleted recipes images from: ###${recipeDir}###`);
    return 1;
  }
  return 0;
};

const saveImages = (recipeDir, images) => {
  fs.mkdirSync(recipeDir, { recursive: true });

  images.forEach((image, index) => {
    const ext = path.extname(image.originalname);
    const newFileName = `${recipeName}-${index + 1}${ext}`;
    const destPath = path.join(recipeDir, newFileName);

    fs.renameSync(image.path, destPath);
  });
};

//create the DB table if not exsist
async function createTables() {
  const createRecipesTableQuery = `
    CREATE TABLE IF NOT EXISTS recipes (
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      name TEXT,
      author TEXT,
      description TEXT,
      ingredients TEXT[],
      steps TEXT[]
    );
  `;
  const createLabelsTableQuery = `
    CREATE TABLE IF NOT EXISTS labels (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE
    );
  `;
  const createRecipesLabelsTableQuery = `
  CREATE TABLE IF NOT EXISTS recipe_labels (
    recipe_id INT NOT NULL,
    label_id INT NOT NULL,
    PRIMARY KEY (recipe_id, label_id),
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    FOREIGN KEY (label_id) REFERENCES labels(id) ON DELETE CASCADE
  );
`;

  try {
    await db.query(createRecipesTableQuery);
    await db.query(createLabelsTableQuery);
    await db.query(createRecipesLabelsTableQuery);
    console.log("Tables created or already exists.");
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
  const ingredients = JSON.parse(recipe.ingredients);
  const steps = JSON.parse(recipe.steps);

  try {
    const result = await db.query(
      `INSERT INTO recipes (name, author, description, ingredients, steps)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, author, description, ingredients || [], steps || []]
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
    const recipes = (
      await db.query(
        `SELECT 
          r.id ,
          r.name ,
          r.author,
          r.description,
          r.ingredients, 
          r.steps,       
        ARRAY_AGG(l.name) AS labels
          FROM 
            recipes r
          LEFT JOIN 
            recipe_labels rl ON r.id = rl.recipe_id
          LEFT JOIN 
            labels l ON rl.label_id = l.id
          GROUP BY 
            r.id;`
      )
    ).rows;

    if (!recipes) {
      return res.status(404).json({ error: "Recipes not found" });
    }
    const recipesWithImages = recipes.map((recipe) => {
      const recipeDir = path.join(
        __dirname,
        "images",
        `${recipe.name}-${recipe.id}`
      );

      let firstImageUrl = null;
      if (fs.existsSync(recipeDir)) {
        const images = fs.readdirSync(recipeDir);
        if (images.length > 0) {
          const recipeName = encodeURIComponent(recipe.name);

          firstImageUrl = `/images/${recipeName}-${recipe.id}/${images[0]}`; // הנתיב של התמונה הראשונה
        }
      }

      return {
        ...recipe,
        firstImageUrl,
      };
    });

    res.json(recipesWithImages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch recipes." });
  }
});

app.get("/get-recipe/:id", async (req, res) => {
  try {
    const recipe = (
      await db.query(
        `SELECT 
          r.id ,
          r.name ,
          r.author,
          r.description,
          r.ingredients, 
          r.steps, 
          ARRAY_AGG(l.name) AS labels
        FROM 
            recipes r
        LEFT JOIN 
            recipe_labels rl ON r.id = rl.recipe_id
        LEFT JOIN 
            labels l ON rl.label_id = l.id
        WHERE 
            r.id = $1
        GROUP BY 
            r.id;`,
        [req.params.id]
      )
    ).rows[0];

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    const recipeDir = path.join(
      __dirname,
      "images",
      `${recipe.name}-${recipe.id}`
    );
    let images = [];

    if (fs.existsSync(recipeDir)) {
      // קריאת כלל התמונות בתיקיית המתכון
      images = fs.readdirSync(recipeDir).map((image) => {
        const recipeName = encodeURIComponent(recipe.name);
        return `/images/${recipeName}-${recipe.id}/${image}`;
      });
    }

    res.json({
      ...recipe,
      images, // מערך נתיבי התמונות
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch recipes." });
  }
});

app.get("/get-labels", async (req, res) => {
  try {
    const labelsJson = await db.query("SELECT name FROM labels");
    const labels = labelsJson.rows.map((label) => {
      return label.name;
    });

    res.json(labels);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch labels." });
  }
});

app.post("/new-recipe", upload.array("images"), async (req, res) => {
  const images = req.files;
  const recipeName = req.body.name;
  try {
    // Insert the new recipe into the 'recipes' table

    const recipeId = await insertRecipe(req.body); //save the recipe data to DB and get back the id

    //save the labels of the recipe
    const labels = JSON.parse(req.body.labels);
    const labelIds = [];
    for (const label of labels) {
      const labelResult = await db.query(
        "INSERT INTO labels (name) VALUES ($1) ON CONFLICT (name) DO NOTHING RETURNING id",
        [label]
      );
      if (labelResult.rows.length > 0) {
        labelIds.push(labelResult.rows[0].id);
      } else {
        const existingLabelResult = await db.query(
          "SELECT id FROM labels WHERE name = $1",
          [label]
        );
        labelIds.push(existingLabelResult.rows[0].id);
      }
    }

    // Link labels to the recipe
    for (const labelId of labelIds) {
      await db.query(
        "INSERT INTO recipe_labels (recipe_id, label_id) VALUES ($1, $2)",
        [recipeId, labelId]
      );
    }

    const recipeDir = path.join(
      __dirname,
      "images",
      `${recipeName}-${recipeId}`
    );
    saveImages(recipeDir, images); //save the images in folder for the current recipe

    // Respond with the newly created recipe
    res.status(201).json({ message: "Recipe images save successfully!" });
  } catch (error) {
    console.error("Error inserting recipe:", error);
    res.status(500).json({ error: "Failed to save the recipe" });
  }
});

app.put("/update-recipe/:id", async (req, res) => {
  console.log("start update");
  
  console.log(req.body);
});

app.delete("/delete-recipe/:id", async (req, res) => {
  try {
    const recipeId = req.params.id;
    const recipeName = (
      await db.query("SELECT name FROM recipes WHERE id=$1", [recipeId])
    ).rows[0].name;
    console.log(recipeName);

    console.log(`try to delete recipe: ${recipeId}`);

    // check if the labels of the deleted recipe are relevent or need to be deleted

    const recipeLabels = (
      await db.query(
        "SELECT (label_id) FROM recipe_labels WHERE recipe_id=$1",
        [recipeId]
      )
    ).rows.map((row) => row.label_id); //Saves the id of the labels associated with the recipe that will now be deleted
    console.log(recipeLabels);

    // delete recipe from DB and the relevent data in recipe_label will be deleted whit it
    const deletedRecipe = await db.query(
      "DELETE FROM recipes WHERE id=$1 RETURNING *",
      [recipeId]
    );
    if (deletedRecipe.rowCount === 0) throw Error("Recipe not found");
    console.log(`Deleted recipe ---${recipeName}--- from DB`);

    //after delete the recipe search for label that are not associated to any recipe and delete them(there not relevent any more)

    for (const labelId of recipeLabels) {
      const labelCount = (
        await db.query(
          "SELECT COUNT(*) AS count FROM recipe_labels WHERE label_id = $1",
          [labelId]
        )
      ).rows[0].count;

      if (parseInt(labelCount, 10) === 0) {
        console.log(`delete - labelID:${labelId} - count:${labelCount}`);
        await db.query("DELETE FROM labels WHERE id = $1", [labelId]);
      }
    }
    // delete the labels that are not relevent

    // delete the images
    const recipeDir = path.join(
      __dirname,
      "images",
      `${recipeName}-${recipeId}`
    );
    if (deleteImages(recipeDir) === 0)
      throw Error("error delete recipe dir - not exsist ");

    res.json({
      message: "Recipe deleted successfully",
      recipe: recipeLabels,
    });
  } catch (err) {
    console.log(`##### Error in delete recipe - ${err.message} #####`);
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
