var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('groups/index', { title: 'groups' });
});
router.get('/club', function(req, res, next) {
  res.render('groups/club', { title: 'groups' });
});
router.get('/department', function(req, res, next) {
  res.render('groups/department', { title: 'groups' });
});
router.get('/organization', function(req, res, next) {
  res.render('groups/organization', { title: 'groups' });
});

module.exports = router;
