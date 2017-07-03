var express = require('express');
var router = express.Router();

var async = require('async');
var Todo = require('../models/Todo');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index/index', { title: 'NCUfresh17' });
});
router.get('/todo', function(req, res, next) {
  async.parallel(
    {
      todos: function(cb){
        Todo.find().exec(function(err, com) {
          cb(null, com);
        });
      },
    },
    function(err, result){
      res.render('index', {
        title: 'Todo',
        todos: result.todos,
      });
    }
  );
});
router.post('/new',function(req, res){
  new Todo({
    content    : req.body.content,
    updated_at : Date.now()
  }).save( function( err, todo, count ){
    res.redirect( '/Todo' );
  });
});
router.get('/destroy/:id', function(req, res){
  Todo.findById( req.params.id, function ( err, todo ){
    todo.remove( function ( err, todo ){
      res.redirect( '/Todo' );
    });
  });
});
router.get('/edit/:id', function(req, res){
  Todo.find( function ( err, todos ){
    res.render( 'edit', {
        title   : 'Express Todo Example',
        todos   : todos,
        current : req.params.id
    });
  });
});
router.post( '/update/:id', function(req, res){
  Todo.findById( req.params.id, function ( err, todo ){
    todo.content    = req.body.content;
    todo.updated_at = Date.now();
    todo.save( function ( err, todo, count ){
      res.redirect( '/Todo' );
    });
  });
});

module.exports = router;
