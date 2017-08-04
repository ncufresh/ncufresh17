var express = require('express');
var router = express.Router();
var sanitize = require('../lib/sanitize');
var Qna = require('../models/qna');

// 測試
router.get('/test', function(req, res, next) {
  var err = new Error({});
  err.messang = 'error test';
  if (err) {
    next(err);
  }
});

// 讀取頁面
router.get('/', function(req, res, next) {
  // 用觀看次數排序
  Qna.find({}).sort({ view: 'desc' }).exec(function(err, qna) {

    // Array：用來將資料庫 type 欄位的數字轉換成文字
    // ex: typeToName[ 1 ] === "校園生活"
    var typeToName = [
      "其他",
      "校園生活",
      "學生事務",
      "宿舍生活"
    ];

    // function：用來將資料庫 updated 欄位的時間轉換成日期
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

// 當前端點選問題時會傳送 xhr 到這裡
router.get('/:id', function(req, res, next) {
  if (!req.xhr)
    next(err);

  // 依據 api_token 尋找相對應的 Qna
  Qna.findById(req.params.id, function(err, qna) {
    if (err)
      next(err);

    // 增加瀏覽次數
    qna.view++;
    qna.save(function(err) {
      if (err)
        next(err);
      // 回傳 title, content, answer
      res.json({
        title: qna.title,
        content: qna.content,
        answer: qna.answer
      });
    });
  });
});

// 新增問題
router.post('/', isLoggedIn, function(req, res, next) {
  var qna = new Qna();
  qna.userId = req.user._id;
  // Immediately-Invoked Function Expression (IIFE)
  qna.type = (
    function(reqBodyType) {
      if (reqBodyType > 3 || reqBodyType < 0)
        return 3;
      return Math.round(reqBodyType);
    }
  )(req.body.type);

  qna.title = sanitize(req.body.title);
  qna.content = sanitize(req.body.content);
  qna.save(function(err) {
    if (err)
      next(err);
    res.redirect('/qna/?post=success');
  });
});

// 回答問題
router.post('/answer/:id', isAdmin, function(req, res, next) {
  Qna.findById(req.params.id, function(err, qna) {
    if (err)
      next(err);
    qna.answer = req.body.answer;
    qna.save(function(err) {
      if (err)
        next(err);
      else {
        res.redirect('/qna');
      }
    });
  });
});

// 刪除問題
router.post('/delete/:id', isAdmin, function(req, res) {
  Qna.findByIdAndRemove(req.params.id, function(err, qna) {
    res.redirect('/qna/?delete=success');
  });
});

function isLoggedIn(req, res, next) {
  if (!req.isAuthenticated())
    res.redirect('/login');
  else
    return next();
}

function isAdmin(req, res, next) {
  if (req.isAuthenticated()) {
    if (req.user.local.accountType === 'admin') {
      return next();
    }
  }
  res.redirect('/qna');
}

module.exports = router;