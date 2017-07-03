var express = require('express');
var router = express.Router();
var building = require('../models/building');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('campus/index', { title: 'campus' });
});

router.get('/guide',function(req,res,next){
  res.render('campus/guide',{ title: '校園地圖' });
});

router.get('/help',function(req,res,next){
  res.render('campus/help',{ title: '校園防災' });
});

router.get('/newData',function(req,res,next){
  var b = new building({
    name:"工五",
    type:"系館",
    sos:true,
    AED:true,
    content:"",
    updated_at:Date.now()
  }).save();
  building.find({}).sort({CreateDate:-1}).exec(function(err,buildings){
    res.render('campus/newData',{title: '新增建族物', buildings: buildings});
  });
  
});

module.exports = router;
