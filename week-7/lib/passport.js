module.exports = function (app) {
  const passport = require('passport');
  const LocalStrategy = require('passport-local').Strategy;

  let authData = {
    email: 'dev@gmail.com',
    pwd: '1',
    nickname: 'dev'
  }

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, done) => {
    done(null, user.email);
  });
  passport.deserializeUser((email, done) => {
    done(null, authData);
  });

  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'pwd'
  }, function (username, password, done) {
    if (username === authData.email) {
      if (password === authData.pwd) {
        return done(null, authData);
      } else {
        return done(null, false, { message: 'Incorrect password' });
      }
    } else {
      return done(null, false, { message: 'Incorrect username' });
    }
  }
  ));
  return passport;

}