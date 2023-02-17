const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  const matchedUsers = users.filter(user => user.username === username)
  return matchedUsers.length > 0
}

const authenticatedUser = (username,password)=>{ //returns boolean
  const matchedUsers = users.filter(
    user => user.username === username && user.password === password
  )
  return matchedUsers.length > 0
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username) {
    return res.status(404).json({message: "Username not provided!"});    
  }
  if (!password) {
    return res.status(404).json({message: "Password not provided!"});    
  }
  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({data: password}, 
                              'access', { expiresIn: 60 * 60 });
    req.session.authorization = { accessToken,username }
    return res.status(200).send("User successfully logged in.");
  }
  return res.status(208).json({message: "Invalid Login!"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization.username
  if (books[req.params.isbn]) {
    books[req.params.isbn].reviews[username] = req.body.review
    return res.status(200).send('Review successfully posted')
  } else {
    return res.status(404).json({message: `ISBN not found`})
  }
});

// Delete a book review
regd_users.delete('/auth/review/:isbn', (req, res) => {
  if (books[req.params.isbn]) {
    delete books[req.params.isbn].reviews[req.session.authorization.username]
    return res.status(200).send('Review successfully deleted')
  } else {
    return res.status(404).json({message: `ISBN not found`})
  }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
