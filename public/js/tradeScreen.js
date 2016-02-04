'use strict';

$(function() {
  $('button').on('click', offerTrade);
});

function offerTrade() {
  // console.log($("#offeredBook option:selected").data('bookdesired'));
  // console.log($("#offeredBook").data('bookoffered'));
  var bookIds = {};
  bookIds.offeredBookId = $("#offeredBook option:selected").data('bookdesired');
  bookIds.desiredBookId = $("#offeredBook").data('bookoffered');
  console.log(bookIds.offeredBookId);
  console.log(bookIds.desiredBookId);
  $.post('/profile/createOffer', bookIds)
  .success(function(data) {
    console.log('offer created');
    location.href='/profile/transactions';
  })
  .fail(function(err) {
    console.log('error creating offer', err);
  })
}
