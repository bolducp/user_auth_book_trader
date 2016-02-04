'use strict';

$(function() {
  //$('table').on('click', '.accept', acceptTrade);
  $('table').on('click', '.decline', declineTrade);
  $('table').on('click', '.cancel', cancelTrade);
});

function tradeDenied(result, tradeId) {
  console.log(tradeId);
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

function declineTrade(){
  var tradeId = $(this).closest('tr').data('trade');
  console.log(tradeId);
  tradeDenied('declined', tradeId);
}

function cancelTrade() {
  var tradeId = $(this).closest('tr').data('trade');
  console.log(tradeId);
  tradeDenied('cancelled', tradeId);
}
