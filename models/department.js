var mongoose = require('mongoose');
var shortId = require('shortid');

var department = mongoose.Schema({
	_id: {
	type: String,
	unique: true,
	'default': shortId.generate
	},
    type : String,
    name : String,
    introduction : String,
    organization : String,
    activity : String,
    team : String,
    course : String,
});

module.exports = mongoose.model( 'department', department );
