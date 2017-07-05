var express = require('express');
var router = express.Router();
var for_freshman = require('../models/documents_for_freshman');

/* GET home page. */
router.get('/', function(req, res, next) {
  for_freshman.find({}).exec(function(err,for_freshman){
    res.render('documents/index',{title: 'documents', for_freshman: for_freshman});
  });
});

router.get('/delete/:id',function(req,res,next){
  for_freshman.findById(req.params.id).remove().exec();
  res.redirect('/documents');
});

router.post('/add',function(req,res,next){
  var b = new for_freshman({
    name:req.body.name,
    type:req.body.type,
    content:req.body.content
  }).save();
  res.redirect('/documents');
});

module.exports = router;