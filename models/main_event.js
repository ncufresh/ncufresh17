var mongoose = require('mongoose');

var Main_event = mongoose.Schema({
    title      : String,
    date       : String,
    content    : String,
    updated_at : Date
});

module.exports = mongoose.model( 'Main_event', Main_event );
