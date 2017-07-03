var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('video/index', { title: 'video' });
});
router.get('/life', function(req, res, next) {
  res.render('video/life', { title: 'life' });
});
router.get('/visit', function(req, res, next) {
  res.render('video/visit', { title: 'visit' });
});

module.exports = router;