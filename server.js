import express from "express";
import { MongoClient, ObjectId } from "mongodb";

const app = express();
const port = 3000;

const mongoUrl =
  "mongodb://admin:12345@localhost:27017/?authSource=admin";
const databaseName = "library_db";

const client = new MongoClient(mongoUrl);
let db;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
async function connectDB() {
  try {
    await client.connect();
    db = client.db(databaseName);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  }
}

// CREATE: Insert a new book
app.post("/api/v1/books", async (req, res, next) => {
  try {
    const { title, author, category, price } = req.body;

    if (
      !title ||
      !author ||
      !category ||
      price === undefined ||
      price === null ||
      price === "" ||
      !Number.isFinite(Number(price)) ||
      Number(price) < 0
    ) {
      return res.status(400).json({
        message: "Valid title, author, category and price are required"
      });
    }

    const book = {
      title,
      author,
      category,
      price: Number(price)
    };

    const result = await db.collection("books").insertOne(book);

    res.status(201).json({
      message: "Book created successfully",
      data: { _id: result.insertedId, ...book }
    });
  } catch (err) {
    next(err);
  }
});

// READ: Get all books, optionally filter by category
app.get("/api/v1/books", async (req, res, next) => {
  try {
    const category = req.query.category;
    const query = category ? { category } : {};

    const books = await db
      .collection("books")
      .find(query)
      .toArray();

    res.status(200).json({
      message: "Books fetched successfully",
      data: books
    });
  } catch (err) {
    next(err);
  }
});

// READ: Get a single book by ID
app.get("/api/v1/books/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }

    const book = await db.collection("books").findOne({
      _id: new ObjectId(id)
    });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({
      message: "Book fetched successfully",
      data: book
    });
  } catch (err) {
    next(err);
  }
});

// UPDATE: Update a book by ID
app.put("/api/v1/books/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, author, category, price } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }

    if (
      !title ||
      !author ||
      !category ||
      price === undefined ||
      price === null ||
      price === "" ||
      !Number.isFinite(Number(price)) ||
      Number(price) < 0
    ) {
      return res.status(400).json({
        message: "Valid title, author, category and price are required"
      });
    }

    const updatedBook = {
      title,
      author,
      category,
      price: Number(price)
    };

    const result = await db.collection("books").updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedBook }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({
      message: "Book updated successfully",
      data: { _id: id, ...updatedBook }
    });
  } catch (err) {
    next(err);
  }
});

// DELETE: Delete a book by ID
app.delete("/api/v1/books/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }

    const result = await db.collection("books").deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({
      message: "Book deleted successfully"
    });
  } catch (err) {
    next(err);
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    message: err.message || "Internal Server Error"
  });
});

// Start server after connecting to MongoDB
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
});