'use strict';

$(document).ready(init);

var $rows;

function init() {
  $('table').on('click', '#changeStatus', toggleStatus);
  $rows = $('.dataRow');
  $('table').on('click', '#title', sortByTitle);
  $('table').on('click', '#author', sortByAuthor);
  $('table').on('click', '#genre', sortByGenre);
  $('table').on('click', '#available', sortByAvailable);
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

function sortByTitle() {
  var $this = $(this);
  sortby('.title', $this);
}
function sortByAuthor() {
  var $this = $(this);
  sortby('.author', $this);
}
function sortByGenre() {
  var $this = $(this);
  sortby('.genre', $this);
}
function sortByAvailable() {
  var $this = $(this);
  sortby('.available', $this);
}

function sortby(field, $this) {
	var mult = $this.data('sort');
	$rows.sort(function(a,b) {
		var aVal = $(a).children(field).text().toLowerCase();
		var bVal = $(b).children(field).text().toLowerCase();
		return ((aVal<bVal) ? -1 : 1) * mult;
	});
	$this.data('sort', -mult);
	$('tbody').empty().append($rows);
}
