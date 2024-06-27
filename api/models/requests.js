const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  province: String,
  from: String,
  province2: String,
  destination: String,
  extraInfo: String,
  owner_number: Number,
  date: Date,
  NumOfPassengers: Number,
  price: Number,
  status: { type: String, default: 'active' }
});

const RequestModel = mongoose.model('Request', RequestSchema);

module.exports = RequestModel;
