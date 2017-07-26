var express = require('express');
var router = express.Router();
var url = require('url');
var fs = require('fs');
var formidable = require('formidable');
var life = require('../models/life');
var shortId = require('shortid');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('life/index', { title: 'life', user: req.user });
});
router.get('/life/:id',function(req,res,next){
  life.find({_id:req.params.id},function(err,data){
    res.send(data[0]);
  });
});
router.get('/life/food/:id',function(req,res,next){
  life.find({_id:req.params.id},function(err,data){
    res.send(data[0]);
  });
});
router.get('/food', function(req, res, next) {
	life.find({}).exec(function(err,life){
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
  res.render('life/food', {
  	title: 'life',
  	user: req.user,
  	firstClick: req.query.dep,
    life: life,
   });
});
});
router.post('/add_life', function(req, res, next) {
  if (req.body.button == "update") {
		life.update({ _id: req.body.bid }, {
      type:fields.type,
  		name:fields.name,
  		introduction:fields.introduction,
      img_path1: '/life/' + fileName1,
      fileName1: fileName1,
      img_path2: '/life/' + fileName2,
      fileName2: fileName2,
      img_path3: '/life/' + fileName3,
      fileName3: fileName3
		}, function (err) {
			if (err)
				console.log(err);
		});
	}
  var form = new formidable.IncomingForm();
	form.parse(req, function (err, fields, files) {
		if (err) {
			console.log("上傳err");
		}
    var uploadedFile1 = files.uploadImg1;
    var uploadedFile2 = files.uploadImg2;
    var uploadedFile3 = files.uploadImg3;
		var tmpPath1 = uploadedFile1.path;
    var tmpPath2 = uploadedFile2.path;
    var tmpPath3 = uploadedFile3.path;
		var fileName1 = shortId.generate() + uploadedFile1.name.substr(uploadedFile1.name.lastIndexOf('.'));
    var fileName2 = shortId.generate() + uploadedFile2.name.substr(uploadedFile2.name.lastIndexOf('.'));
    var fileName3 = shortId.generate() + uploadedFile3.name.substr(uploadedFile3.name.lastIndexOf('.'));
		var targetPath1 = './public/life/' + fileName1;
    var targetPath2 = './public/life/' + fileName2;
    var targetPath3 = './public/life/' + fileName3;
		console.log(tmpPath1);
    console.log(tmpPath2);
    console.log(tmpPath3);
		console.log(targetPath1);
    console.log(targetPath2);
    console.log(targetPath3);
    var readStream1 = fs.createReadStream(tmpPath1);
    var readStream2 = fs.createReadStream(tmpPath2);
    var readStream3 = fs.createReadStream(tmpPath3);
		var writeStream1 = fs.createWriteStream(targetPath1);
    var writeStream2 = fs.createWriteStream(targetPath2);
    var writeStream3 = fs.createWriteStream(targetPath3);
    var a = new life({
		type:fields.type,
		name:fields.name,
		introduction:fields.introduction,
    img_path1: '/life/' + fileName1,
    fileName1: fileName1,
    img_path2: '/life/' + fileName2,
    fileName2: fileName2,
    img_path3: '/life/' + fileName3,
    fileName3: fileName3
    });
    a.save();
    readStream1.on("end", function () {
    	fs.unlink(tmpPath1);
    }).pipe(writeStream1);
    readStream2.on("end", function () {
    	fs.unlink(tmpPath2);
    }).pipe(writeStream2);
    readStream3.on("end", function () {
    	fs.unlink(tmpPath3, function () {
        res.send(a);
    	});
    }).pipe(writeStream3);
    res.redirect('/life');
  });
});
module.exports = router;
