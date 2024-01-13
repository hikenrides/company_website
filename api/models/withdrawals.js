const mongoose = require('mongoose');

const WithdrawalsSchema = new mongoose.Schema({
  owner: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
  amount: Number,
  accountNumber: Number,
  accountName: String,
  bankName: String,
});

const WithdrawalsModel = mongoose.model('Withdrawals', WithdrawalsSchema);

module.exports = WithdrawalsModel;