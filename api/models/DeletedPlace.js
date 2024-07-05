const mongoose = require('mongoose');

const deletedPlaceSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  province: String,
  from: String,
  province2: String,
  destination: String,
  color: String,
  brand: String,
  type: String,
  seats: Number,
  price: Number,
  extraInfo: String,
  owner_number: String,
  date: Date,
  maxGuests: Number,
  status: { type: String, enum: ['deleted', 'expired', 'booked'] },
}, { timestamps: true });

const DeletedPlace = mongoose.model('DeletedPlace', deletedPlaceSchema);

module.exports = DeletedPlace;
