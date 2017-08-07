var express = require('express');
var router = express.Router();
var sanitize = require('../lib/sanitize');
var Qna = require('../models/qna');

// 讀取頁面
router.get('/', function(req, res, next) {
  // 用觀看次數排序
  Qna.find().sort({ view: 'desc' }).exec(function(err, qna) {
    if (err)
      return next(err);

    // Array：用來將資料庫 type 欄位的數字轉換成中文文字
    // ex: typeToChineseName[ 1 ] === "校園生活"
    var typeToChineseName = [
      "其他",
      "校園生活",
      "學生事務",
      "宿舍生活"
    ];

    // Array：用來將資料庫 type 欄位的數字轉換成英文
    // ex: typeToEnglishName[ 1 ] === "school"
    var typeToEnglishName = [
      "other",
      "school",
      "student",
      "dorm"
    ];

    // function：用來將資料庫 updated 欄位的時間轉換成日期
    var renderTime = function(date) {
      var monthIndex = date.getMonth();
      var day = date.getDate();
      var time = (++monthIndex) + '/' + day;
      return time;
    }

    res.render('qna/index', {
      title: '新生Ｑ＆Ａ ｜ 新生知訊網',
      user: req.user,
      typeToChineseName: typeToChineseName,
      typeToEnglishName: typeToEnglishName,
      renderTime: renderTime,
      qna: qna
    });
  });
});

// 當前端點選問題時會傳送 xhr 到這裡
router.get('/:id', function(req, res, next) {
  // 非 xhr 回傳 404
  if (!req.xhr) {
    var err = new Error('Not Found');
    err.status = 404;
    return next(err);
  }

  // 依據 api_token 尋找相對應的 Qna
  Qna.findById(req.params.id, function(err, qna) {
    if (err || !qna)
      return next(err);

    // 增加瀏覽次數
    qna.view++;

    // 儲存瀏覽次數
    qna.save(function(err) {
      if (err)
        return next(err);
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
  // Immediately-Invoked Function Expression (IIFE)
  qna.type = (
    function(reqBodyType) {
      if (reqBodyType > 3 || reqBodyType < 0)
        return 3;
      return Math.round(reqBodyType);
    }
  )(req.body.type);

  qna.userId = req.user._id;
  qna.title = sanitize(req.body.title);
  qna.content = sanitize(req.body.content);
  qna.save(function(err) {
    if (err)
      return next(err);
    res.redirect('/qna/?post=success');
  });
});

// 當前端點選問題時會傳送 xhr 到這裡
router.get('/admin/:id', isAdmin, function(req, res, next) {
  // 非 xhr 回傳 404
  if (!req.xhr) {
    var err = new Error('Not Found');
    err.status = 404;
    return next(err);
  }

  // 依據 api_token 尋找相對應的 Qna
  Qna.findById(req.params.id, function(err, qna) {
    if (err || !qna)
      return next(err);

    // 回傳 title, content, answer
    res.json({
      title: qna.title,
      content: qna.content,
      answer: qna.answer,
      type: qna.type
    });
  });
});

// 管理員回答問題
router.post('/answer/:id', isAdmin, function(req, res, next) {
  Qna.findById(req.params.id, function(err, qna) {
    if (err)
      return next(err);
    qna.answer = req.body.answer;
    qna.type = req.body.type;
    qna.save(function(err) {
      if (err)
        return next(err);
      res.redirect('/qna');
    });
  });
});

// 管理員刪除問題
router.post('/deleteByAdmin/:id', isAdmin, function(req, res, next) {
  Qna.findByIdAndRemove(req.params.id, function(err, qna) {
    if (err)
      return next(err);
    res.json({ id: qna._id });
  });
});

// 使用者刪除問題 WIP
router.post('/deleteByUser/:id', isLoggedIn, function(req, res, next) {
  Qna.findById(req.params.id, function(err, qna) {
    if (err)
      return next(err);
    if (req.user._id === qna.userId) {
      res.json({ message: "刪除問題成功" });
    } else {
      res.json({ message: "你有問題嗎？" });
    }
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
}

function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.local.accountType === 'admin')
    return next();
  res.redirect('/qna');
}

module.exports = router;