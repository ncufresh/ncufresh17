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

router.get('/edit_aboutweb', isAdmin,function(req, res, next) {
  aboutweb.find({}).exec(function(err,aboutweb){
    res.render('aboutweb/edit_aboutweb', { title: 'edit_aboutweb', aboutweb: aboutweb, user: req.user });
  });
});

router.get('/get_data/:id',isAdmin,function(req,res,next){
  aboutweb.find({_id:req.params.id},function(err,data){
    if(err) 
      console.log(err);
    res.send(data[0]);
  });
});

router.get('/delete/:id',isAdmin,function(req,res,next){
  aboutweb.findById(req.params.id).remove().exec();
  res.redirect('/aboutweb/edit_aboutweb/');
});

router.post('/edit',isAdmin,function(req,res,next){
  console.log(req.body.content);
	aboutweb.update({_id:req.body.id},{
      name:req.body.name,
      type:req.body.type,
      x:req.body.x_position,
      y:req.body.y_position,
      link:req.body.link,
      size:req.body.size
    },function(err){
      if(err)
        console.log(err);
   	  res.redirect('/aboutweb/edit_aboutweb/');
    });
});

router.post('/add',isAdmin,function(req,res,next){
  var b = new aboutweb({
    name:req.body.name,
    link:req.body.content,
    x:0,
    y:0,
    size:10.5,
    type:req.body.type
  }).save();
  res.redirect('/aboutweb/edit_aboutweb/');
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
