var express = require('express');
var router = express.Router();
var video = require('../models/video');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('video/index',
	{
		title: 'video',
		user: req.user
	});
});
router.get('/life', function(req, res, next) {
	video.find({}).exec(function(err,video){
		res.render('video/life', 
		{
			title: 'life',
			user: req.user,
			video: video
		});
	});
});
router.get('/interview', function(req, res, next) {
	video.find({}).exec(function(err,video){
		res.render('video/interview',
	  	{
	  		title: 'interview',
	  		user: req.user
	  	});
	});
});
router.post('/add', function(req, res, next) {
	video.find({ type: req.body.type },function(e,data){
		console.log('err  :'+e);
		console.log('data  :'+data);
		console.log(req.body.content)
		if(data.length!=0){
			video.update({ type: req.body.type }, {
				type: req.body.type,
				insert: req.body.content
			},function(e){
				if(e)console.log(e);
			});
		}
		else{
			new video({
				type: req.body.type,
				insert: req.body.content
			}).save();
		}
	});
	res.redirect('/video/life');
});
module.exports = router;