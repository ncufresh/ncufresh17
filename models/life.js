var mongoose = require('mongoose');
var shortId = require('shortid');

var life = mongoose.Schema({
    _id: {
    type: String,
    unique: true,
    'default': shortId.generate
    },
    name        : String,
    type        : String,
    introduction: String,
});

module.exports = mongoose.model( 'life', life );
