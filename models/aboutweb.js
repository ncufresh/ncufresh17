var mongoose = require('mongoose');
var shortId = require('shortid');

var aboutweb = mongoose.Schema({
    _id: {
    type: String,
    unique: true,
    'default': shortId.generate
    },
    x       : Number,
    y       : Number,
    size    : Number,
    link    : String,
    img_path: String
});

module.exports = mongoose.model( 'aboutweb', aboutweb );
