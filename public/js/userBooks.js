'use strict';

$(document).ready(init);

function init() {
  $('table').on('click', '#changeStatus', toggleStatus);
};

function toggleStatus(){
  var bookId = $(this).closest('tr').data('book');

  $.ajax({
    method: "PUT",
    url: "/profile/userBooks",
    data: {bookId: bookId}
  }).success(function(data){
    location.href = "/profile/userBooks"
  }).fail(function(err){
    console.log("err ", err);
  })
}
