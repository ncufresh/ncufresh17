var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('life/index', { title: 'life' });
});
router.get('/food', function(req, res, next) {
  res.render('life/food', { title: 'food' });
});
router.get('/dorm', function(req, res, next) {
  res.render('life/dorm', { title: 'dorm' });
});
router.get('/traffic', function(req, res, next) {
  res.render('life/traffic', { title: 'traffic' });
});
router.get('/study', function(req, res, next) {
  res.render('life/study', { title: 'study' });
});
router.get('/entertainment', function(req, res, next) {
  res.render('life/entertainment', { title: 'entertainment' });
});

module.exports = router;
