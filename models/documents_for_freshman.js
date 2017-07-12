var mongoose = require('mongoose');
var shortId = require('shortid');

var for_freshman = mongoose.Schema({
    _id: {
    type: String,
    unique: true,
    'default': shortId.generate
    },
    name        : String,
    type        : String,
    content     : String,
    img_path: String,
    order : Number
});

module.exports = mongoose.model( 'for_freshman', for_freshman );
