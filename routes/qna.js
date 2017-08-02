var express = require('express');
var router = express.Router();
var Qna = require('../models/qna');

// 讀取頁面
router.get('/', function(req, res, next) {
  Qna.find({}).sort({ view: 'desc' }).exec(function(err, qna) {
    if (err)
      throw err;

    var typeToName = [
      "其他",
      "校園生活",
      "學生事務",
      "宿舍生活"
    ];

    var renderTime = function(date) {
      var day = date.getDate();
      var monthIndex = date.getMonth();
      var year = date.getFullYear();
      var time = year + '/' + (++monthIndex) + '/' + day;
      return time;
    }

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
  qna.type = (function(reqBodyType) {
    if (reqBodyType > 3 || reqBodyType < 0)
      return 3;
    else
      return Math.round(reqBodyType);
  })(req.body.type);
  qna.title = req.body.title;
  qna.content = req.body.content;
  qna.save(function(err) {
    if (err)
      return handleError(err);
    else
      res.redirect('/qna/?post=success');
  });
});

function isLoggedIn(req, res, next) {
  if (!req.isAuthenticated())
    res.redirect('/login');
  else
    return next();
}

module.exports = router;