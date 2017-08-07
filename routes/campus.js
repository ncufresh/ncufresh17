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
router.get('/', function (req, res, next) {
	res.render('campus/index', { user: req.user, title: '校園導覽 ｜ 新生知訊網' });
});

router.get('/guide', function (req, res, next) {
	map_obj.find({}).exec(function(err,map_objs){
		if(err) return next(err);
		building.find({}).sort({ type: 1 }).exec(function(err,buildings){
			if(err) return next(err);
			var dep=[],work=[],sport=[],point=[],food=[],home=[];
			for(var i=0;i<buildings.length;i++){
				if(buildings[i].type==="系館")
					dep[dep.length]=buildings[i];
				else if(buildings[i].type==="行政")
					work[work.length]=buildings[i];
				else if(buildings[i].type==="運動")
					sport[sport.length]=buildings[i];
				else if(buildings[i].type==="中大景點")
					point[point.length]=buildings[i];
				else if(buildings[i].type==="飲食")
					food[food.length]=buildings[i];
				else if(buildings[i].type==="住宿")
					home[home.length]=buildings[i];
			}
			res.render('campus/guide', {
				user: req.user,
				title: '校園地圖 ｜ 新生知訊網' ,
				map_objs: map_objs,
				dep: dep,
				work: work,
				sport: sport,
				point: point,
				food: food,
				home: home
			});
		})
	})
});

router.get('/help', function (req, res, next) {
	map_obj.find({}).exec(function(err,map_objs){
		if(err)return next(err);
		building.find({}).sort({ type: 1 }).exec(function(err,buildings){
			if(err)return next(err);
			var dep=[],work=[],sport=[],point=[],food=[],home=[];
			for(var i=0;i<buildings.length;i++){
				if(buildings[i].type==="系館")
					dep[dep.length]=buildings[i];
				else if(buildings[i].type==="行政")
					work[work.length]=buildings[i];
				else if(buildings[i].type==="運動")
					sport[sport.length]=buildings[i];
				else if(buildings[i].type==="中大景點")
					point[point.length]=buildings[i];
				else if(buildings[i].type==="飲食")
					food[food.length]=buildings[i];
				else if(buildings[i].type==="住宿")
					home[home.length]=buildings[i];
			}
			res.render('campus/help', {
				user: req.user,
				title: '校園防災 ｜ 新生知訊網' ,
				map_objs: map_objs,
				dep: dep,
				work: work,
				sport: sport,
				point: point,
				food: food,
				home: home
			});
		})
	})
});

router.get('/newData',isAdmin, function (req, res, next) {
	building.find({}).sort({ type: 1 }).exec(function (err, buildings) {
		if(err)return next(err);
		res.render('campus/newData', { user: req.user, title: '新增建築物 ｜ 新生知訊網', buildings: buildings });
	});
});

router.get('/editMap',isAdmin, function (req, res, next) {
	building.find({}).sort({ type: 1 }).exec(function (err, buildings) {
		if(err)return next(err);
		map_obj.find({}).sort({ build_type: 1 }).exec(function (err, map_objs){
			if(err)return next(err);
			res.render('campus/editMap', {
				user: req.user, title: '編輯地圖物件 ｜ 新生知訊網',
				buildings: buildings ,
				map_objs: map_objs
			});
		});
	});
});

router.get('/newData/:id', function (req, res, next) {
	building.find({ _id: req.params.id }, function (err, data) {
		if(err)return next(err);
		res.send(data[0]);
	});
});

router.get('/get_img/:id', function (req, res, next) {
	img_list.find({ build_id: req.params.id }, function (err, data) {
		if(err)return next(err);
		res.send(data);
	})
});

router.get('/delete/:id',isAdmin, function (req, res, next) {
	building.findById(req.params.id).remove().exec(function(err){
		if(err) return next(err);
	});
	res.redirect('/campus/newData');
});

router.get('/delete_img/:id',isAdmin, function (req, res, next) {
	img_list.findById(req.params.id, function (err, data) {
		if(err)return next(err);
		fs.unlink('./public/campus/' + data.fileName, function (e) {
			if (e) return next(e);
			else {
				img_list.findById(req.params.id).remove().exec(function(err){
					if(err) return next(err);
				});
			}
			res.redirect('/campus/newData');
		});
	});
});

