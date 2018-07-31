/* eslint-env browser */
const { parse } = require('papaparse');
const puppeteer = require('puppeteer');
const set = require('lodash/set');
const RegistrationModel = require('models/registration');
const EventModel = require('models/event');
const CacheModel = require('models/cache');

class EventRegistration {
  /**
   * Login to Doubleknot and download event data
   */
  static async getRegistrations() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const cached = await CacheModel.findOne({
      downloadedAt: {
        $gte: yesterday,
      },
    }).lean();
    if (cached) {
      await this.parseEventData(cached.data);
      return;
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(process.env.DK_LOGIN_URL);
    // login
    await page.click('#UserName');
    await page.keyboard.type(process.env.DK_USER);
    await page.click('#Password');
    await page.keyboard.type(process.env.DK_PASS);
    await page.click('#ButtonLogon');
    await page.waitForNavigation();

    // go to event page
    await page.goto(process.env.DK_EVENTS_URL);
    await page.click('#tLink_ViewExport');
    await page.waitForNavigation();

    // download event data
    const csv = await page.evaluate(() => {
      const url = document.getElementById('lnkDownLoadFile').href;
      return fetch(url, {
        method: 'GET',
        credentials: 'include',
      }).then(res => res.text());
    });
    browser.close();

    const cacheData = new CacheModel({
      downloadedAt: new Date(),
      data: csv,
    });

    await cacheData.save();

    await this.parseEventData(csv);
  }

  static prepareForDb(mapping, registration) {
    const processedRegistration = {
      registeredBy: {},
      member: {},
      meta: [],
    };
    mapping.forEach(({ source, destination }) => {
      const value = registration[source];
      set(processedRegistration, destination, value);
    });
    return processedRegistration;
  }

  /**
   * Parse event data and save it to the database
   */
  static async parseEventData(csv) {
    const { data } = parse(csv, {
      header: true,
      dynamicTyping: true,
    });

    const { mapping } = await EventModel.findOne({
      doubleknotId: 2338944,
    }).lean();

    const processedRegistrations = data.map(registration =>
      this.prepareForDb(mapping, registration)
    );
    try {
      await RegistrationModel.insertMany(processedRegistrations);
    } catch (error) {
      console.log(error.message);
    }

    return JSON.stringify(processedRegistrations);
  }
}

module.exports = EventRegistration;
