var express = require('express');
var router = express.Router();

var async = require('async');
var Todo = require('../models/Todo');
var User = require('../models/user');
var url = require('url');
var request = require('request');

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



  // 登出用
  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  //portal 登入
  router.get('/auth/provider', isLoggedIn, function(req, res, next){
    var root = 'https://api.cc.ncu.edu.tw/oauth';
    var client_id = 'NjVlNTZjMjktYWViZC00M2YyLTk0NTctNDk3NTY5NjQ0NmM5';
    var scope = 'user.info.basic.read';
    var urll = root + '/oauth/authorize?response_type=code&scope=' + scope + '&client_id=' + client_id;
    res.redirect(urll);
  } );

  router.get('/auth/provider/callback',isLoggedIn, function(req, res, next){
    var url_parts = url.parse(req.url, true);
  	var query = url_parts.query;
    //decline
    if(!req.query.code){
      res.redirect('/login');
    }
    // api get accessToken
    var root = 'https://api.cc.ncu.edu.tw/oauth';
    var client_id = process.env.PORTAL_CLIENT_ID;
    var client_secret = process.env.PORTAL_CLIENT_SECRET;
    var urll = root + '/oauth/token';

    request.post({url:urll, form: {
        'grant_type': 'authorization_code',
        'code': req.query.code,
        'client_id': client_id,
        'client_secret': client_secret
      }}, function Callback(err, httpResponse, token) {
      if (err) {
        return console.error('failed:', err);
        res.redirect('/login');
      }
    if(!httpResponse.statusCode===200){
      console.log('response error!');
      res.redirect('/login');
    }
      // api get personal information
      root = 'https://api.cc.ncu.edu.tw';
      urll = root + '/personnel/v1/info';
      // console.log('req:'+req);
      obj = JSON.parse(token);
      console.log('access_token:'+obj.access_token);
      request({url:urll,headers:{
        'Authorization': 'Bearer' + obj.access_token,
      }},function Callback(err, httpResponse, body) {
        if (err) {
          return console.error('failed:', err);
          res.redirect('/login');
        }
        if(!httpResponse.statusCode===200){
          console.log('response error!');
          res.redirect('/login');
        }
        console.log('body:'+body);
        personalObj = JSON.parse(body);
        // find user using id(學號)
        User.findOne({'local.email': personalObj.id+'@cc.ncu.edu.tw'},function(err,obj) {
          if(obj){
            req.login(obj, function(err){
              if(!err){
                res.redirect('/');
              }
            });
          }else{
            var newUser = new User();
            newUser.local.name = personalObj.name;
            newUser.local.email = personalObj.id+'@cc.ncu.edu.tw';
            newUser.local.password = "";
            newUser.local.accountType = personalObj.type;
            newUser.local.created = new Date();

            newUser.save(function(err) {
              if (err) {
                console.log('err:'+err);
                res.redirect('/login');
              } else {
                req.login(newUser, function(err){
                  if(!err){
                    res.redirect('/');
                  }
                });

              }
            });
          }

        });
      }
      );
    });

  })


  // router.get('/auth/provider', passport.authenticate('provider',{ scope: 'user.info.basic.read' }));
  //
  // router.get('/auth/provider/callback',
  // passport.authenticate('provider', { successRedirect: '/',
  //                                     failureRedirect: '/login' }),function(){
  //
  //                                     });

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
