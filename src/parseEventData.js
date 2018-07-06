const Papa = require("papaparse");

function parseEventData(csv) {
  const { data } = Papa.parse(csv, {
    header: true,
    dynamicTyping: true
  });

  const eventData = data.map(registration => {
    Object.entries(registration).forEach(([key, value]) => {
      if (!value) {
        delete registration[key];
      }
    });
    return registration;
  });

  return JSON.stringify(eventData);
}

module.exports = parseEventData;
