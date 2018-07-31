const mongoose = require('mongoose');

const eventRegistrationSchema = mongoose.Schema({
  registrationNumber: Number,
  event: String,
  registeredBy: {
    fname: String,
    lname: String,
    address: String,
    city: String,
    state: String,
    zip: String,
    phone: String,
    email: String,
  },
  registrationDate: Date,
  discount: Number,
  cost: Number,
  member: {
    fname: String,
    lname: String,
    memberType: String,
    phone: String,
    email: String,
    address: String,
    city: String,
    state: String,
    zip: String,
    gender: String,
    chapter: String,
    age: String,
    level: String,
    hasAllergies: String,
    allergyDetails: String,
    unit: Number,
  },
  addons: [
    {
      type: String,
      quantity: Number,
      cost: String,
    },
  ],
  meta: [
    {
      key: String,
      value: String,
    },
  ],
});

module.exports = mongoose.model('registration', eventRegistrationSchema);
