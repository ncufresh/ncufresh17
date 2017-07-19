var express = require('express');
var router = express.Router();
var shortId = require('shortid');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('life/index', { title: 'life', user: req.user });
});
router.get('/food', function(req, res, next) {
  res.render('life/food', { title: 'food', user: req.user });
});
router.get('/dorm', function(req, res, next) {
  res.render('life/dorm', { title: 'dorm', user: req.user });
});
router.get('/traffic', function(req, res, next) {
  res.render('life/traffic', { title: 'traffic', user: req.user });
});
router.get('/study', function(req, res, next) {
  res.render('life/study', { title: 'study', user: req.user });
});
router.get('/entertainment', function(req, res, next) {
  res.render('life/entertainment', { title: 'entertainment', user: req.user });
});
router.get('/food/:id',function(req,res,next){
  department.find({_id:req.params.id},function(err,data){
    res.send(data[0]);
  });
});
router.post('/add_life', function(req, res, next) {
	food({
		type:req.body.type,
		name:req.body.name,
		introduction:req.body.introduction,
	}).save(function(err, doc){
		if(err)res.json(err);
		else   res.redirect('/life/food');
	});
});

module.exports = router;
