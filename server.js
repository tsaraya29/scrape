//Require necessary packages
const mongojs = require("mongojs");
const axios = require('axios');
const cheerio = require('cheerio');
const express = require("express");
const path = require("path");
const exphbs  = require('express-handlebars');


const app = express();

// Database configuration
var databaseUrl = "WaPo";
var collections = ["scrapedData"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

//allows heroku to set port
const PORT = process.env.PORT || 3000;

//setup express handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
// app.use('/static', express.static('public'));
app.use(express.static('views/images')); 
   

//Routes
app.get('/', function (req, res) {
    res.render('home');
}); 

//Retrieve data from the db

app.get("/all", function(req,res){
    //Find all results in ScrapedDB
    db.scrapedData.find({}, function(error,found) {
        if(error){
            console.log(error);
        }
        else {
            res.json(found);
        }
    });
});
// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function(req, res) {
    const url = 'https://www.washingtonpost.com/';

    axios.get(url)
        .then(response => {
        // console.log(response.data);
        //use cheerio to parse data
            var $ = cheerio.load(response.data);
         // An empty array to save the data that we'll scrape
            var results = [];
         //use cheerio to find headlines

    $("div.headline").each(function(i, element) {
    var headline = $(element).text();
    // find child elements of headline div
    var link = $(element).children('a').attr('href');
    // console.log(response.data);
    var summary = $(element).children('div').find('headline').text();

    if (link && headline) {
        db.scrapedData.insert({
            headline:headline,
            link: link                
        },
    function(err, inserted) {
        if (err) {
            // Log the error if one is encountered during the query
            console.log(err);
        }
        else {
            // Otherwise, log the inserted data
            console.log(inserted);
        }
    });
    }        
            // results.push({
            //     headline: headline,
            //     link: link,
            //     summary: summary
            });            
        });
        // console.log(results);
        res.send("Scrape Complete"); 
    });
     


//Listener
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });