var express = require('express');
var router = express.Router();

var async = require('async');
var Todo = require('../models/Todo');
var User = require('../models/user');
var Galimg = require('../models/Galimg');
var Main_new = require('../models/Main_new');
var Newsimg = require('../models/Newsimg');

var url = require('url');
var request = require('request');
var formidable = require('formidable');
var shortId = require('shortid');
var fs = require('fs');



module.exports = function(passport) {

  /* GET home page. */
  router.get('/', function(req, res, next) {
    async.parallel({
        galimgs: function(cb) {
          Galimg.find().exec(function(err, com) {
            cb(null, com);
          });
        },
        main_news: function(cb){
          Main_new.find({'to_top':'false'}).sort({date: -1}).exec(function(err, com){
            cb(null, com);
          });
        },
        main_news_top: function(cb){
          Main_new.find({'to_top':'true'}).sort({date: -1}).exec(function(err, com){
            cb(null, com);
          });
        },
        newsimgs: function(cb){
          Newsimg.find().exec(function(err, com){
            cb(null, com);
          });
        },

      },
      function(err, result) {
        console.log(result.newsimgs);
        res.render('index/index', {
          title: '首頁 ｜ 新生知訊網',
          user: req.user,
          galimgs: result.galimgs,
          main_news: result.main_news,
          main_news_top: result.main_news_top,
          newsimgs: result.newsimgs,
        });
      }
    );

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
  router.get('/login', isLoggedIn, function(req, res, next) {
    res.render('index/login', {
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
  router.get('/auth/provider', isLoggedIn, function(req, res, next) {
    var root = 'https://api.cc.ncu.edu.tw/oauth';
    var client_id = 'NjVlNTZjMjktYWViZC00M2YyLTk0NTctNDk3NTY5NjQ0NmM5';
    var scope = 'user.info.basic.read';
    var urll = root + '/oauth/authorize?response_type=code&scope=' + scope + '&client_id=' + client_id;
    res.redirect(urll);
  });

  router.get('/auth/provider/callback', isLoggedIn, function(req, res, next) {
      var url_parts = url.parse(req.url, true);
      var query = url_parts.query;
      //decline
      if (!req.query.code) {
        res.redirect('/login');
      }
      // api get accessToken
      var root = 'https://api.cc.ncu.edu.tw/oauth';
      var client_id = process.env.PORTAL_CLIENT_ID;
      var client_secret = process.env.PORTAL_CLIENT_SECRET;
      var urll = root + '/oauth/token';

      request.post({
        url: urll,
        form: {
          'grant_type': 'authorization_code',
          'code': req.query.code,
          'client_id': client_id,
          'client_secret': client_secret
        }
      }, function Callback(err, httpResponse, token) {
        if (err) {
          return console.error('failed:', err);
          res.redirect('/login');
        }
        if (!httpResponse.statusCode === 200) {
          console.log('response error!');
          res.redirect('/login');
        }
        // api get personal information
        root = 'https://api.cc.ncu.edu.tw';
        urll = root + '/personnel/v1/info';
        // console.log('req:'+req);
        obj = JSON.parse(token);
        console.log('access_token:' + obj.access_token);
        request({
          url: urll,
          headers: {
            'Authorization': 'Bearer' + obj.access_token,
          }
        }, function Callback(err, httpResponse, body) {
          if (err) {
            return console.error('failed:', err);
            res.redirect('/login');
          }
          if (!httpResponse.statusCode === 200) {
            console.log('response error!');
            res.redirect('/login');
          }
          console.log('body:' + body);
          personalObj = JSON.parse(body);
          // find user using id(學號)
          User.findOne({ 'local.email': personalObj.id + '@cc.ncu.edu.tw' }, function(err, obj) {
            if (obj) {
              req.login(obj, function(err) {
                if (!err) {
                  res.redirect('/');
                }
              });
            } else {
              var newUser = new User();
              newUser.local.name = personalObj.name;
              newUser.local.email = personalObj.id + '@cc.ncu.edu.tw';
              newUser.local.password = "";
              newUser.local.accountType = personalObj.type;
              newUser.local.created = new Date();

              newUser.save(function(err) {
                if (err) {
                  console.log('err:' + err);
                  res.redirect('/login');
                } else {
                  req.login(newUser, function(err) {
                    if (!err) {
                      res.redirect('/');
                    }
                  });

                }
              });
            }

          });
        });
      });

    })
    //管理首頁
  router.get('/manageMain', isAdmin, function(req, res, next) {
    async.parallel({
        galimgs: function(cb) {
          Galimg.find().exec(function(err, com) {
            cb(null, com);
          });
        },
        main_news: function(cb){
          Main_new.find({'to_top':'false'}).sort({date: -1}).exec(function(err, com){
            cb(null, com);
          });
        },
        main_news_top: function(cb){
          Main_new.find({'to_top':'true'}).sort({date: -1}).exec(function(err, com){
            cb(null, com);
          });
        },
        newsimgs: function(cb){
          Newsimg.find().exec(function(err, com){
            cb(null, com);
          });
        },

      },
      function(err, result) {
        res.render('index/manageMain', {
          title: '管理首頁',
          user: req.user,
          galimgs: result.galimgs,
          main_news: result.main_news,
          main_news_top: result.main_news_top,
          newsimgs: result.newsimgs,
        });
      }
    );

  });
  //最上面的照片
  router.post('/manageMain/addGal', isAdmin, function(req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      if (err) {
				console.log(err);
			}
			// console.log('received fields: ');
			// console.log(fields);
      // console.log('received files: ');
			// console.log(files);


      var uploadedFile = files.input_img;
      var tmpPath = uploadedFile.path;
      var fileName = shortId.generate() + uploadedFile.name.substr(uploadedFile.name.lastIndexOf('.'));
      var targetPath = './public/images/main/galimg/' + fileName;
			// console.log(tmpPath);
			// console.log(targetPath);


      var readStream = fs.createReadStream(tmpPath)
      var writeStream = fs.createWriteStream(targetPath);

      new Galimg({
        videourl: fields.videourl,
        name: fields.name,
        imgurl: fileName,
      }).save(function() {
        res.redirect('/manageMain');
      });
      readStream.on("end", function() {
        console.log(readStream);
        fs.unlink(tmpPath);
      }).pipe(writeStream);

    });
  });
  //刪除gal
  router.post('/manageMain/delGal/:id',isAdmin, function(req, res){
    Galimg.findById( req.params.id, function ( err, galimg ){
      galimg.remove( function ( err, galimg ){
        fs.unlink("./public/images/main/galimg/"+galimg.imgurl,function(err){

          console.log(err);
          res.redirect('/manageMain');
        });
      });
    });
  });
  //新增消息
  router.post('/manageMain/addNews',isAdmin, function(req, res){
    new Main_new({
      title      : req.body.title,
      date       : req.body.news_date,
      content    : req.body.news_content,
      subtitle   : req.body.subtitle,
      to_top     : req.body.to_top,
      updated_at : Date.now(),
    }).save(function(){
      res.redirect( '/manageMain' );
    });
  });
  router.post('/manageMain/editNews/:id',isAdmin, function(req, res){
    console.log(req.body);
    Main_new.findById( req.params.id, function ( err, main_new ){
      main_new.title    = req.body.title;
      main_new.date     = req.body.news_date;
      main_new.content  = req.body.news_content;
      main_new.subtitle = req.body.subtitle;
      if(req.body.to_top){
        main_new.to_top   = true;
      }else{
        main_new.to_top   = false;
      }
      main_new.updated_at = Date.now();
      main_new.save( function ( err, todo, count ){
        res.redirect( '/manageMain' );
      });
    });
  });

  //最上面的照片
  router.post('/manageMain/addNewsImg',isAdmin,function(req,res,next){
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      if (err) {
				console.log(err);
			}
			// console.log('received fields: ');
			// console.log(fields);
      // console.log('received files: ');
			// console.log(files);

      var uploadedFile = files.input_img;
      var tmpPath = uploadedFile.path;
			var fileName = shortId.generate() + uploadedFile.name.substr(uploadedFile.name.lastIndexOf('.'));
      var targetPath = './public/images/main/newsimg/' + fileName;
			// console.log(tmpPath);
			// console.log(targetPath);

      var readStream = fs.createReadStream(tmpPath)
			var writeStream = fs.createWriteStream(targetPath);

      new Newsimg({
        imgurl: fileName,
      }).save(function(){
        res.redirect('/manageMain');
      });
      readStream.on("end", function () {
        console.log(readStream);
        fs.unlink(tmpPath);
      }).pipe(writeStream);

    });
  });
  //刪除newsimg
  router.post('/manageMain/delNewsImg/:id',isAdmin, function(req, res){
    Newsimg.findById( req.params.id, function ( err, newsimg ){
      newsimg.remove( function ( err, newsimg ){
        fs.unlink("./public/images/main/newsimg/"+newsimg.imgurl,function(err){

          console.log(err);
          res.redirect('/manageMain');
        });
      });
    });
  });

  // router.get('/auth/provider', passport.authenticate('provider',{ scope: 'user.info.basic.read' }));
  //
  // router.get('/auth/provider/callback',
  // passport.authenticate('provider', { successRedirect: '/',
  //                                     failureRedirect: '/login' }),function(){
  //
  //                                     });

  //Todo test
  router.get('/todo', isAdmin, function(req, res, next) {
    async.parallel({
        todos: function(cb) {
          Todo.find().exec(function(err, com) {
            cb(null, com);
          });
        },
      },
      function(err, result) {
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
  router.post('/new', function(req, res) {
    new Todo({
      content: req.body.content,
      updated_at: Date.now()
    }).save(function(err, todo, count) {
      res.redirect('/Todo');
    });
  });
  router.get('/destroy/:id', function(req, res) {
    Todo.findById(req.params.id, function(err, todo) {
      todo.remove(function(err, todo) {
        res.redirect('/Todo');
      });
    });
  });
  router.get('/edit/:id', function(req, res) {
    Todo.find(function(err, todos) {
      res.render('edit', {
        title: 'Express Todo Example',
        todos: todos,
        current: req.params.id
      });
    });
  });
  router.post('/update/:id', function(req, res) {
    Todo.findById(req.params.id, function(err, todo) {
      todo.content = req.body.content;
      todo.updated_at = Date.now();
      todo.save(function(err, todo, count) {
        res.redirect('/Todo');
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

function isAdmin(req, res, next) {
  if (req.isAuthenticated()) {
    console.log('log:' + req.user.local);
    if (req.user.local.accountType === 'admin') {
      return next();
    }
  }
  res.redirect('/');
}
