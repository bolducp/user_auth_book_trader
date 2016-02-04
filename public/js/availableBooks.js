'use strict';

$(document).ready(init);

var $rows;

function init() {
  $rows = $('.dataRow');
  $('table').on('click', '#title', sortByTitle);
  $('table').on('click', '#author', sortByAuthor);
  $('table').on('click', '#genre', sortByGenre);
};

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
