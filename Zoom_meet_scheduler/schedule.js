async function scheduler(meeting, page) {

    await page.waitForTimeout(1000) ; 

    await waitAndClick("#btnScheduleMeeting", page);

    await page.waitForTimeout(3000) ; 
    await page.waitForSelector('#topic', { visible: true });

    await page.evaluate(function (element) {
        document.querySelector("#topic").value = element["Topic"];
    }, meeting);

    await page.waitForTimeout(2000);
    await page.type('#agenda', meeting["Description"], { delay: 300 });

    await page.waitForTimeout(1000);
    await page.click('input[aria-controls="start_time-popup-list"]');
    await page.waitForTimeout(1000);
    await page.type('input[aria-controls="start_time-popup-list"]', meeting["Time"], { delay: 400 });
    await page.keyboard.press("Enter");

    await page.waitForTimeout(1000);
    await page.click('span[aria-controls="start_time_2-popup-list"]');
    await page.waitForTimeout(1000);

    if (meeting["am/pm"] == "PM")
        await page.click('#select-item-start_time_2-1');
    else
        await page.click('#select-item-start_time_2-0');


    await page.waitForTimeout(1000);
    await page.click('label[for="option_mute_upon_entry"]');

    await page.waitForTimeout(2000);
    await page.click('#meetingSaveButton');

    await page.waitForTimeout(2000);
    await waitAndClick('#copyInvitation', page);

    await page.waitForSelector('#invite_email');
    let message = await page.evaluate(function (element) {
        let text = document.querySelector('#invite_email').textContent;
        return text;
    }, "#invite_email");

    return message; 
}   

function waitAndClick(selector, page) {
    return new Promise(async function (resolve, reject) {
        // await page.waitForNavigation() ; 
        await page.waitForSelector(selector, { visible: true });
        await page.click(selector);

        resolve();
    })
}


module.exports = scheduler;