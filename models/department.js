var mongoose = require('mongoose');

var department = mongoose.Schema({
    class : String,
    name : String,
    introduction : String,
    organization : String,
    activity : String,
    team : String,
    course : String,
});

module.exports = mongoose.model( 'department', department );
