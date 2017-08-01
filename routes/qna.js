var express = require('express');
var router = express.Router();
var Qna = require('../models/qna');

// 讀取頁面
router.get('/', function(req, res, next) {
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
  Qna({
    userId: req.user._id,
    type: checkType(req.body.type),
    title: req.body.title,
    content: req.body.content
  }).save(function(err, doc) {
    if (err)
      res.json(err);
    else
      res.redirect('/qna/?post=success');
  });

  res.redirect('/');
});

function checkType(type) {

  if (type > 3 || type < 0)
    return 3;
  else
    return Math.round(type);
}

function isLoggedIn(req, res, next) {

  if (!req.isAuthenticated())
    res.redirect('/login');
  else
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