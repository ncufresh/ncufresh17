var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('about/index', { title: 'about' });
});
router.get('/markting', function(req, res, next) {
  res.render('about/markting', { title: 'about' });
});
router.get('/programming', function(req, res, next) {
  res.render('about/programming', { title: 'about' });
});
router.get('/ceo', function(req, res, next) {
  res.render('about/ceo', { title: 'about' });
});
router.get('/art', function(req, res, next) {
  res.render('about/art', { title: 'about' });
});
router.get('/video', function(req, res, next) {
  res.render('about/video', { title: 'about' });
});

module.exports = router;
