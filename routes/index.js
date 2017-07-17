var express = require('express');
var router = express.Router();

var async = require('async');
var Todo = require('../models/Todo');

module.exports = function(passport) {

  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.render('index/index',
    {
       title: 'NCUfresh17',
       user: req.user,
     });
  });

  // 登入驗證

  //註冊
  router.get('/register', isLoggedIn, function(req, res) {
    res.render('index/register', {
      title: '註冊頁',
      user: req.user,
      message: req.flash('signupMessage')
    });
  });
  router.post('/register', isLoggedIn, passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/register',
    failureFlash: true
  }));


  //登入頁
  router.get('/login',isLoggedIn, function(req, res, next) {
    res.render('index/login',
    {
       title: '登入頁',
       user: req.user,
       message: req.flash('loginMessage')
    });
  });
  router.post('/login', isLoggedIn, passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: 'Invalid username or password.'
  }));


  //處理登入
  router.post('/login',isLoggedIn, passport.authenticate('local-login', {
    successRedirect : '/profile', // 成功則導入profile
    failureRedirect : '/login',   // 失敗則返回登入頁
    failureFlash : true // 允許 flash 訊息
  }));

  // 登出用
  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  //portal 登入
  // router.get('/auth/provider', isLoggedIn, function(req, res, next){
  //   var root = 'https://api.cc.ncu.edu.tw/oauth';
  //   var client_id = 'NjVlNTZjMjktYWViZC00M2YyLTk0NTctNDk3NTY5NjQ0NmM5';
  //   var scope = 'user.info.basic.read';
  //   var url = root + '/oauth/authorize?response_type=code&scope=' + scope + '&client_id=' + client_id;
  //   res.redirect(url);
  // } );
  router.get('/auth/provider', passport.authenticate('provider',{ scope: 'user.info.basic.read' }));

  router.get('/auth/provider/callback',
  passport.authenticate('provider', { successRedirect: '/',
                                      failureRedirect: '/login' }),function(){
                                        
                                      });

  //Todo test
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
  // no async test
  // router.get('/todo', function(req, res, next) {
  //   Todo.find( function ( err, todos, count ){
  //     res.render( 'index', {
  //         title : 'Express Todo Example',
  //         todos : todos
  //       });
  //     });
  // });
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
  return router;
}

function isLoggedIn(req, res, next) {
  // if login then redirect
  if (req.isAuthenticated())
    res.redirect('/');

  return next();
}
