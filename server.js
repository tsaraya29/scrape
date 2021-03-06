//Require necessary packages
const mongojs = require("mongojs");
const axios = require('axios');
const cheerio = require('cheerio');
const express = require("express");
// const path = require("path");
const exphbs  = require('express-handlebars');

const app = express();

const PORT = process.env.PORT || 3000;
//setup express handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
// app.use('/static', express.static('public'));
app.use(express.static('views/images')); 


// Database configuration
var databaseUrl = "WaPo";
var collections = ["scrapedData"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

//scrape data from WaPo
app.get("/scrape", function(req, res) {
const url = 'https://www.washingtonpost.com/';

axios.get(url)
    .then(response => {
        //use cheerio to parse data
        var $ = cheerio.load(response.data);
     // An empty array to save the data that we'll scrape
        var results = [];    

        $("div.headline").each(function(i, element) {
            var headline = $(element).text();
    var link = $(element).children('a').attr('href');
    // summary may be dynamically generatedc
    // var summary = $(element).next('.blurb').text();

    if (link && headline) {
            db.scrapedData.insert({
                headline:headline,
                link: link                
            },
        function(err, inserted) {
            if (err) {
                    console.log(err);
            }
            else {
                // Otherwise, log the inserted data
                console.log(inserted);
            }
        });
        }        
        results.push({
            headline: headline,
            link: link,
            // summary: summary
                });            
            });
            console.log(headline,link);
        });   

console.log('scraping...'  );
    });


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
           res.json(JSON.stringify(found));
        }
    });
});
   
//Listener
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });