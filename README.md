
# MongoDB Express Books API

A simple REST API built using Node.js, Express.js, and MongoDB to manage books.

## Requirements

- Node.js 18 or later
- Docker Desktop
- npm

## Installation

Clone the repository:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Open the project folder:

```bash
cd mongodb-express-app
```

Install dependencies:

```bash
npm install
```

## Start MongoDB

Run this command:

```bash
docker compose up -d
```

## Start the Express server

```bash
npm start
```

The server runs at:

http://localhost:7000

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/v1/books | Create a book |
| GET | /api/v1/books | Get all books |
| GET | /api/v1/books?category=fiction | Filter books by category |
| GET | /api/v1/books/:id | Get a book by ID |
| PUT | /api/v1/books/:id | Update a book |
| DELETE | /api/v1/books/:id | Delete a book |

## Database

- Database name: `library_db`
- Collection name: `books`

## Note

The MongoDB connection settings in `app.js` are for local development with the supplied Docker Compose configuration.