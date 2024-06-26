const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  place: {type:mongoose.Schema.Types.ObjectId, required:true, ref:'Place'},
  user: {type:mongoose.Schema.Types.ObjectId, required:true},
  name: {type:String, required:true},
  owner_number: Number,
  phone: Number,
  price: Number,
  passengers: Number,
  reference: {type:String, required:true, unique:true},
});

const BookingModel = mongoose.model('Booking', bookingSchema);

module.exports = BookingModel;