var express = require('express');
var router = express.Router();

var User = require('../models/user');
var scorecollect = require('../models/smallgame');

//update player personal score
router.post('/smallgame_getscore', function(req, res, next) {
		var temp; //save user latest score
		scorecollect.findOne({ 'usermail' :  req.user.local.email }, function(err, found) {
		  temp = found.score;
      var point = parseInt(temp) + parseInt(req.body.totalscore); //sum up latest and new score
        scorecollect.update({ usermail: req.user.local.email },{$set:{score:point}},function(err, res){ //update total score
  		    if (err) throw err;
		    });
    });
		res.redirect('/smallgame');    
});


/* GET home page. */
router.get('/', isLoggedIn, function(req, res, next) {
	var player;
	scorecollect.findOne({ 'usermail' :  req.user.local.email }, function(err, p) { //find got save score account or not 
        if (err)
          return done(err);
  if (!p){  //if not then create new account
    var c = new scorecollect({
			name: req.user.local.name,
			usermail: req.user.local.email,
      type: req.user.local.accountType,
			updated: Date.now()
		}).save();
	 player = 0;
	}
	else{ player = p;}
	var rank =[1,2,3,4,5,6,7,8,9,10]; //ranking number
	scorecollect.find({score: {$gt: 0}}).sort({score : -1}).limit(10).exec(function(err, result) { //sort ranking
    	if (err) throw err;
    	console.log(result);

    	res.render('smallgame/index', { 
    		title: '小遊戲 ｜ 新生知訊網', 
    		user: req.user,
    		result: result,
    		rank:rank,
    		player: player
  		});
  	});
	});  
});

function isLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    res.redirect('/login');
  }
  return next();
}

module.exports = router;
