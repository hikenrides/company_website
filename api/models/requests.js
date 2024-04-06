const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  owner: String,
  province: String,
  from: String,
  province2: String,
  destination: String,
  extraInfo: String,
  date: Date,
  NumOfPassengers: Number,
  price: Number,
});

const RequestModel = mongoose.model('Request', RequestSchema);

module.exports = RequestModel;