var mongoose = require('mongoose');
var shortId = require('shortid');

var map_obj = mongoose.Schema({
    _id: {
    type: String,
    unique: true,
    'default': shortId.generate
    },
    build_name  : String,
    build_type  : String,
    build_id    : String,
    SOS         : Boolean,
    AED         : Boolean,
    SOSx        : Number,
    SOSy        : Number,
    AEDx        : Number,
    AEDy        : Number,
    path        : String,
    fileName    : String,
    x_position  : Number,
    y_position  : Number,
    size        : Number
});

module.exports = mongoose.model( 'map_obj', map_obj );
