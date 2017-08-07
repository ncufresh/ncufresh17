var mongoose = require('mongoose');
var shortId = require('shortid');

var life = mongoose.Schema({
    _id: {
    type: String,
    unique: true,
    'default': shortId.generate
    },
    titletext   : String,
    img_path0   : String,
    fileName0   : String,
    type        : String,
    introduction: String,
    img_path1   : String,
    fileName1   : String,
    img_path2   : String,
    fileName2   : String,
    img_path3   : String,
    fileName3   : String
});

module.exports = mongoose.model( 'life', life );
