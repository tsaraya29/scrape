//Require necessary packages

const axios = require('axios');
const cheerio = require('cheerio');

//test console

console.log("\n***********************************\n" +
            "Getting data from Washington Post Nwes web site\n" +            
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
            var link = $(element).children("a").attr('href');
            // console.log(link);
            results.push({
                headline: headline,
                link: link
            });            
        });
        console.log(results);
    });
        // .catch(error => {
        // console.log(error);
        // })