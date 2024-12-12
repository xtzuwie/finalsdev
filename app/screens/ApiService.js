import axios from "axios";

// Open Library API
const fetchOpenLibraryBooks = async (query) => {
  try {
    const response = await axios.get(
      `https://openlibrary.org/search.json?q=${query}`
    );
    return response.data.docs; // Returns an array of books
  } catch (error) {
    console.error("Error fetching books from Open Library:", error);
    throw error;
  }
};

// Google Books API
const fetchGoogleBooks = async (query, apiKey) => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}`
    );
    return response.data.items; // Returns an array of books
  } catch (error) {
    console.error("Error fetching books from Google Books:", error);
    throw error;
  }
};

export { fetchOpenLibraryBooks, fetchGoogleBooks };
