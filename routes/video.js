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
		var foodURL,housingURL,transportationURL,educationURL,entertainmentURL,l1,l2,l3,l4,l5;
		for (var i in video){
			if(video[i].type=="food"){
    			foodURL=video[i].insert
			}
			else if(video[i].type=="housing"){
    			housingURL=video[i].insert
			}
			else if(video[i].type=="transportation"){
    			transportationURL=video[i].insert
			}
			else if(video[i].type=="education"){
    			educationURL=video[i].insert
			}
			else if(video[i].type=="entertainment"){
    			entertainmentURL=video[i].insert
			}
			else if(video[i].type=="l1"){
				l1=video[i].insert
			}
			else if(video[i].type=="l2"){
				l2=video[i].insert
			}
			else if(video[i].type=="l3"){
				l3=video[i].insert
			}
			else if(video[i].type=="l4"){
				l4=video[i].insert
			}
			else if(video[i].type=="l5"){
				l5=video[i].insert
			}
		}
		res.render('video/life', 
		{
			title: 'life',
			user: req.user,
			video: video,
			foodURL: foodURL,
			housingURL: housingURL,
			transportationURL: transportationURL,
			educationURL: educationURL,
			entertainmentURL: entertainmentURL,
			l1: l1,
			l2: l2,
			l3: l3,
			l4: l4,
			l5: l5
		});
	});
});
router.get('/interview', function(req, res, next) {
	video.find({}).exec(function(err,video){
		var D1,D2,D3,D4,D5,D6,D7,D8,D9,D10,D11,D12,D13,D14,D15,D16,D17,D18,D19,D20,D21,D22,D23;
		for (var i in video){
			if(video[i].type=="D1"){
    			D1=video[i].insert
			}
			else if(video[i].type=="D2"){
    			D2=video[i].insert
			}
			else if(video[i].type=="D3"){
    			D3=video[i].insert
			}
			else if(video[i].type=="D4"){
    			D4=video[i].insert
			}
			else if(video[i].type=="D5"){
    			D5=video[i].insert
			}
			else if(video[i].type=="D6"){
    			D6=video[i].insert
			}
			else if(video[i].type=="D7"){
    			D7=video[i].insert
			}
			else if(video[i].type=="D8"){
    			D8=video[i].insert
			}
			else if(video[i].type=="D9"){
    			D9=video[i].insert
			}
			else if(video[i].type=="D10"){
    			D10=video[i].insert
			}
			else if(video[i].type=="D11"){
    			D11=video[i].insert
			}
			else if(video[i].type=="D12"){
    			D12=video[i].insert
			}
			else if(video[i].type=="D13"){
    			D13=video[i].insert
			}
			else if(video[i].type=="D14"){
    			D14=video[i].insert
			}
			else if(video[i].type=="D15"){
    			D15=video[i].insert
			}
			else if(video[i].type=="D16"){
    			D16=video[i].insert
			}
			else if(video[i].type=="D17"){
    			D17=video[i].insert
			}
			else if(video[i].type=="D18"){
    			D18=video[i].insert
			}
			else if(video[i].type=="D19"){
    			D19=video[i].insert
			}
			else if(video[i].type=="D20"){
    			D20=video[i].insert
			}
			else if(video[i].type=="D21"){
    			D21=video[i].insert
			}
			else if(video[i].type=="D22"){
    			D22=video[i].insert
			}
			else if(video[i].type=="D23"){
    			D23=video[i].insert
			}
		}
		res.render('video/interview',
	  	{
	  		title: 'interview',
	  		user: req.user,
	  		video: video,
	  		D1: D1,
	  		D2: D2,
	  		D3: D3,
	  		D4: D4,
	  		D5: D5,
	  		D6: D6,
	  		D7: D7,
	  		D8: D8,
	  		D9: D9,
	  		D10: D10,
	  		D11: D11,
	  		D12: D12,
	  		D13: D13,
	  		D14: D14,
	  		D15: D15,
	  		D16: D16,
	  		D17: D17,
	  		D18: D18,
	  		D19: D19,
	  		D20: D20,
	  		D21: D21,
	  		D22: D22,
	  		D23: D23
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
router.post('/addQQ', function(req, res, next) {
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
	res.redirect('/video/interview');
});
module.exports = router;