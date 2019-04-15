//Require necessary packages

const axios = require('axios');
const cheerio = require('cheerio');
const express = require("express");
const path = require("path");
const exphbs  = require('express-handlebars');


const app = express();

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

//test console

console.log("\n***********************************\n" +
            "Getting data from Washington Post News web site\n" +            
            "\n***********************************\n")

//use axios to return data
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
        
            results.push({
                headline: headline,
                link: link,
                summary: summary
            });            
        });
        console.log(results);
    });
        // .catch(error => {
        // console.log(error);
        // })


//Listener
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });