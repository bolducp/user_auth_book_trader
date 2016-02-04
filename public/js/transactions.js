'use strict';

$(function() {
  $('table').on('click', '.accept', acceptTrade);
  $('table').on('click', '.decline', declineTrade);
  $('table').on('click', '.cancel', cancelTrade);
});

function acceptTrade() {
  var tradeId = $(this).closest('tr').data('trade');
  console.log(tradeId);
  $.ajax({
    method: "PUT",
    url: "/profile/transactions/accepted",
    data: {tradeId: tradeId}
  }).success(function(data){
    console.log("accepted?");
    location.href="/profile/transactions";
  })
  .fail(function(err){
    console.log("error accepting transaction", err);
  });
}

function declineTrade(){
  var tradeId = $(this).closest('tr').data('trade');
  tradeDenied('declined', tradeId);
}

function cancelTrade() {
  var tradeId = $(this).closest('tr').data('trade');
  tradeDenied('cancelled', tradeId);
}

function tradeDenied(result, tradeId) {
  $.ajax({
    method: "PUT",
    url: "/profile/transactions",
    data: {tradeId: tradeId, result: result}
  }).success(function(data){
    console.log("declined");
    location.href="/profile/transactions";
  })
  .fail(function(err){
    console.log("error deleting transaction", err);
  });
}
