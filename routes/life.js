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
	life({
		type:req.body.type,
		name:req.body.name,
		introduction:req.body.introduction,
	}).save(function(err, doc){
		if(err)res.json(err);
		else   res.redirect('/life/food');
	});
});

module.exports = router;
