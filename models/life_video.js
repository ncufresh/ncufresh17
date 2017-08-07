var mongoose = require('mongoose');
var shortId = require('shortid');

var life_video = mongoose.Schema({
    _id: {
    type: String,
    unique: true,
    'default': shortId.generate
    },
    type    : String,
    content : String
});

module.exports = mongoose.model( 'life_video', life_video );
