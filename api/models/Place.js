const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  owner: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    phoneNumber: String,
  },
  province: String,
  from: String,
  province2: String,
  destination: String,
  color: String,
  brand: String,
  type: String,
  seats: String,
  extraInfo: String,
  date: Date,
  maxGuests: Number,
  price: Number,
});

const PlaceModel = mongoose.model('Place', placeSchema);

module.exports = PlaceModel;