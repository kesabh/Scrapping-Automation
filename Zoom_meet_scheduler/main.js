// const puppeteer = require("puppeteer");
const puppeteer = require('puppeteer-extra')
const allMeetings = require("./input.js");

const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const scheduler = require('./schedule.js');
const sendMail = require('./mail.js');
puppeteer.use(StealthPlugin());



(async function () {
    let browser = await puppeteer.launch({
        // executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
        headless: false,
        defaultViewport: null,
        args: ["--start-maximized", "--enable automation"],
        ignoreDefaultArgs: true

        // slowMo: 50,
        // userDataDir : 'C:/Users/HP/AppData/Local/Google/Chrome/User Data' 
    });

    let page = await browser.newPage();

    //going to zoom home page
    await page.goto("https://zoom.us/", { waitUntil: "domcontentloaded" });

    await waitAndClick('.signin', page);
    await waitAndClick('.login-btn-google', page);


    await page.waitForNavigation();
    await page.waitForSelector('#identifierId', { visible: true });
    await page.type('#identifierId', "acd830980@gmail.com", { delay: 300 });

    await page.keyboard.press("Enter");

    await page.waitForNavigation()
    await page.waitForSelector('input[type="password"]', { visible: true });
    await page.type('input[type="password"]', "abcd2020", { delay: 300 });
    await page.keyboard.press("Enter");


    await page.waitForNavigation();

    await page.waitForTimeout(3000);

    for (let i = 0; i < allMeetings.length; i++) {
        // function to schedule a particular meeting
        let message = await scheduler(allMeetings[i], page);

        // function to send invite links to the recipients
        sendMail(message, allMeetings[i]["recepients"]);
    }

})();



function waitAndClick(selector, page) {
    return new Promise(async function (resolve, reject) {
        // await page.waitForNavigation() ; 
        await page.waitForSelector(selector, { visible: true });
        await page.click(selector);

        resolve();
    })
}