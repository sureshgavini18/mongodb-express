
import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import 'dotenv/config';

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 7000;

// Select MongoDB connection
const mongoUrl =
  process.env.MONGODB_URI ||
  process.env.DOCKER_MONGODB_URI;

const dbName = 'library_db';

if (!mongoUrl) {
  console.error('MongoDB connection string is missing!');
  process.exit(1);
}

const client = new MongoClient(mongoUrl);

let booksCollection;

// Connect to MongoDB
async function connectDB() {
  try {
    await client.connect();

    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    booksCollection = db.collection('books');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Home route
app.get('/', (req, res) => {
  res.send('Books API is running successfully!');
});

// CREATE BOOK
app.post('/api/v1/books', async (req, res) => {
  try {
    const result = await booksCollection.insertOne(req.body);

    res.status(201).json({
      message: 'Book created successfully',
      data: { _id: result.insertedId, ...req.body }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET ALL BOOKS
app.get('/api/v1/books', async (req, res) => {
  try {
    const books = await booksCollection.find({}).toArray();

    res.status(200).json({
      message: 'Books fetched successfully',
      data: books
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET BOOK BY ID
app.get('/api/v1/books/:id', async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid book ID' });
    }

    const book = await booksCollection.findOne({
      _id: new ObjectId(req.params.id)
    });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json({
      message: 'Book fetched successfully',
      data: book
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE BOOK
app.put('/api/v1/books/:id', async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid book ID' });
    }

    const result = await booksCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json({
      message: 'Book updated successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE BOOK
app.delete('/api/v1/books/:id', async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid book ID' });
    }

    const result = await booksCollection.deleteOne({
      _id: new ObjectId(req.params.id)
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json({
      message: 'Book deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start application
connectDB();