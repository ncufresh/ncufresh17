var express = require('express');
var router = express.Router();
var Qna = require('../models/qna');

// 讀取頁面
router.get('/', function(req, res, next) {
  console.log(req.user);
  Qna.find({}).sort({ view: 'desc' }).exec(function(err, qna) {
    if (err)
      throw err;

    var typeToName = [
      "校園生活",
      "學生事務",
      "宿舍生活",
      "其他"
    ];
    res.render('qna/index', {
      title: 'QnA',
      user: req.user,
      typeToName: typeToName,
      renderTime: renderTime,
      qna: qna
    });
  });
});

// 新增問題
router.post('/', isLoggedIn, function(req, res) {
  var qna = new Qna();
  qna.userId = req.user._id;
  qna.type = checkType(req.type);
  qna.title = req.body.title;
  qna.content = req.body.content;
  qna.save();
  res.redirect('/qna');
});

function checkType(type) {

  if (type > 3 || type < 0) {
    return 3;
  }

  return round(type);
}

function isLoggedIn(req, res, next) {

  if (!req.isAuthenticated()) {
    res.redirect('/login');
  }

  return next();
}

function renderTime(date) {
  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();
  var time = year + '/' + (++monthIndex) + '/' + day;
  return time;
}

module.exports = router;