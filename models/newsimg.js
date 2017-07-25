var mongoose = require('mongoose');

var Newsimg = mongoose.Schema({
    imgurl     : String,
    updated_at : Date
});

module.exports = mongoose.model( 'Newsimg', Newsimg );
