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
    up1: String,
    up2: String,
    up3: String,
    up4: String
});

module.exports = mongoose.model( 'department', department );
