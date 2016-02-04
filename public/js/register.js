'use strict';

var $email, $password, $password2;

$(function() {
  $('form').on('submit', registerUser);
  console.log("init! here!");
});

function registerUser(e) {
  e.preventDefault();

  var email = $('#email').val();
  var password = $('#password').val();
  var password2 =$('#password2').val();
  var username = $('#username').val();
  var phone = $('#phone').val();
  var favorites = $('#favorites').val();


  if(password !== password2) {
    $('.password').val('');
    return alert('Passwords must match.');
  }

  var newUser = {email: email, password: password, username: username, phone: phone, favorites: favorites};

  $.post('/users/register', newUser)
  .success(function() {
    location.href = '/login';
  })
  .fail(function(err) {
    alert('Error.  Check console.');
    console.log('err:', err);
  });
}
