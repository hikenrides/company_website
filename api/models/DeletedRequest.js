const mongoose = require('mongoose');

const deletedRequestSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  province: String,
  from: String,
  province2: String,
  destination: String,
  price: Number,
  extraInfo: String,
  owner_number: String,
  date: Date,
  NumOfPassengers: Number,
  status: { type: String, enum: ['deleted', 'expired', 'booked'] },
}, { timestamps: true });

const DeletedRequest = mongoose.model('DeletedRequest', deletedRequestSchema);

module.exports = DeletedRequest;
