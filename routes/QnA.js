var express = require('express');
var router = express.Router();

// 讀取頁面
router.get('/', function(req, res, next) {
  res.render('QnA/index', { title: 'QnA', user: req.user });
});

// 新增問題
router.post('/', function(req, res){
  // post a question
});

module.exports = router;
