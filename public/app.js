function displayResults(news)
// First, empty the table
$("tbody").empty();

// Then, for each entry of that json...
news.forEach(function(news) {
  // Append each of the animal's properties to the table
  var tr = $("<tr>").append(
    $("<td>").text(news.headline),
    $("<td>").text(news.link),
    $("<td>").text(news.summary),  
  );
  $("tbody").append(tr);
});

// 1: On Load
// ==========

// First thing: ask the back end for json with all scraped news
$.getJSON("/all", function(data) {
    // Call our function to generate a table body
    displayResults(data);
  });
  
