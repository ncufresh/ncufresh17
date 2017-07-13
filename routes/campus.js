var express = require('express');
var router = express.Router();
var building = require('../models/building');
var img_list = require('../models/img_list');
var map_obj = require('../models/map_obj');
var fs = require('fs');
var util = require('util');
var formidable = require('formidable');
var shortId = require('shortid');

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
  building.find({}).sort({CreateDate:-1}).exec(function(err,buildings){
    res.render('campus/newData',{title: '新增建築物', buildings: buildings});
  });
});

router.get('/editMap',function(req,res,next){
  building.find({}).sort({CreateDate:-1}).exec(function(err,buildings){
    res.render('campus/editMap',{ title: '編輯地圖物件', buildings: buildings});
  });
});

router.get('/newData/:id',function(req,res,next){
  building.find({_id:req.params.id},function(err,data){
    res.send(data[0]);
  });
});

router.get('/get_img/:id',function(req,res,next){
  img_list.find({build_id:req.params.id},function(err,data){
    res.send(data);
  })
});

router.get('/delete/:id',function(req,res,next){
  building.findById(req.params.id).remove().exec();
  res.redirect('/campus/newData');
});

router.get('/delete_img/:id',function(req,res,next){
  img_list.findById(req.params.id,function(err,data){
    fs.unlink('./public/campus/'+data.fileName,function(e){
      if(e)console.log(e);
      else{
        img_list.findById(req.params.id).remove().exec();
      }
      res.redirect('/campus/newData');
    });
  });
});

router.post('/add',function(req,res,next){
  if(req.body.button=="update"){
    building.update({_id:req.body.bid},{
      name:req.body.name,
      type:req.body.type,
      content:req.body.content,
      SOS:req.body.SOS==0?false:true,
      AED:req.body.AED==0?false:true,
      updated_at:Date.now()
    },function(err){
      if(err)
        console.log(err);
    });
  }
  else{
    var b = new building({
      name:req.body.name,
      type:req.body.type,
      content:req.body.content,
      SOS:req.body.SOS==0?false:true,
      AED:req.body.AED==0?false:true,
      updated_at:Date.now()
    }).save();
  }
  res.redirect('/campus/newData');
});

router.post('/newMapObj',function(req,res,next){
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
    var fileName =shortId.generate() + uploadedFile.name.substr(uploadedFile.name.lastIndexOf('.'));
    var targetPath = './public/campus/' + fileName;
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
    new map_obj({
      build_id:fields.map_obj_id,
      path:'/campus/' + fileName,
      fileName:fileName
    }).save();

    readStream.on("end",function(){
      fs.unlink(tmpPath);
    }).pipe(writeStream);
    
    console.log(fields.imgid);
  });
});

router.post('/imgUpload',function(req,res,next) {

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
    var fileName =shortId.generate() + uploadedFile.name.substr(uploadedFile.name.lastIndexOf('.'));
    var targetPath = './public/campus/' + fileName;
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
    var a=new img_list({
      build_id:fields.imgid,
      img_path:'/campus/' + fileName,
      fileName:fileName
    });
    a.save();
    readStream.on("end",function(){
      fs.unlink(tmpPath,function(){
        res.send(a);
      });
    }).pipe(writeStream);
    
    
    console.log(fields.imgid);
  });

});

module.exports = router;
