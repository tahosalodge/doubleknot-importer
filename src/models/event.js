const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
  name: String,
  url: String,
  mapping: [
    {
      source: String,
      destination: String,
    },
  ],
});

module.exports = mongoose.model('event', eventSchema);
