var express = require('express');
var router = express.Router();
var fs = require('fs');
var department = require('../models/department');
var club = require('../models/club');
var shortId = require('shortid');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('groups/index', { title: 'groups' });
});
router.get('/club', function(req, res, next) {
  res.render('groups/club', { title: 'groups' });
});
router.get('/department', function(req, res, next) {
  res.render('groups/department', { title: 'groups' });
});
router.get('/organization', function(req, res, next) {
  res.render('groups/organization', { title: 'groups' });
});
router.get('/all_department', function(req, res, next) {
  res.render('groups/all_department', { title: 'groups' });
});
router.get('/all_club', function(req, res, next) {
  res.render('groups/all_club', { title: 'groups' });
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
		else   res.redirect('/groups/department');
	});
});

router.post('/add_club', function(req, res, next) {
	club({
		type:req.body.type,
		name:req.body.name,
		introduction:req.body.introduction
	}).save(function(err, doc){
		if(err)res.json(err);
		else   res.redirect('/groups/club');;
	});
});

module.exports = router;

