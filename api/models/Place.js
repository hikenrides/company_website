const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  province: String,
  from: String,
  province2: String,
  destination: String,
  color: String,
  brand: String,
  type: String,
  seats: String,
  extraInfo: String,
  owner_number: Number,
  date: Date,
  maxGuests: Number,
  frequency: { type: String, enum: ['Regular', 'Once-off', 'Daily', 'Weekly'] },
  price: Number,
  status: { type: String, default: 'active' },
});

const PlaceModel = mongoose.model('Place', placeSchema);

module.exports = PlaceModel;
