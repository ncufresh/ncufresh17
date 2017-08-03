var mongoose = require('mongoose');
var shortId = require('shortid');

var groupImg = mongoose.Schema({
	_id: {
	type: String,
	unique: true,
	'default': shortId.generate
	},
    path: String,
    belongs: String,
    type: String,
    updated_at : Date
});

module.exports = mongoose.model( 'groupImg', groupImg );
