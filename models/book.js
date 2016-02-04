'use strict';

var mongoose = require('mongoose');

var bookSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {type: String, default: 'title unknown'},
  author: {type: String, default: 'author unknown'},
  isbn: {type: Number, default: 0},
  genre: {type: String, default: 'genre unknown'},
  available: {type: Boolean, default: true},
  photoUrl: {type: String, default: "http://i.imgur.com/sJ3CT4V.gif"}
});

var Book = mongoose.model('Book', bookSchema);

module.exports = Book;
