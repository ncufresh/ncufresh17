var mongoose = require('mongoose');
var shortId = require('shortid');

var map_obj = mongoose.Schema({
    _id: {
    type: String,
    unique: true,
    'default': shortId.generate
    },
    build_id    : String,
    path        : String,
    fileName    : String,
    x_position  : Number,
    y_position  : Number,
    size        : Number
});

module.exports = mongoose.model( 'map_obj', map_obj );
