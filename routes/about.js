var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('about/index', { title: 'about', user: req.user });
});
router.get('/markting', function(req, res, next) {
  res.render('about/markting', { title: 'about', user: req.user });
});
router.get('/programming', function(req, res, next) {
  res.render('about/programming', { title: 'about', user: req.user });
});
router.get('/ceo', function(req, res, next) {
  res.render('about/ceo', { title: 'about', user: req.user });
});
router.get('/art', function(req, res, next) {
  res.render('about/art', { title: 'about', user: req.user });
});
router.get('/video', function(req, res, next) {
  res.render('about/video', { title: 'about', user: req.user });
});

module.exports = router;
