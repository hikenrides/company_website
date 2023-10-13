const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  owner: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
  from: String,
  destination: String,
  extraInfo: String,
  date: Date,
  NumOfPassengers: Number,
  price: Number,
});

const RequestModel = mongoose.model('Request', RequestSchema);

module.exports = RequestModel;