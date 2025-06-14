const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  // Check if username is provided
  if (!username) {
    return res.status(400).json({message: "Username is required"});
  }

    // Check if username is provided
  if (!password) {
    return res.status(400).json({message: "Password is required"});
  }

  if (isValid(username)) {
    // Add the new user to the users array
    users.push({"username": username, "password": password});
    return res.status(200).json({message: "User successfully registered. Now you can login"});
  } else {
    return res.status(404).json({message: "User already exists!"});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  
  booksPromise = new Promise((resolve, reject) => {
    resolve(JSON.stringify(books, null, 2));
  });


  //Write your code here
  booksPromise.then((books) => {
     res.send(books); 
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let book = books[req.params.isbn]
  
  isbnPromise = new Promise((resolve, reject) => {
    if (book) {
      resolve(book);
    } else {
      reject("Book not found");
    }
  });

  isbnPromise.then((book) => {
    return res.status(200).json(book);
  }).catch((error) => {
    return res.status(404).json({message: error});
  });
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author;
  
  authorPromise = new Promise((resolve, reject) => {
    let booksByAuthor = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());
  
    if (booksByAuthor.length > 0) {
      resolve(booksByAuthor);
    } else {
      reject("No books found for this author");
    }      
  });

  authorPromise.then((booksByAuthor) => {
    return res.status(200).json(booksByAuthor);
  }).catch((error) => {
    return res.status(404).json({message: error});
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title;
  titlePriomise = new Promise((resolve, reject) => {
    let booksByTitle = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());
  
    if (booksByTitle.length > 0) {
      resolve(booksByTitle);
    } else {
      reject("No books found with this title");
    }
  });

  titlePriomise.then((booksByTitle) => {
    return res.status(200).json(booksByTitle);
  }).catch((error) => {
    return res.status(404).json({message: error});
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let book = books[isbn];

  if (book && book.reviews) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({message: "No reviews found for this book"});
  }
});

module.exports.general = public_users;
