var mongoose = require('mongoose');
var shortId = require('shortid');

var club = mongoose.Schema({
	_id: {
	type: String,
	unique: true,
	'default': shortId.generate
	},
    type : String,
    name : String,
    introduction : String
});

module.exports = mongoose.model( 'club', club );