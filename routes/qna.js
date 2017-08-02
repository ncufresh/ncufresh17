var express = require('express');
var router = express.Router();
var Qna = require('../models/qna');

// 讀取頁面
router.get('/', function(req, res, next) {
  // 用觀看次數排序
  Qna.find({}).sort({ view: 'desc' }).exec(function(err, qna) {
    if (err)
      throw err;

    // Array：用來將資料庫 type 欄位的數字轉換成文字
    // ex: typeToName[ QnA.type = 1 ] === "校園生活"
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
router.get('/api/:id', function(req, res) {
  // 依據 api_token 尋找相對應的 Qna
  Qna.findById(req.params.id, function(err, qna) {
    if (err)
      res.send(err);
    else {
      // 增加瀏覽次數
      qna.view++;
      qna.save(function(err) {
        if (err)
          throw err;
        // 回傳 title, content, answer
        else
          res.json({
            title: qna.title,
            content: qna.content,
            answer: qna.answer
          });
      });
    }
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