var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Qna = require('../models/qna');

var fs = require('fs');
var shortId = require('shortid');
var formidable = require('formidable');

/* GET home page. */
router.get('/', isLoggedIn, function(req, res, next) {
  Qna.find({}).exec(function(err, qna) {
    res.render('personal/index', { 
      title: 'personal', 
      user: req.user,
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
      }).pipe(writeStream);

    });
});

function isLoggedIn(req, res, next) {

  if (!req.isAuthenticated()) {
    res.redirect('/login');
  }

  return next();
}

module.exports = router;
