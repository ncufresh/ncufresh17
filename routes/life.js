var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('life/index', { title: 'life' });
});
router.get('/food', function(req, res, next) {
  res.render('life/food', { title: 'food' });
});

module.exports = router;
