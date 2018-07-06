require("dotenv").config();
const fs = require("fs");
const puppeteer = require("puppeteer");
const parseEventData = require("./parseEventData");

async function run() {
  const browser = await puppeteer.launch({
    // headless: false,
    // slowMo: 20,
    // devtools: true
  });
  const page = await browser.newPage();

  await page.goto(
    "https://denverboyscouts.doubleknot.com/Rosters/logon.aspx?orgkey=1704"
  );
  // login
  await page.click("#UserName");
  await page.keyboard.type(process.env.DK_USER);
  await page.click("#Password");
  await page.keyboard.type(process.env.DK_PASS);
  await page.click("#ButtonLogon");
  await page.waitForNavigation();

  // go to event page
  await page.goto(
    "https://denverboyscouts.doubleknot.com/ManageEvents/EventsManagement.aspx?emActivityKey=2338944"
  );
  await page.click("#tLink_ViewExport");
  await page.waitForNavigation();

  // download event data
  const csv = await page.evaluate(() => {
    const url = document.getElementById("lnkDownLoadFile").href;
    return fetch(url, {
      method: "GET",
      credentials: "include"
    }).then(res => res.text());
  });
  browser.close();

  // write to JSON
  const eventJson = parseEventData(csv);
  fs.writeFile(`src/data/${Date.now()}.json`, eventJson, error => {
    if (error) {
      throw error;
    }
    console.log("File written!");
  });
}
try {
  run();
} catch (error) {
  console.log("Error:");
  console.log(error);
  process.exit();
}
process.on("uncaughtException", err => {
  console.log("Unhandled promise rejection:");
  console.log(err);
  process.exit();
});
