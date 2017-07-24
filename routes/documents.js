var express = require('express');
var router = express.Router();
var fs = require('fs');
var formidable = require('formidable');
var document = require('../models/document');
var shortId = require('shortid');

/* GET home page. */
router.get('/', function(req, res, next) {
  document.find({}).sort({order:1}).exec(function(err,document){
    res.render('documents/index',{title: 'documents', document: document, user: req.user});
  });
});

router.get('/require_data/:id',function(req,res,next){
  document.find({_id:req.params.id},function(err,data){
    res.send(data[0]);
  });
});

router.get('/delete/:id',function(req,res,next){
  console.log("delete");
  var total;
  var the_type;
  var the_order;
  document.find({_id:req.params.id}).exec(function (err, results) {
    the_type = results[0].type;
    the_order = results[0].order;
    document.find({type:the_type}).exec(function (err, result) {
      total = result.length;
      console.log("有 "+total+" 個");
      console.log("順序是第 "+the_order+" 個");
      console.log("type是: "+the_type);
      the_order++;
      for (var ha = the_order ; ha <= total ;ha++)
      {
        var temp = ha;
        temp--;
        document.update({order:ha,type:the_type},{
          order: temp
        },function(err){
          if(err)
            console.log(err);
        });
      }
      document.findById(req.params.id).remove().exec();
      res.redirect('/documents');
    });
  });
});

router.post('/add',function(req,res,next){
  var temp;
  document.find({type:req.body.type}).exec(function (err, results) {
    if(err) throw err;
    temp = results.length;
    temp++;
    console.log(temp);
    var b = new document({
      name:req.body.name,
      type:req.body.type,
      content:req.body.content,
      img_path: "",
      order: temp
    }).save();
  });
  res.redirect('/documents');
});

router.post('/update',function(req,res,next){
  document.update({_id:req.body.id},{
        name:req.body.name,
        content:req.body.Content
      },function(err){
        if(err)
          console.log(err);
      });
  console.log(req.body.id);
  console.log(req.body.name);
  console.log(req.body.type);
  console.log(req.body.Content);
  res.redirect('/documents');
});

router.post('/change_order',function(req,res,next){
  console.log(req.body.type);
  console.log(req.body.first_order);
  console.log(req.body.second_order);
  var first_order = req.body.first_order.toString();
  var second_order = req.body.second_order.toString();
  document.update({type:req.body.type,order:first_order},{
    order:0
  },function(err){
    if(err)
      console.log(err);
    document.update({type:req.body.type,order:second_order},{
      order:first_order
    },function(err){
      if(err)
        console.log(err);
      document.update({type:req.body.type,order:0},{
        order:second_order
      },function(err){
        if(err)
          console.log(err);
      });
    });
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
      readStream.on("end",function(){
        document.update({_id:req.params.id},{
          img_path:'/documents/' + fileName
        },function(err){
          if(err)
            console.log(err);
        });
        console.log(fields.imgid);
      })
      .pipe(writeStream,function(){
        fs.unlink(tmpPath, function(err) {
          if(err)console.log("刪除暫存err")
          console.log('File Uploaded to ' + targetPath + ' - ' + uploadedFile.size + ' bytes');
        });
      });
  });
  res.redirect('/documents');
})

module.exports = router;