router.get('/delete_mapObj/:id',isAdmin, function (req, res, next) {
	console.log(req.params.id);
	map_obj.findById(req.params.id, function (err, data) {
		if(err)return next(err);
		if(data.build_type==="SOS"||data.build_type==="AED"){
			map_obj.findById(req.params.id).remove().exec(function(err){
				if(err) return next(err);
			});
			res.redirect('/campus/editMap');
		}
		else{
			fs.unlink('./public/campus/' + data.fileName, function (e) {
				if (e) return next(e);
				else {
					map_obj.findById(req.params.id).remove().exec(function(err){
						if(err) return next(err);
					});
				}
				res.redirect('/campus/editMap');
			});
		}
	});
});

router.post('/add',isAdmin, function (req, res, next) {
	if (req.body.button == "update") {
		building.update({ _id: req.body.bid }, {
			name: req.body.name,
			type: req.body.type,
			content: req.body.content,
			SOS: req.body.SOS == 0 ? false : true,
			AED: req.body.AED == 0 ? false : true,
			updated_at: Date.now()
		}, function (err) {
			if(err)return next(err);
			if (err)
				console.log(err);
		});
	}
	else {
		var b = new building({
			name: req.body.name,
			type: req.body.type,
			content: req.body.content,
			SOS: req.body.SOS == 0 ? false : true,
			AED: req.body.AED == 0 ? false : true,
			updated_at: Date.now()
		}).save();
	}
	res.redirect('/campus/newData');
});

router.post('/newMapObj',isAdmin, function (req, res, next) {
	// console.log(req.body.button);
	if(req.body.button!="edit"){
		var form = new formidable.IncomingForm();
		form.parse(req, function (err, fields, files) {
			if (err) {
				console.log(err);
				return next(err);
			}
			console.log('received fields: ');
			console.log(fields);
			console.log('received files: ');
			console.log(files);

			var uploadedFile = files.uploadMapImg;
			var tmpPath = uploadedFile.path;
			var fileName = shortId.generate() + uploadedFile.name.substr(uploadedFile.name.lastIndexOf('.'));
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
			building.findById(fields.map_obj_id).exec(function(err,data){
				console.log(fields.map_obj_id);
				console.log(data);
				if(err)return next(err);
				new map_obj({
					build_name: data.name,
					build_type: data.type,
					build_id: fields.map_obj_id,
					SOS: data.SOS,
					AED: data.AED,
					path: '/campus/' + fileName,
					fileName: fileName,
					x_position: fields.x_position,
					y_position: fields.y_position,
					size: 8
				}).save(function(){
					res.redirect('/campus/editMap');
				});

				readStream.on("end", function () {
					fs.unlink(tmpPath);
				}).pipe(writeStream);

			});
		});
	}
	else{
		map_obj.findById(req.body.mapObj_id,function(err,data){
			if(err)return next(err);
			building.findById(data.build_id,function(err,build){
				if(err)return next(err);
				map_obj.update({_id:req.body.mapObj_id},{
					$set: {
						build_name: build.name,
						build_type: build.type,
						x_position: req.body.x_position,
						y_position: req.body.y_position,
						size: req.body.size,
						SOS: build.SOS,
						AED: build.AED
					}
				},function(e){
					if(e) return next(e);
				});
				if(data.SOS===true){
					map_obj.update({_id:req.body.mapObj_id},{
						$set: {
							SOSx: req.body.SOSx,
							SOSy: req.body.SOSy,
						}
					},function(e){
						if(e) return next(e);
					});
				}
				if(data.AED===true){
					map_obj.update({_id:req.body.mapObj_id},{
						$set: {
							AEDx: req.body.AEDx,
							AEDy: req.body.AEDy,
						}
					},function(e){
						if(e) return next(e);
					});
				}
			})
		})
		res.redirect('/campus/editMap');
	}
});

router.post('/imgUpload',isAdmin, function (req, res, next) {

	var form = new formidable.IncomingForm();
	form.parse(req, function (err, fields, files) {
		if (err) {
			console.log("上傳err");
			return next(err);
		}
		else{
			// console.log('received fields: ');
			// console.log(fields);
			// console.log('received files: ');
			// console.log(files);

			var uploadedFile = files.uploadingImg;
			var tmpPath = uploadedFile.path;
			var fileName = shortId.generate() + uploadedFile.name.substr(uploadedFile.name.lastIndexOf('.'));
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

			var readStream = fs.createReadStream(tmpPath);
			var writeStream = fs.createWriteStream(targetPath);
			var a = new img_list({
				build_id: fields.imgid,
				img_path: '/campus/' + fileName,
				fileName: fileName
			});
			a.save();
			readStream.on("end", function () {
				fs.unlink(tmpPath, function (err) {
					if(err)next(err);
					res.send(a);
				});
			}).pipe(writeStream);


			console.log(fields.imgid);
		}
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
