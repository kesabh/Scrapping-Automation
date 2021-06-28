let puppeteer = require("puppeteer");

let link = process.argv[2];

(async function () {

    let browser = await puppeteer.launch({
        // executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
        headless: false,
        defaultViewport: null,
        args: ["--start-maximized"]
    });

    let pages = await browser.pages();
    let page = pages[0];
    await page.goto(link);
    await page.waitForSelector('#stats', { visible: true });

    let tag = await page.$$('#stats span[dir="auto"]');

    // getting total no. of videos present in the playlist
    let num = await page.evaluate(function (element) {
        return element.innerText;
    }, tag[0])
    if (num.length > 3)
        num = num.split(",").join("");
    num = Number(num);

    // console.log(num);

    await page.waitForSelector('span[id="text"]', { visible: true });

    let totalInSeconds = await page.evaluate(async function (num) {

        // utility function to convert duration into seconds only 
        function hmsToSecondsOnly(str) {
            var p = str.split(':'),
                s = 0, m = 1;

            while (p.length > 0) {
                s += m * parseInt(p.pop(), 10);
                m *= 60;
            }

            return s;
        }


        let allTimings = document.querySelectorAll('span[id="text"]');
        let contentDiv = document.querySelector('#content');

        // promisified function to get the duration of every video
        let x = new Promise(function (resolve, reject) {
            let id = setInterval(function () {
                if (allTimings.length != num) {
                    window.scrollTo(0, contentDiv.scrollHeight);
                    allTimings = document.querySelectorAll('span[id="text"]');
                } else {
                    clearInterval(id);
                    // return allTimings ; 
                    resolve();
                }
            }, 1000);

        });

        await x;
        let all = [];                       // array - storing the duration of all the videos in seconds
        for (let i = 0; i < allTimings.length; i++) {
            all.push(hmsToSecondsOnly(allTimings[i].innerText.trim()));
        }

        let totalSeconds = all.reduce(function (a, b) {
            return a + b;
        })
        console.log(totalSeconds);
        return totalSeconds;
    }, num);

    // console.log(totalInSeconds );


    // utility function to display the result in correct format 
    function displayInFormat(totalInSeconds, speed) {
        totalInSeconds = parseInt(totalInSeconds / speed);
        let hr = parseInt(totalInSeconds / 3600);
        let rem = totalInSeconds % 3600;
        let min = parseInt(rem / 60);
        let sec = min % 60;

        console.log("If viewed at " + speed + "x" + " --> " + hr + " hours , " + min + " minutes, " + sec + " seconds ");
    }

    // utility function to calculate average time of the playlist 
    function average(totalInSeconds, num) {
        totalInSeconds = parseInt(totalInSeconds / num);
        let hr = parseInt(totalInSeconds / 3600);
        let rem = totalInSeconds % 3600;
        let min = parseInt(rem / 60);
        let sec = min % 60;

        console.log("Average time of a video ---> " + hr + " hours , " + min + " minutes, " + sec + " seconds ");
    }

    average(totalInSeconds, num);
    displayInFormat(totalInSeconds, 1);
    displayInFormat(totalInSeconds, 1.5);
    displayInFormat(totalInSeconds, 1.75);
    displayInFormat(totalInSeconds, 2);



})();