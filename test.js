
const baseUrl = "http://localhost:7000/api/v1/books";

async function testAPI() {
  try {
    // Create a book
    const createResponse = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "The Alchemist",
        author: "Paulo Coelho",
        category: "Fiction",
        price: 350,
      }),
    });

    const createdBook = await createResponse.json();
    console.log("Create book:", createdBook);

    // Get all books
    const getResponse = await fetch(baseUrl);
    const books = await getResponse.json();
    console.log("All books:", books);

    // Filter books by category
    const filterResponse = await fetch(`${baseUrl}?category=Fiction`);
    const filteredBooks = await filterResponse.json();
    console.log("Filtered books:", filteredBooks);
  } catch (error) {
    console.error("API test failed:", error.message);
  }
}

testAPI();