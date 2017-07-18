var express = require('express');
var router = express.Router();
var shortId = require('shortid');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('life/index', { title: 'life', user: req.user});
});
router.get('/food', function(req, res, next) {
  res.render('life/food', { title: 'food', user: req.user});
});

module.exports = router;
