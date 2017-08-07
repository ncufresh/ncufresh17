module.exports = function(req, res, next) {

  var openTime = new Date(2017, 7, 8, 8, 0, 0, 0);
  // openTime.toString() Tue Aug 08 2017 08:00:00 GMT+0800 (CST)

  var check = req.app.get('env') === 'development' ? true : (new Date().valueOf() >= openTime.valueOf());

  if (check)
    return next();
  res.render('comingsoon');
}