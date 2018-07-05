require("dotenv").config();
const fs = require("fs");
const puppeteer = require("puppeteer");

async function run() {
  const browserConfig = {
    headless: false
  };
  const browser = await puppeteer.launch(browserConfig);
  const page = await browser.newPage({
    viewport: {
      width: 1440,
      height: 900
    }
  });

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
  // select Tahosa Lodge
  await page.select("#ListOfOrgs", "1156");
  await page.waitForNavigation();

  await page.goto(
    "https://denverboyscouts.doubleknot.com/ManageEvents/EventsManagement.aspx?emActivityKey=2338944"
  );
  await page.click("#tLink_ViewExport");
  await page.waitForNavigation();
  const csv = await page.evaluate(() => {
    const csvLink = document.getElementById("lnkDownLoadFile").href;
    return fetch(csvLink, {
      method: "GET",
      credentials: "include"
    }).then(res => res.text());
  });

  fs.writeFile(`src/data/${Date.now()}.csv`, csv, error => {
    if (error) {
      throw error;
    }
    console.log("File saved!");
  });

  browser.close();
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
