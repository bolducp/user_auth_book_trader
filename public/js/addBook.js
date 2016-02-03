'use strict';

$(function() {
  $('form').on('submit', addBook);
});

function addBook(e) {
  e.preventDefault();
  var newBook = {};
  newBook.title = $('#title').val();
  newBook.author = $('#author').val();
  newBook.isbn = $('#isbn').val();
  newBook.genre = $('#genre').val();

  $.post('/profile/addBook', newBook)
  .success(function(data) {
    location.href = '/';
  }).
  fail(function(err) {
    console.log('error adding book:', err);
  });
}
