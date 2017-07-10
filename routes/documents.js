var express = require('express');
var router = express.Router();
var fs = require('fs');
var formidable = require('formidable');
var for_freshman = require('../models/documents_for_freshman');
var shortId = require('shortid');

/* GET home page. */
router.get('/', function(req, res, next) {
  for_freshman.find({}).exec(function(err,for_freshman){
    res.render('documents/index',{title: 'documents', for_freshman: for_freshman});
  });
});

router.get('/require_data/:id',function(req,res,next){
  for_freshman.find({_id:req.params.id},function(err,data){
    res.send(data[0]);
  });
});

router.get('/delete/:id',function(req,res,next){
  console.log("delete");
  for_freshman.findById(req.params.id).remove().exec();
  res.redirect('/documents');
});

router.post('/add',function(req,res,next){
  var b = new for_freshman({
    name:req.body.name,
    type:req.body.type,
    content:req.body.content,
    img_path: ""
  }).save();
  console.log("true");
  console.log(req.body.content);
  res.redirect('/documents');
});

router.post('/update',function(req,res,next){
  for_freshman.update({_id:req.params.id},{
        name:req.body.name,
        type:req.body.type,
        content:req.body.content
      },function(err){
        if(err)
          console.log(err);
      });
  res.redirect('/documents');
});

router.post('/insertimg/:id',function(req,res,next) {

  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files){
      if(err){
          console.log("上傳err");
      }
      // console.log('received fields: ');
      // console.log(fields);
      // console.log('received files: ');
      // console.log(files);

      var uploadedFile = files.uploadingImg;
      var tmpPath = uploadedFile.path;
      var fileName = req.params.id + uploadedFile.name.substr(uploadedFile.name.lastIndexOf('.'));
      var targetPath = './public/documents/' + fileName;
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
      readStream.pipe(writeStream,function(){
        fs.unlink(tmpPath, function(err) {
          if(err)console.log("刪除暫存err")
          console.log('File Uploaded to ' + targetPath + ' - ' + uploadedFile.size + ' bytes');
        });
      });

      for_freshman.update({_id:req.params.id},{
        img_path:'/documents/' + fileName
      },function(err){
        if(err)
          console.log(err);
      });
      console.log(fields.imgid);

  });

  res.redirect('/documents');
})

module.exports = router;