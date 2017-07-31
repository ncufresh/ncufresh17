var mongoose = require('mongoose');

var Galimg = mongoose.Schema({
    imgurl     : String,
    videourl       : String,
    name       : String,
    up_date    : Date,
    updated_at : Date
});

module.exports = mongoose.model( 'Galimg', Galimg );
