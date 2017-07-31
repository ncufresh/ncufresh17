var express = require('express');
var router = express.Router();
var aboutweb = require('../models/aboutweb');
var fs = require('fs');
var formidable = require('formidable');
var shortId = require('shortid');

/* GET home page. */
router.get('/', function(req, res, next) {
  aboutweb.find({}).exec(function(err,aboutweb){
    res.render('aboutweb/index', { title: 'aboutweb', aboutweb: aboutweb, user: req.user });
  });
});

router.get('/edit_aboutweb', function(req, res, next) {
  aboutweb.find({}).exec(function(err,aboutweb){
    res.render('aboutweb/edit_aboutweb', { title: 'edit_aboutweb', aboutweb: aboutweb, user: req.user });
  });
});

router.get('/get_data/:id',function(req,res,next){
  aboutweb.find({_id:req.params.id},function(err,data){
    if(err) 
      console.log(err);
    res.send(data[0]);
  });
});

router.post('/edit',function(req,res,next){
	document.update({_id:req.body.id},{
      name:req.body.name,
      x:req.body.x,
      y:req.body.y,
      link:req.body.content,
      size:req.body.size
    },function(err){
      if(err)
        console.log(err);
   	  res.redirect('/aboutweb/edit_aboutweb/');
    });
});

router.post('/add',function(req,res,next){
  var b = new aboutweb({
    name:req.body.name,
    link:req.body.content,
    x:0,
    y:0,
    size:5,
    type:req.body.type
  }).save();
  res.redirect('/aboutweb/edit_aboutweb/');
});

module.exports = router;
