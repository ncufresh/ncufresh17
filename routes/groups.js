var express = require('express');
var router = express.Router();
var url = require('url');
var fs = require('fs');
var department = require('../models/department');
var club = require('../models/club');
var organization = require('../models/organization');
var shortId = require('shortid');
var formidable = require('formidable');
var groupImg = require('../models/groupImg');




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

router.get('/all_department/:id',function(req,res,next){
  department.find({_id:req.params.id},function(err,data){
    res.send(data[0]);
  });
});

router.get('/all_club/:id',function(req,res,next){
  club.find({_id:req.params.id},function(err,data){
    res.send(data[0]);
  });
});

router.get('/organization/:id',function(req,res,next){
   organization.find({_id:req.params.id},function(err,data){
     res.send(data[0]);
   });
 });

router.get('/all_department', function(req, res, next) {
	department.find({}).exec(function(err,department){
		groupImg.find({}).exec(function(err,groupImg){
			var url_parts = url.parse(req.url, true);
			var query = url_parts.query;
		  res.render('groups/all_department', {
		  	title: 'groups',
		  	user: req.user,
		  	firstClick: req.query.dep,
		  	department: department,
		  	groupImg: groupImg,
		   });
		});
		
	});
});
router.get('/all_club', function(req, res, next) {
	club.find({}).exec(function(err,club){
    groupImg.find({}).exec(function(err,groupImg){
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
  res.render('groups/all_club', {
  	title: 'groups',
  	user: req.user,
  	firstClick: req.query.club,
  	club: club,
    groupImg: groupImg,
   });
});
});
  });
router.get('/organization', function(req, res, next) {
  organization.find({}).exec(function(err,organization){
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  res.render('groups/organization', {
    title: 'groups',
    user: req.user,
    firstClick: req.query.organization,
    organization: organization,
   });
});
});

router.get('/delete_de/:id', isAdmin,function (req, res, next) {
	department.findById(req.params.id).remove().exec();
	res.redirect('/groups/all_department');
});

router.get('/delete_club/:id', isAdmin,function (req, res, next) {
	club.findById(req.params.id).remove().exec();
	res.redirect('/groups/all_club');
});

router.get('/delete_or/:id', isAdmin,function (req, res, next) {
  organization.findById(req.params.id).remove().exec();
  res.redirect('/groups/organization');
});

router.post('/add_de', isAdmin,function(req, res, next) {
	department({
		type:req.body.type,
		name:req.body.name,
		introduction:req.body.introduction,
		organization:req.body.organization,
        activity:req.body.activity,
        team:req.body.team,
        course:req.body.course,
	}).save(function(err, doc){
		if(err)res.json(err);
		else   res.redirect('/groups/all_department');
	});
});

router.post('/add_club',isAdmin, function(req, res, next) {
	club({
		type:req.body.type,
		name:req.body.name,
		introduction:req.body.introduction,
		howtoadd:req.body.howtoadd,
		FBfans:req.body.FBfans
	}).save(function(err, doc){
		if(err)res.json(err);
		else   res.redirect('/groups/all_club');
	});
});

router.post('/add_or',isAdmin, function(req, res, next) {
  organization({
    name:req.body.name,
    introduction:req.body.introduction,
    branch:req.body.branch,
    freshmenweek:req.body.freshmenweek,
    notice:req.body.notice
  }).save(function(err, doc){
    if(err)res.json(err);
    else   res.redirect('/groups/organization');
  });
});

router.get('/edit_de/:id',isAdmin, function(req, res, next) {
	console.log(1234);
  department.findById(req.params.id,function(err, doc){
        res.send(doc);
      });
});

router.get('/edit_club/:id',isAdmin, function(req, res, next) {
	console.log(1234);
  club.findById(req.params.id,function(err, doc){
        res.send(doc);
      });
});

router.get('/edit_or/:id',isAdmin, function(req, res, next) {
  console.log(1234);
  organization.findById(req.params.id,function(err, doc){
        res.send(doc);
      });
});

router.post('/edit_de',isAdmin, function(req, res, next) {
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

router.post('/edit_club',isAdmin, function(req, res, next) {
  club.update({ _id: req.body.id},{
  	type:req.body.type,
  	name:req.body.name,
    introduction:req.body.introduction,
    howtoadd:req.body.howtoadd,
    FBfans:req.body.FBfans,
      },function(err, doc){
        if(err)res.json(err);
		else   res.redirect('/groups/all_club');
      });
});

router.post('/edit_or',isAdmin, function(req, res, next) {
  organization.update({ _id: req.body.id},{
    name:req.body.name,
    introduction:req.body.introduction,
    branch:req.body.branch,
    freshmenweek:req.body.freshmenweek,
    notice:req.body.notice
      },function(err, doc){
        if(err)res.json(err);
    else   res.redirect('/groups/organization');
      });
});


 router.post('/uploadimg',isAdmin, function(req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
    	console.log(123);
      if (err) {
		console.log(err);
	  }
		console.log('received fields: ');
		console.log(fields);
		console.log('received files: ');
		console.log(files);


      var uploadedFile = files.input_img;
      var tmpPath = uploadedFile.path;
      var fileName = shortId.generate() + uploadedFile.name.substr(uploadedFile.name.lastIndexOf('.'));
      var targetPath = './public/groups/' + fileName;
			console.log("tmpPath:"+tmpPath);
			console.log("targetPath:"+targetPath);


      var readStream = fs.createReadStream(tmpPath)
      var writeStream = fs.createWriteStream(targetPath);

      new groupImg({
        type: fields.type,
        belongs: fields.belongs,
        path: fileName,
        updated_at: Date.now(),
      }).save(function() {
        res.redirect('all_department?dep=literature');
      });
      readStream.on("end", function() {
        console.log(readStream);
        fs.unlink(tmpPath);
      }).pipe(writeStream);

    });
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
