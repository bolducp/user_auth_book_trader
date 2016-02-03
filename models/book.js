'use strict';

var mongoose = require('mongoose');

var bookSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  title: String,
  author: String,
  isbn: Number,
  genre: String,
  available: {type: Boolean, default: true},
  photoUrl: {type: String, default: "http://i.imgur.com/sJ3CT4V.gif"}
});

var Book = mongoose.model('Book', bookSchema);

module.exports = Book;
