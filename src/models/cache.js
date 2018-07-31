const mongoose = require('mongoose');

const cacheSchema = mongoose.Schema({
  downloadedAt: Date,
  data: String,
});

module.exports = mongoose.model('cache', cacheSchema);
