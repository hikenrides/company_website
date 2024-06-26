const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: String,
  gender: String,
  phone_number: Number,
  age: String,
  email: { type: String, unique: true },
  isDriver: { type: Boolean, default: false },
  driverLicense: String,
  password: String,
  messages: String,
  balance: Number,
  verification: { type: String, default: 'not verified' },
  registrationDate: { type: Date, default: Date.now },
  idPhotoUrl: String,
  documentPhotoUrl: String,
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
