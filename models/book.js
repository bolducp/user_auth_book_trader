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
  genre: String
});

var Book = mongoose.model('Book', bookSchema);

module.exports = Book;
