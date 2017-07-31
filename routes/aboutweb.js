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

router.post('/edit',function(req,res,next){
	document.update({_id:req.body.id},{
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
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files){
  		console.log(fields.content)
      if(err){
          console.log("上傳err");
      }
      // console.log('received fields: ');
      // console.log(fields);
      // console.log('received files: ');
      // console.log(files);

      var tempId = shortId.generate();
      var fileName = "";
      if(files.uploadingImg.name!="")
      {
        var uploadedFile = files.uploadingImg;
        var tmpPath = uploadedFile.path;
        fileName = tempId + uploadedFile.name.substr(uploadedFile.name.lastIndexOf('.'));
        var targetPath = './public/aboutweb/' + fileName;
        console.log(tmpPath);
        console.log(targetPath);
        // 跨分區會error
        // fs.rename(tmpPath, targetPath, function(err) {
        //   if (err){
        //     console.log(err);
        //   }
        //   else{ 
        //     fs.unlink(tmpPath, function() {
        //       console.log('File Uploaded to ' + targetPath + ' - ' + uploadedFile.size + ' bytes');
        //     });
        //   }
        // });

        var readStream = fs.createReadStream(tmpPath)
        var writeStream = fs.createWriteStream(targetPath);
        readStream.on("end",function(){        
        })
        .pipe(writeStream,function(){
          fs.unlink(tmpPath, function(err) {
            if(err)console.log("刪除暫存err");
            console.log('File Uploaded to ' + targetPath + ' - ' + uploadedFile.size + ' bytes');
          });
        });
      } 
      var b = new aboutweb({
          _id: tempId,
          link:fields.content,
          x:0,
          y:0,
          size:5,
          img_path:'/aboutweb/' + fileName,
        }).save();
        res.redirect('/aboutweb/edit_aboutweb/');
    });
});

module.exports = router;
