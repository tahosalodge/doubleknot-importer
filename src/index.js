require('dotenv').config();
const mongoose = require('mongoose');
const EventRegistration = require('./EventRegistration');

mongoose.connect(
  process.env.MONGODB,
  { useNewUrlParser: true }
);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

try {
  EventRegistration.getRegistrations().then(() => {
    process.exit();
  });
} catch (error) {
  console.log('Error:', error);
  process.exit();
}

process.on('uncaughtException', err => {
  console.log('Unhandled promise rejection:');
  console.log(err);
  process.exit();
});
