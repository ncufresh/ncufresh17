var mongoose = require('mongoose');

var Score_collection = mongoose.Schema({
	name: String,
	usermail: String,
	updated: {type: Date, default: Date.now },
    score: {type: Number, default: 0},
    type: String
});

module.exports = mongoose.model( 'score_collection', Score_collection );