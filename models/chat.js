// models/chat.js
const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  userId: String,
  artistName: String,
  message: String,
  reply: String,
  conversationId: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Chat', chatSchema);
