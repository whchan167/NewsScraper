//
// ======================

// When user clicks the comment sort button, display table sorted by weight
$("scraped").on("click", function() {
  // First, empty the table
  $("#results").empty();
  // Now do an api call to the back end for a json with all animals, sorted by weight
  $.getJSON("/news", function(data) {
    // For each entry of that json...
    $("#results").append("")
  });
});

