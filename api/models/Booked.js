const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookedPlaceSchema = new Schema({
  place: { type: Schema.Types.ObjectId, ref: 'Place' },
  passengers: Number,
  name: String,
  phone: String,
  price: Number,
  reference: String,
  owner_number: String,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'booked' },
}, { timestamps: true });

const bookedRequestSchema = new Schema({
  request: { type: Schema.Types.ObjectId, ref: 'Request' },
  passengers: Number,
  name: String,
  phone: String,
  price: Number,
  reference: String,
  owner_number: String,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'booked' },
}, { timestamps: true });

const BookedPlace = mongoose.model('BookedPlace', bookedPlaceSchema);
const BookedRequest = mongoose.model('BookedRequest', bookedRequestSchema);

module.exports = { BookedPlace, BookedRequest };
