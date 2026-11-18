const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (isValid(username)) {
    users.push({ username, password });
    return res.status(200).json({ message: "User successfully registered. Now you can login" });
  }
  return res.status(409).json({ message: "User already exists!" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  }
  return res.status(404).json({ message: "Book not found" });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const matchingBooks = Object.values(books).filter((b) => b.author === author);
  return res.status(200).json({ booksbyauthor: matchingBooks });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const matchingBooks = Object.values(books).filter((b) => b.title === title);
  return res.status(200).json({ booksbytitle: matchingBooks });
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }
  return res.status(404).json({ message: "Book not found" });
});

// Task 10: Get all books using async/await with Axios
async function getAllBooks() {
  try {
    const response = await axios.get('http://localhost:5000/');
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}

// Task 11: Get book details by ISBN using Promises with Axios
function getBookByISBN(isbn) {
  axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then(response => console.log(response.data))
    .catch(error => console.error(error));
}

// Task 12: Get book details by Author using async/await with Axios
async function getBooksByAuthor(author) {
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}

// Task 13: Get book details by Title using async/await with Axios
async function getBooksByTitle(title) {
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}

module.exports.general = public_users;
