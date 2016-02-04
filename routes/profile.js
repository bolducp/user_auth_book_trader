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
    Trade.find({offeringUser: req.user._id, status: 'pending'}, function(err, offeredTrades) {
      if (err) return res.status(400).send("error finding offered trades",err);
      Trade.find({receivingUser: req.user._id, status: {$ne:'pending'}}, function(err, pastReceivedTrades) {
        if (err) return res.status(400).send("error finding past received trades",err);
        Trade.find({offeringUser: req.user._id, status: {$ne:'pending'}}, function(err, pastOfferedTrades) {
          if (err) return res.status(400).send("error finding past offered trades",err);
          res.render('transactions', {receivedTrades: receivedTrades, offeredTrades: offeredTrades, pastReceivedTrades: pastReceivedTrades, pastOfferedTrades: pastOfferedTrades});
        }).populate('offeredBook desiredBook receivingUser');
      }).populate('offeredBook desiredBook offeringUser');
    }).populate('offeredBook desiredBook receivingUser');
  }).populate('offeredBook desiredBook offeringUser');
});


router.put('/transactions', function(req, res){
  Trade.findById(req.body.tradeId, function(err, trade){
    if (err) return res.status(400).send("error finding trade", err);
    trade.status = req.body.result;
    trade.save(function(err, savedTrade){
      if (err) return res.status(400).send("error saving declined/cancelled trade", err);
      res.status(200).send("transaction declined/cancelled");
    });
  });
});

router.put('/transactions/accepted', function(req, res) {
  Trade.findById(req.body.tradeId, function(err, acceptedTrade){
    if (err) return res.status(400).send("error finding trade", err);
    console.log(acceptedTrade);
    Book.findById(acceptedTrade.offeredBook, function(err, offBook) {
      if (err) return res.status(400).send("error finding offered book", err);
      Book.findById(acceptedTrade.desiredBook, function(err, desBook) {
        if (err) return res.status(400).send("error finding offered book", err);
        var temp = desBook.userId;
        desBook.userId = offBook.userId;
        offBook.userId = temp;
        acceptedTrade.status = 'accepted';
        desBook.save(function(err, savedResBook) {
          if (err) return res.status(400).send("error saving received book", err);
          offBook.save(function(err, savedOffBook) {
            if (err) return res.status(400).send("error saving offered book", err);
            acceptedTrade.save(function(err, savedResBook) {
              if (err) return res.status(400).send("error saving trade", err);
              Trade.where( {status: 'pending', $or:[ {offeredBook: acceptedTrade.offeredBook},
                {offeredBook: acceptedTrade.desiredBook}, {desiredBook: acceptedTrade.offeredBook},
                {desiredBook: acceptedTrade.desiredBook} ]})
                .update({status: 'trade expired'}, function(err, updatedBooks) {
                  if (err) return res.status(400).send("error updating books", err);
                  res.send('ok');
                })
            });
          });
        });
      });
    });
  });
});



module.exports = router;
