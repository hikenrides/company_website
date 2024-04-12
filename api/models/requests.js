const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  owner: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    phoneNumber: String,
  },
  province: String,
  from: String,
  province2: String,
  destination: String,
  price: Number,
  extraInfo: String,
  date: Date,
  NumOfPassengers: Number,
});

const RequestModel = mongoose.model('Request', requestSchema);

module.exports = RequestModel;