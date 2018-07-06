const Papa = require("papaparse");

function parseEventData(csv) {
  const { data } = Papa.parse(csv, {
    header: true
  });

  return JSON.stringify(data);
}

module.exports = parseEventData;
