var express = require('express');
var router = express.Router();
var url = require('url');
var fs = require('fs');
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
  var form = new formidable.IncomingForm();
	form.parse(req, function (err, fields, files) {
		if (err) {
			console.log("上傳err");
		}
    var uploadedFile = files.uploadImg;
		var tmpPath = uploadedFile.path;
		var fileName = shortId.generate() + uploadedFile.name.substr(uploadedFile.name.lastIndexOf('.'));
		var targetPath = './public/life/food' + fileName;
		console.log(tmpPath);
		console.log(targetPath);
    var readStream = fs.createReadStream(tmpPath)
		var writeStream = fs.createWriteStream(targetPath);
    var a = new life({
		type:req.body.type,
		name:req.body.name,
		introduction:req.body.introduction,
    img_path: '/life/food' + fileName,
    fileName: fileName
    });
    a.save();
    readStream.on("end", function () {
    	fs.unlink(tmpPath, function () {
    		res.send(a);
    	});
    }).pipe(writeStream);
    console.log(fields.imgid);
  });
});
module.exports = router;
