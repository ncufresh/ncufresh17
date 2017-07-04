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
router.get('/add_de', function(req, res, next) {
  res.render('groups/add_de', { title: 'groups' });
});
router.get('/add_club', function(req, res, next) {
  res.render('groups/add_club', { title: 'groups' });
});
router.get('/add_or', function(req, res, next) {
  res.render('groups/add_or', { title: 'groups' });
});

module.exports = router;
