'use strict';

var Firebase = require('firebase');
var express = require('express');

var router = express.Router();

var authMiddleware = require('../config/auth');
var User = require('../models/user');

var ref = new Firebase('https://book-trading.firebaseio.com/');

/* POST to create new user */
router.post('/register', function(req, res, next) {
  console.log(req.body);
  ref.createUser({email: req.body.email, password: req.body.password}, function(err, userData) {
    if(err) return res.status(400).send(err);
    var user = new User({
      uid: userData.uid,
      email: req.body.email,
      username: req.body.username,
      phone: req.body.phone,
      favorites: req.body.favorites
    });
     user.save(function(err, savedUser) {
      res.send("savedUser");
    });
  });
});


/* POST to log in */
router.post('/login', function(req, res, next) {
  ref.authWithPassword(req.body, function(err, authData) {
    if(err) return res.status(400).send(err);
    User.findOne({uid: authData.uid}, function(err, user) {
      var token = user.generateToken();
      res.cookie('mytoken', token).send("token, ", token);
    });
  });
});


router.get('/resetPassword', function(req, res, next){
  res.render('resetPassword');
});



/* POST request to reset password */
router.post('/resetPassword', function(req, res, next){
  console.log(req.body.email);
  ref.resetPassword({
    email: req.body.email
  }, function(error) {
    if (error) {
      res.status(400).send(error);
    } else {
      res.send("sent!");
    }
  });
});

/* POST request to change user password */
router.post('/changePassword', function(req, res, next){
  ref.changePassword({
    email: req.body.email,
    oldPassword: req.body.oldPassword,
    newPassword: req.body.newPassword,
  }, function(error) {
    if (error) {
      res.status(400).send(error);
    } else {
      res.send("password changed");
    }
  });
});
//

/* GET request to clear cookies to log a user out */
router.get('/logout', function(req, res, next) {
  res.clearCookie('mytoken').redirect('/');
});


module.exports = router;
