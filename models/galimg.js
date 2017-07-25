var mongoose = require('mongoose');

var Galimg = mongoose.Schema({
    imgurl     : String,
    videourl       : String,
    name       : String,
    updated_at : Date
});

module.exports = mongoose.model( 'Galimg', Galimg );
