var mongoose = require('mongoose');
var shortId = require('shortid');

var img_list = mongoose.Schema({
    _id: {
    type: String,
    unique: true,
    'default': shortId.generate
    },
    updated_at  :{
        type: Date,
        'default':Date.now()
    },
    build_id: String,
    img_path: String,
    fileName: String
});

module.exports = mongoose.model( 'img_list', img_list );
