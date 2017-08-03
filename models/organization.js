var mongoose = require('mongoose');
var shortId = require('shortid');

var organization = mongoose.Schema({
	_id: {
	type: String,
	unique: true,
	'default': shortId.generate
	},
    name : String,
    introduction : String,
    branch :String,
    freshmenweek :String,
    notice :String
});

module.exports = mongoose.model( 'organization', organization );