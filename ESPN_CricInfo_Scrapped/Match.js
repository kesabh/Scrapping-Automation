let cheerio = require("cheerio") ; 
let request = require("request") ; 
let fs = require("fs") ; 

function matchData(link){
    request(link, function(error, response, data){
        processData(data) ; 
    }) ; 
}


function processData(html){
    let ch = cheerio.load(html) ;
    let tables = ch(".Collapsible") ; 
    for(let i = 0 ; i < tables.length ; i++){
        let teamName = ch(tables[i]).find("h5").text().trim() ; 
        teamName = teamName.split("INNINGS")[0] ; 
        // console.log(teamName);

        let allRows = ch(tables[i]).find(".table.batsman tbody tr") ; 
        for(let j = 0 ; j < allRows.length - 1 ; j++){
            let allData = ch(allRows[j]).find("td") ; 
            if(allData.length > 1){
                let batsmanName = ch(allData[0]).find("a").text().trim() ; 
                let runs = ch(allData[2]).text().trim() ; 
                let balls = ch(allData[3]).text().trim() ; 
                let fours = ch(allData[5]).text().trim() ; 
                let sixes = ch(allData[6]).text().trim() ; 

                // console.log("Batsman - " + batsmanName + ", Runs = " + runs + ", Balls = " + balls + ", Fours = " + fours + ", Sixes = " + sixes );
            
                manageDetails(teamName, batsmanName, runs, balls, fours, sixes) ; 
            }
        }
        // console.log("------------------------------------------------------------------------------------");
    }
}


function checkTeamFolder ( teamName ){
    let teamPath = "./" + teamName ; 
    return fs.existsSync(teamPath) ; 
}

function checkBatsmanFile(teamName, batsmanName){
    let batsmanFilePath = "./" + teamName + "/" + batsmanName + ".json" ; 
    return fs.existsSync(batsmanFilePath) ; 
}

function createTeamFolder(teamName){
    let teamPath = "./" + teamName ; 
    fs.mkdirSync(teamPath) ; 
}

function  createBatsmanFile(teamName, batsmanName ) {
    let batsmanFilePath = "./" + teamName + "/" + batsmanName + ".json" ; 
    batsmanFileData = []  ; 
    fs.writeFileSync(batsmanFilePath, JSON.stringify(batsmanFileData) ); 
}

function updateBatsmanFile(teamName, batsmanName, runs, balls, fours, sixes){
    let batsmanFilePath = "./" + teamName + "/" + batsmanName + ".json" ; 
    let batsmanFileData = fs.readFileSync(batsmanFilePath) ; 
    batsmanFileData = JSON.parse(batsmanFileData) ; 

    let innings = {
        Runs : runs  ,
        Balls : balls ,
        Fours : fours ,
        Sixes : sixes 
    } ; 

    batsmanFileData.push(innings) ; 
    fs.writeFileSync(batsmanFilePath, JSON.stringify(batsmanFileData)) ; 
}

function manageDetails(teamName, batsmanName, runs, balls, fours, sixes){

    let teamFolderExists = checkTeamFolder(teamName) ; 
    if( teamFolderExists )
    {
        let batsmanFileExists = checkBatsmanFile(teamName, batsmanName) ; 
        if( batsmanFileExists )
        {
            updateBatsmanFile( teamName, batsmanName, runs, balls, fours, sixes );
        }
        else{
            createBatsmanFile(teamName, batsmanName ) ; 
            updateBatsmanFile( teamName, batsmanName, runs, balls, fours, sixes );
        }
    }
    else{
        createTeamFolder(teamName) ; 
        createBatsmanFile(teamName, batsmanName ) ; 
        updateBatsmanFile( teamName, batsmanName, runs, balls, fours, sixes );
    }
}

module.exports = matchData ; 