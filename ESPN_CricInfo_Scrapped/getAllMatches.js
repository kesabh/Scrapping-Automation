let cheerio = require("cheerio") ; 
let request = require("request") ; 
const matchData = require("./Match");


function  getAllMatches(link){
    request(link, function(error, response, data){
        processData(data) ; 
    }) ; 
}


function processData(html)
{
    let ch = cheerio.load(html) ; 
    let aTags = ch('a[data-hover="Scorecard"]') ; 

    for(let i = 0 ; i < aTags.length ; i++){
        let matchLink = "https://www.espncricinfo.com"+ch(aTags[i]).attr("href") ; 
        // console.log(matchLink);
        matchData(matchLink) ;
    }

    
}

module.exports = getAllMatches ; 