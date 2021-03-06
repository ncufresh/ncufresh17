var LocalStrategy = require('passport-local');
var User = require('../models/user');
var sanitize = require('../lib/sanitize');
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user){
      done(err, user);
    });
  });
  //登入
  passport.use('local-login', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  },
  function(req, email, password, done) {
    if (email)
      email = email.toLowerCase();
    process.nextTick(function() {
      User.findOne({ 'local.email' :  email }, function(err, user) {
        if (err)
          return done(err);
        if (!user)
          return done(null, false, req.flash('loginMessage', '帳號或密碼錯誤'));
        if (!user.validPassword(password))
          return done(null, false, req.flash('loginMessage', '帳號或密碼錯誤'));
        else
          return done(null, user);
      });
    });

  }));
  //註冊
  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },function(req, email, password, done) {
    if (email)
      email = email.toLowerCase();
    process.nextTick(function() {
      User.findOne({'local.email': email}, function(err, user) {
        if (err) {
          return done(err);
        }
        if(/@cc.ncu.edu.tw\s*$/.test(email)){
          return done(null, false, req.flash('signupMessage', '你不能用@cc.ncu.edu.tw做結尾 請用portal登入！'));
        }
        if (user) {
          return done(null, false, req.flash('signupMessage', '已有相同帳號被註冊！'));
        } else {
          var newUser = new User();
          newUser.local.name = sanitize(req.body.name);
          newUser.local.email = sanitize(email);
          newUser.local.password = newUser.generateHash(password);
          newUser.local.accountType = "normal";
          newUser.local.created = new Date();

          newUser.save(function(err) {
            if (err) {
              console.log(err);
              return done(null, false, req.flash('signupMessage', '不知名錯誤'));
            } else {
              return done(null, newUser);
            }
          });
        }
      });
    });
  }));

  // passport.use('provider', new OAuth2Strategy({
  //     authorizationURL: 'https://api.cc.ncu.edu.tw/oauth/oauth/authorize',
  //     tokenURL: 'https://api.cc.ncu.edu.tw/oauth/oauth/token',
  //     clientID: 'NjVlNTZjMjktYWViZC00M2YyLTk0NTctNDk3NTY5NjQ0NmM5',
  //     clientSecret: '19856e10b37e92998633e72477c4806ca8d368326d12e8b864e9fac09316e92ce242ca755f1a8d6e23b35e64393a2cfd7979c192fa605458ab312bfb18514e06',
  //     callbackURL: 'ncufresh17.tk:3000/auth/provider/callback'
  //   },
  //   function(accessToken, refreshToken, profile, done) {
  //     console.log(accessToken);
  //   }
  // ));



}
