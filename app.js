var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
require('dotenv').config();

var mongoose = require('mongoose');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('passport');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirsname, 'public/images/main', 'icon.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'ThisIsNcuFreshAndWeAreTheBest',
  resave: true,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// database config
var configDB = require('./config/database');
mongoose.Promise = global.Promise;
mongoose.connect(configDB.url, { useMongoClient: true });

// passport 認證
require('./config/passport')(passport);
var index = require('./routes/index')(passport);
var users = require('./routes/users');

var documents = require('./routes/documents');
var qna = require('./routes/qna');
var campus = require('./routes/campus');
var groups = require('./routes/groups');
var life = require('./routes/life');
var smallgame = require('./routes/smallgame');
var video = require('./routes/video');
var personal = require('./routes/personal');
var about = require('./routes/about');
var aboutweb = require('./routes/aboutweb');

// Routes
app.use('/', index);
app.use('/users', users);

// 新生必讀
app.use('/documents', documents);
// 新生Ｑ＆Ａ
app.use('/qna', qna);
// 校園導覽
app.use('/campus', campus);
// 系所社團
app.use('/groups', groups);
// 中大生活
app.use('/life', life);
// 小遊戲
app.use('/smallgame', smallgame);
// 影音專區
app.use('/video', video);
// 個人專區
app.use('/personal', personal);
// 關於我們
app.use('/about', about);
// 網站地圖
app.use('/aboutweb', aboutweb);


// ckeditor uploader
app.post('/uploader', multipartMiddleware, function(req, res) {
  var fs = require('fs');

  fs.readFile(req.files.upload.path, function(err, data) {
    var newPath = __dirname + '/public/uploads/' + req.files.upload.name;
    fs.writeFile(newPath, data, function(err) {
      if (err) console.log({ err: err });
      else {
        html = "";
        html += "<script type='text/javascript'>";
        html += "    var funcNum = " + req.query.CKEditorFuncNum + ";";
        html += "    var url     = \"/uploads/" + req.files.upload.name + "\";";
        html += "    var message = \"Uploaded file successfully\";";
        html += "";
        html += "    window.parent.CKEDITOR.tools.callFunction(funcNum, url, message);";
        html += "</script>";

        res.send(html);
      }
    });
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;