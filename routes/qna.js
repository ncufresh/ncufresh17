var express = require('express');
var router = express.Router();
var Qna = require('../models/qna');

// 讀取頁面
router.get('/', function(req, res, next) {
  console.log(req.user);
  Qna.find({}).sort({ view: 'desc' }).exec(function(err, qna) {
    res.render('qna/index', {
      title: 'QnA',
      user: req.user,
      qna: qna
    });
  });
});

// 新增問題
router.post('/', function(req, res) {
  var qna = new Qna();
  qna.userId = req.userid;
  qna.type = req.type;
  qna.title = req.body.title;
  qna.content = req.body.content;
  qna.save();
  res.send(req.body);
});

module.exports = router;