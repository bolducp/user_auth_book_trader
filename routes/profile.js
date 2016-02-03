'use strict';

var express = require('express');
var router = express.Router();

var authMiddleware = require('../config/auth');

var User = require('../models/user');
var Book = require('../models/book');
var Trade = require('../models/trade');

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
    if (err) return res.status(400).send(err);
    Book.find({userId: req.user._id, available: true}, function(err, userBooks){
      if (err) return res.status(400).send(err);
      res.render('tradeScreen', {book:book, userBooks: userBooks});
    });
  });
});

router.post('/createOffer', function(req, res) {
  var trade = new Trade();
  trade.offeredBook = req.body.offeredBookId;
  trade.desiredBook  = req.body.desiredBookId;
  Book.findById(trade.offeredBook, function(err, offerBook){
    if (err) return res.status(400).send("error finding offered book",err);
    trade.offeringUser = offerBook.userId;
    Book.findById(trade.desiredBook, function(err, desireBook){
      if (err) return res.status(400).send("error finding desired book", err);
      trade.receivingUser = desireBook.userId;
      trade.save(function(err, savedTrade) {
        if (err) return res.status(400).send("error saving", err);
        Trade.findById(savedTrade._id, function(err, newTrade) {
          res.status(200).send(savedTrade);
        });
      });
    });
  });
});

router.get('/transactions', function(req, res) {
  Trade.find({receivingUser: req.user._id, status: 'pending'}, function(err, receivedTrades) {
    if (err) return res.status(400).send("error finding recieved trades",err);
    res.render('transactions', {receivedTrades: receivedTrades});
  }).populate('offeredBook desiredBook offeringUser');
  // res.render('transactions', 'stuff');
})


module.exports = router;
