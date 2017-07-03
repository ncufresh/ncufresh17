var mongoose = require('mongoose');

var Todo = mongoose.Schema({
    user_id    : String,
    content    : String,
    updated_at : Date
});

module.exports = mongoose.model( 'Todo', Todo );
