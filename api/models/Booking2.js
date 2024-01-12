const mongoose = require('mongoose');

const bookingSchema2 = new mongoose.Schema({
  place: {type:mongoose.Schema.Types.ObjectId, required:true, ref:'Request'},
  user: {type:mongoose.Schema.Types.ObjectId, required:true},
  name: {type:String, required:true},
  phone: {type:String, required:true},
  price: Number,
  passengers: Number,
  reference: {type:String, required:true, unique:true},
});

const BookingModel2 = mongoose.model('Booking2', bookingSchema2);

module.exports = BookingModel2;