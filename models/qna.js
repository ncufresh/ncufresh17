var mongoose = require('mongoose');

var qnaSchema = mongoose.Schema({
  userId: String,
  type: { type: Number, default: 0 },
  title: String,
  content: String,
  answer: String,
  created: Date,
  updated: { type: Date, default: Date.now },
  view: { type: Number, default: 0 }
});

module.exports = mongoose.model('qna', qnaSchema);