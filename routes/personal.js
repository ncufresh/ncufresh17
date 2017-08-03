var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Qna = require('../models/qna');

var fs = require('fs');
var shortId = require('shortid');
var formidable = require('formidable');

/* GET home page. */
router.get('/', isLoggedIn, function(req, res, next) {
  Qna.find({ userId:req.user._id }).exec(function(err, qna) {

    // Array：用來將資料庫 type 欄位的數字轉換成文字
    // ex: typeToName[ QnA.type = 1 ] === "校園生活"
    var typeToName = [
      "其他",
      "校園生活",
      "學生事務",
      "宿舍生活"
    ];

    // function：用來將資料庫 updated 欄位的時間轉換成日期
    var renderTime = function(date) {
      var day = date.getDate();
      var monthIndex = date.getMonth();
      var year = date.getFullYear();
      var time = year + '/' + (++monthIndex) + '/' + day;
      return time;
    };

    res.render('personal/index', { 
      title: '個人專區 | 新生知訊網', 
      user: req.user,
      typeToName: typeToName,
      renderTime: renderTime,
      qna: qna
    });
  });
});

router.post('/uploadProfile/:id', function(req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {

      if (err) {
				console.log(err);
			}

      var uploadedFile = files.input_img;
      var tmpPath = uploadedFile.path;
      var fileName = shortId.generate() + uploadedFile.name.substr(uploadedFile.name.lastIndexOf('.'));
      var targetPath = './public/personal/profile/' + fileName;
      var deletePath = './public/personal/profile/' + req.user.local.img;

      var readStream = fs.createReadStream(tmpPath)
      var writeStream = fs.createWriteStream(targetPath);

      User.findById( req.params.id, function( err, user) {
        user.local.img = fileName;
        user.save(function(err, todo, count) {
          res.redirect('/personal');
        });
      });

      readStream.on("end", function() {
        console.log(readStream);
        fs.unlink(tmpPath);
        if (req.user.local.img != "profile.png")
          fs.unlink(deletePath);
      }).pipe(writeStream);

    });
});

router.get('/initial/:id', function(req, res, next) {
    
  User.findById( req.params.id, function( err, user) {
    user.local.img = "profile.png";
    user.save(function(err, todo, count) {
        res.redirect('/personal');
    });
  });

  if (req.user.local.img != "profile.png") {
    var deletePath = './public/personal/profile/' + req.user.local.img;
    fs.unlink(deletePath);
  }

});

function isLoggedIn(req, res, next) {

  if (!req.isAuthenticated()) {
    res.redirect('/login');
  }

  return next();
}

module.exports = router;
