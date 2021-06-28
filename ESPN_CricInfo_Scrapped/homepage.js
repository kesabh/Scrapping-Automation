let cheerio = require("cheerio") ; 
let request = require("request") ; 
const getAllMatches = require("./getAllMatches");

// requesting home page of IPL 2020-21 from espncricinfo
request("https://www.espncricinfo.com/series/ipl-2020-21-1210595", function(error, response, data){

    processData(data) ;  
}) ;


// function to process the data 
function processData(html){
    let ch = cheerio.load(html) ; 
    
    let aTag = ch('a[data-hover="View All Results"]') ; 
    let link = "https://www.espncricinfo.com"+aTag.attr("href") ; 
    // console.log(link);

    getAllMatches(link) ; 
}