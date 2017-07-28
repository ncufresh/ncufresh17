var express = require('express');
var router = express.Router();
var url = require('url');
var fs = require('fs');
var department = require('../models/department');
var club = require('../models/club');
var shortId = require('shortid');



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('groups/index', { title: 'groups', user: req.user });
});
router.get('/club', function(req, res, next) {
  res.render('groups/club', { title: 'groups', user: req.user });
});
router.get('/department', function(req, res, next) {
  res.render('groups/department', { title: 'groups', user: req.user });
});
router.get('/organization', function(req, res, next) {
  res.render('groups/organization', { title: 'groups', user: req.user });
});

router.get('/all_department/:id',function(req,res,next){
  department.find({_id:req.params.id},function(err,data){
    res.send(data[0]);
  });
});

router.get('/all_department', function(req, res, next) {
	department.find({}).exec(function(err,department){
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
  res.render('groups/all_department', {
  	title: 'groups',
  	user: req.user,
  	firstClick: req.query.dep,
  	department: department,
   });
});
});
router.get('/all_club', function(req, res, next) {
	club.find({}).exec(function(err,club){
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
  res.render('groups/all_club', {
  	title: 'groups',
  	user: req.user,
  	firstClick: req.query.club,
  	club: club,
   });
});
});

router.get('/delete_de/:id', function (req, res, next) {
	department.findById(req.params.id).remove().exec();
	res.redirect('/groups/all_department');
});

router.post('/add_de', function(req, res, next) {
	department({
		type:req.body.type,
		name:req.body.name,
		introduction:req.body.introduction,
		organization:req.body.organization,
        activity:req.body.activity,
        team:req.body.team,
        course:req.body.course
	}).save(function(err, doc){
		if(err)res.json(err);
		else   res.redirect('/groups/all_department');
	});
});

router.post('/add_club', function(req, res, next) {
	club({
		type:req.body.type,
		name:req.body.name,
		introduction:req.body.introduction
	}).save(function(err, doc){
		if(err)res.json(err);
		else   res.redirect('/groups/all_club');
	});
});

router.get('/edit_de/:id', function(req, res, next) {
	console.log(1234);
  department.findById(req.params.id,function(err, doc){
        res.send(doc);
      });
});


router.post('/edit_de', function(req, res, next) {
  department.update({ _id: req.body.id},{
  	type:req.body.type,
  	name:req.body.name,
    introduction:req.body.introduction,
    organization:req.body.organization,
    activity:req.body.activity,
    team:req.body.team,
    course:req.body.course
      },function(err, doc){
        if(err)res.json(err);
		else   res.redirect('/groups/all_department');
      });
});


module.exports = router;
