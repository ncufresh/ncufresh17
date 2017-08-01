var mongoose = require('mongoose');

var qnaSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: { type: Number, default: 0 },
  title: String,
  content: String,
  answer: { type: String, default: "" },
  created: Date,
  updated: { type: Date, default: Date.now },
  view: { type: Number, default: 0 }
});

module.exports = mongoose.model('qna', qnaSchema);