var express = require('express');
var router = express.Router();
var url = require('url');
var fs = require('fs');
var formidable = require('formidable');
var life = require('../models/life');
var shortId = require('shortid');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('life/index', { title: '中大生活 ｜ 新生知訊網', user: req.user });
});
router.get('/life/:id',isAdmin,function(req,res,next){
  life.find({_id:req.params.id},function(err,data){
    res.send(data[0]);
  });
});
router.get('/life/food/:id',isAdmin,function(req,res,next){
  life.find({_id:req.params.id},function(err,data){
    res.send(data[0]);
  });
});
router.get('/life/dorm/:id',isAdmin,function(req,res,next){
  life.find({_id:req.params.id},function(err,data){
    res.send(data[0]);
  });
});
router.get('/life/traffic/:id',isAdmin,function(req,res,next){
  life.find({_id:req.params.id},function(err,data){
    res.send(data[0]);
  });
});
router.get('/life/study/:id',isAdmin,function(req,res,next){
  life.find({_id:req.params.id},function(err,data){
    res.send(data[0]);
  });
});
router.get('/life/entertainment/:id',isAdmin,function(req,res,next){
  life.find({_id:req.params.id},function(err,data){
    res.send(data[0]);
  });
});
router.get('/life/others/:id',isAdmin,function(req,res,next){
  life.find({_id:req.params.id},function(err,data){
    res.send(data[0]);
  });
});
router.get('/food', function(req, res, next) {
	life.find({}).exec(function(err,life){
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
  res.render('life/food', {
  	title: ' 食 ｜ 新生知訊網',
  	user: req.user,
    life: life
   });
});
});
router.get('/dorm', function(req, res, next) {
	life.find({}).exec(function(err,life){
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
  res.render('life/dorm', {
  	title: ' 住 ｜ 新生知訊網',
  	user: req.user,
    life: life
   });
});
});
router.get('/traffic', function(req, res, next) {
	life.find({}).exec(function(err,life){
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
  res.render('life/traffic', {
  	title: '  行 ｜ 新生知訊網',
  	user: req.user,
    life: life
   });
});
});
router.get('/study', function(req, res, next) {
	life.find({}).exec(function(err,life){
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
  res.render('life/study', {
  	title: ' 育 ｜ 新生知訊網',
  	user: req.user,
    life: life
   });
});
});
router.get('/entertainment', function(req, res, next) {
	life.find({}).exec(function(err,life){
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
  res.render('life/entertainment', {
  	title: ' 樂 ｜ 新生知訊網',
  	user: req.user,
    life: life
   });
});
});
router.get('/others', function(req, res, next) {
	life.find({}).exec(function(err,life){
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
  res.render('life/others', {
  	title: ' 其他 ｜ 新生知訊網',
  	user: req.user,
    life: life
   });
});
});
router.post('/add_life',isAdmin, function(req, res, next) {
  if (req.body.button == "update") {
		life.update({ _id: req.body.bid }, {
      type: fields.type,
  		titletext: fields.titletext,
      img_path0: '/life/' +fileName0,
      fileName0: fileName0,
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
    var uploadedFile0 = files.titlepic;
    var uploadedFile1 = files.uploadImg1;
    var uploadedFile2 = files.uploadImg2;
    var uploadedFile3 = files.uploadImg3;
    var tmpPath0 = uploadedFile0.path;
		var tmpPath1 = uploadedFile1.path;
    var tmpPath2 = uploadedFile2.path;
    var tmpPath3 = uploadedFile3.path;
    var fileName0 = "";
    if(uploadedFile0.name!=""){
      fileName0 = shortId.generate() + uploadedFile0.name.substr(uploadedFile0.name.lastIndexOf('.'));
      var targetPath0 = './public/life/' + fileName0;
      console.log(tmpPath0);
      console.log(targetPath0);
      var readStream0 = fs.createReadStream(tmpPath0);
      var writeStream0 = fs.createWriteStream(targetPath0);
      readStream0.on("end", function () {
      	fs.unlink(tmpPath0);
      }).pipe(writeStream0);
    }
    var fileName1 = "";
    if(uploadedFile1.name!=""){
      fileName1 = shortId.generate() + uploadedFile1.name.substr(uploadedFile1.name.lastIndexOf('.'));
      var targetPath1 = './public/life/' + fileName1;
      console.log(tmpPath1);
      console.log(targetPath1);
      var readStream1 = fs.createReadStream(tmpPath1);
      var writeStream1 = fs.createWriteStream(targetPath1);
      readStream1.on("end", function () {
      	fs.unlink(tmpPath1);
      }).pipe(writeStream1);
    }
    var fileName2 = "";
    if(uploadedFile2.name!=""){
        fileName2 = shortId.generate() + uploadedFile2.name.substr(uploadedFile2.name.lastIndexOf('.'));
        var targetPath2 = './public/life/' + fileName2;
        console.log(tmpPath2);
        console.log(targetPath2);
        var readStream2 = fs.createReadStream(tmpPath2);
        var writeStream2 = fs.createWriteStream(targetPath2);
        readStream2.on("end", function () {
        	fs.unlink(tmpPath2);
        }).pipe(writeStream2);
    }
    var fileName3 = "";
		if( uploadedFile3.name!=""){
      fileName3 = shortId.generate() + uploadedFile3.name.substr(uploadedFile3.name.lastIndexOf('.'));
      var targetPath3 = './public/life/' + fileName3;
      console.log(tmpPath3);
      console.log(targetPath3);
      var readStream3 = fs.createReadStream(tmpPath3);
      var writeStream3 = fs.createWriteStream(targetPath3);
      readStream3.on("end", function () {
      	fs.unlink(tmpPath3, function () {
      	});
      }).pipe(writeStream3);
    }
    var a = new life({
		type        : fields.type,
    titletext   : fields.titletext,
    img_path0    : '/life/' + fileName0,
    fileName0   : fileName0,
		introduction: fields.introduction,
    img_path1   : '/life/' + fileName1,
    fileName1   : fileName1,
    img_path2   : '/life/' + fileName2,
    fileName2   : fileName2,
    img_path3   : '/life/' + fileName3,
    fileName3   : fileName3
    });
    a.save(function(){
      res.redirect('/life');
    });
  });
});
router.get('/delete_life/:id',isAdmin, function (req, res, next) {
	console.log(req.params.id);
	life.findById(req.params.id, function (err, data) {
    if (data.fileName0!=""){
      fs.unlink('./public/life/' + data.fileName0, function(err){
        if (err) console.log(err);
      });
    }
    if (data.fileName1!=""){
      fs.unlink('./public/life/' + data.fileName1, function(err){
        if (err) console.log(err);
      });
    }
    if (data.fileName2!=""){
      fs.unlink('./public/life/' + data.fileName2,function(err){
        if (err) console.log(err);
      });
    }
    if (data.fileName3!=""){
      fs.unlink('./public/life/' + data.fileName3, function (err) {
			  if (err) console.log(err);
      });
    }
		life.findById(req.params.id).remove().exec(function(){
      res.redirect('/life');
    });
	});
});
function isAdmin(req, res, next) {
  if (req.isAuthenticated()) {
    // console.log('log:' + req.user.local);
    if (req.user.local.accountType === 'admin') {
      return next();
    }
  }
  res.redirect('/');
}
module.exports = router;
