var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('about/index', { title: '關於我們 | 新生知訊網', user: req.user });
});
router.get('/markting', function(req, res, next) {
  res.render('about/markting', { title: '行銷企劃組 | 新生知訊網', user: req.user });
});
router.get('/programming', function(req, res, next) {
  res.render('about/programming', { title: '程式設計組 | 新生知訊網', user: req.user });
});
router.get('/ceo', function(req, res, next) {
  res.render('about/ceo', { title: '執行組 | 新生知訊網', user: req.user });
});
router.get('/art', function(req, res, next) {
  res.render('about/art', { title: '網路美工組 | 新生知訊網', user: req.user });
});
router.get('/video', function(req, res, next) {
  res.render('about/video', { title: '媒體影音組 | 新生知訊網', user: req.user });
});

module.exports = router;