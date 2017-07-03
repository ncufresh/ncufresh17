var mongoose = require('mongoose');
var shortId = require('shortid');

var building = mongoose.Schema({
    _id: {
    type: String,
    unique: true,
    'default': shortId.generate
    },
    name        : String,
    type        : String,
    content     : String,
    updated_at  : Date,
    sos         : Boolean,
    AED         : Boolean
});

module.exports = mongoose.model( 'building', building );
