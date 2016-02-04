'use strict';

$(function() {
  $('form').on('submit', addBook);
});

function addBook(e) {
  e.preventDefault();
  var newBook = {};
  newBook.title = $('#title').val() || 'title unknown';
  newBook.author = $('#author').val() || 'author unknown';
  newBook.isbn = $('#isbn').val() || 0;
  newBook.genre = $('#genre').val() || 'n/a';
  newBook.photoUrl = $('#photoUrl').val() || "http://i.imgur.com/sJ3CT4V.gif";

  $.post('/profile/addBook', newBook)
  .success(function(data) {
    location.href = '/profile/userBooks';
  }).
  fail(function(err) {
    console.log('error adding book:', err);
  });
}
