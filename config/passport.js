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
        if (user) {
          return done(null, false, req.flash('signupMessage', '已有相同帳號被註冊'));
        } else {
          var newUser = new User();
          newUser.local.email = sanitize(email);
          newUser.local.password = newUser.generateHash(password);
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

  passport.use('provider', new OAuth2Strategy({
      authorizationURL: 'https://api.cc.ncu.edu.tw/oauth/oauth/authorize',
      tokenURL: 'https://api.cc.ncu.edu.tw/oauth/oauth/token',
      clientID: 'YjcxNTlhODMtYTdjZC00YWQ1LThhYzYtZWQ4MTU1MWI0M2M4',
      clientSecret: '8833036ce15345e4705d54c6ae9f10b18eb8e6cb9ecf6c77ac945655aa6d36e4a8e1c64de14887ef4575b39d835ff223d9edb05635cdc2b0a1912e8d28c2c221',
      // callbackURL: 'ncufresh17.tk:3000/auth/provider/callback'
    },
    function(accessToken, refreshToken, profile, done) {
      // console.log(accessToken);
    }
  ));



}
