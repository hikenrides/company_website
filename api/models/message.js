const mongoose = require('mongoose');
const { Schema } = mongoose;

const MessageSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'User' },
  receiver: { type: Schema.Types.ObjectId, ref: 'Place' },
  content: String,
});

const MessageModel = mongoose.model('Message', MessageSchema);

module.exports = MessageModel;
