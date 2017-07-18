var mongoose = require('mongoose');
var shortId = require('shortid');

var video = mongoose.Schema({
    _id: {
    type: String,
    unique: true,
    'default': shortId.generate
    },
    type : String,
    insert: String
});

module.exports = mongoose.model( 'video', video );