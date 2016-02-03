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
});

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

router.get('/userBooks', function(req, res) {
  Book.find({userId: req.user._id}, function(err, books) {
    if (err) return res.status(400).send(err);
    res.render('userBooks', {books: books});
  });
});


router.put('/userBooks', function(req, res){
  Book.findById(req.body.bookId, function(err, book){
    if (err) return res.status(400).send(err);
    book.available = !book.available;
    book.save(function(err, savedBook){
      if (err) return res.status(400).send(err);
      res.send("status changed");
    });
  });
});


router.get('/availableBooks', function(req, res){
  Book.find({userId: {$ne: req.user._id}, available: true }, function(err, books){
    if (err) return res.status(400).send(err);
    res.render('availableBooks', {books: books});
  });
});

router.get('/tradeScreen/:bookId', function(req, res) {
  Book.findById(req.params.bookId, function(err, book){
  console.log(book);
    if (err) return res.status(400).send(err);
    Book.find({userId: req.user._id, available: true}, function(err, userBooks){
      console.log(userBooks);
      if (err) return res.status(400).send(err);
      res.render('tradeScreen', {book:book, userBooks: userBooks});
    });
  });
});





module.exports = router;
