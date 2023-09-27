const mongoose = require('mongoose');
const {Schema} = mongoose;

const UserSchema = new Schema({
  name: String,
  gender: String,
  phone_number: String,
  age: String,
  email: {type:String, unique:true},
  isDriver: { type: Boolean, default: false },
  driverLicense: String,
  licenseCode: String,
  password: String,
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;