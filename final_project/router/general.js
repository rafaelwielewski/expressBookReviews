const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


//************************ ASYNC FUNCTIONS *****************************
const getBooksAsync = async () => {
  try {
    const response = await axios.get('http://localhost:5000')
    console.log(response.data)
  } catch (error) {
    console.log(error)
  }
}

const getBooksDetailsByISBNAsync = async isbn => {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`)
    console.log(response.data)
  } catch (error) {
    console.log(error)
  }
}

const getBooksDetailsByAuthorAsync = async author => {
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`)
    console.log(response.data)
  } catch (error) {
    console.log(error)
  }
}

const getBooksDetailsByTitleAsync = async title => {
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`)
    console.log(response.data)
  } catch (error) {
    console.log(error)
  }
}

getBooksAsync();
getBooksDetailsByISBNAsync(7);
getBooksDetailsByAuthorAsync("Chinua Achebe")
getBooksDetailsByTitleAsync("Fairy tales")


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username) {
    return res.status(404).json({message: "Username not provided!"});    
  }
  if (!password) {
    return res.status(404).json({message: "Password not provided!"});    
  }
  if (isValid(username)) { 
    return res.status(409).json({message: "Username already exists!"});    
  } 
  users.push({"username":username, "password":password});
  return res.status(200).json({message: "Username successfully registered."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));    
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  res.send(JSON.stringify(books[req.params.isbn], null, 4));
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author_books = [];
  for (let key in books) {
    if (books[key]["author"] == req.params.author) {
      author_books.push(books[key]);
    }
  }
  res.send(JSON.stringify(author_books, null, 4));  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title_books = [];
  for (let key in books) {
    if (books[key]["title"] == req.params.title) { 
      title_books.push(books[key]);
    }
  }
  res.send(JSON.stringify(title_books, null, 4)); 
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  res.send(JSON.stringify(books[req.params.isbn]["reviews"], null, 4)); 
});


module.exports.general = public_users;
