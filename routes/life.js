var express = require('express');
var router = express.Router();
var shortId = require('shortid');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('life/index', { title: 'life', user: req.user });
});
router.get('/food', function(req, res, next) {
  res.render('life/food', { title: 'food', user: req.user });
});
router.get('/dorm', function(req, res, next) {
  res.render('life/dorm', { title: 'dorm', user: req.user });
});
router.get('/traffic', function(req, res, next) {
  res.render('life/traffic', { title: 'traffic', user: req.user });
});
router.get('/study', function(req, res, next) {
  res.render('life/study', { title: 'study', user: req.user });
});
router.get('/entertainment', function(req, res, next) {
  res.render('life/entertainment', { title: 'entertainment', user: req.user });
});

module.exports = router;
