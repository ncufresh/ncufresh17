var mongoose = require('mongoose');

var Main_new = mongoose.Schema({
    title      : String,
    date       : String,
    subtitle   : String,
    content    : String,
    to_top     : { type: Boolean, default: "false" },
    updated_at : Date
});

module.exports = mongoose.model( 'Main_new', Main_new );
