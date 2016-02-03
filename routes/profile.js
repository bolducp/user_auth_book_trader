'use strict';

var express = require('express');
var router = express.Router();

var authMiddleware = require('../config/auth');

var User = require('../models/user');
var Book = require('../models/book');

router.use(authMiddleware);

/* GET user's profile page and display */
router.get('/', function(req, res, next){
  User.findById(req.user._id, function(err, user) {
    if (err) return res.status(400).send(err);
    res.render('profile', {user: user});
  });
});

router.get('/addBook', function(req, res) {
  res.render('addBook');
})

router.post('/addBook', function(req, res) {
  console.log('newbook:', req.body);
  console.log(req.user._id);
  var newBook = req.body;
  newBook.userId = req.user._id;
  Book.create(newBook, function(err, savedBook) {
    if (err) return res.status(400).send(err);
    res.status(200).send('book added');
  });
});

module.exports = router;
