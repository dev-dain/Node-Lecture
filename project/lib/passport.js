const bcrypt = require('bcrypt');
const passport = require('passport');
const kakaoStrategy = require('passport-kakao').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const sanitizeHtml = require('sanitize-html');

const salt = require('./salt');
const clientID = require('./kakao');
const getConnection = require('./db');

const kakaoKey = {
  clientID,
  callbackURL: '/auth/kakao/callback'
};

module.exports = () => {
  //req.login(), passport.authenticate() 성공 시 1회만 호출
  passport.serializeUser((user, done) => {
    done(null, user.email);
  });

  //로그인 이후 세션에 있는 정보를 토대로 사용자 validation을 확인함
  passport.deserializeUser((email, done) => {
    getConnection(conn => {
      conn.query(`SELECT * FROM user WHERE email=?`, [email], (err, result) => {
        if (err)
          next(err);
        if (result[0].length === 0) return false;
        done(null, result[0]);  //req.user라는 프로퍼티에 value 값으로 들어감
      });
    });
  });

  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'pw',
    session: true,
    passReqToCallback: true
  }, (req, username, password, done) => {
    getConnection(conn => {
      conn.query(`select * from user where email=?`,
      [sanitizeHtml(req.body.email)], (err, result) => {
        if (err) {
          next(err);
        return done(err);
        } else {
          if (bcrypt.compareSync(sanitizeHtml(req.body.pw), result[0].pw)) {
            req.session.save(err2 => {
              if (err2)
                next(err2);
              return done(null, result[0]);
            });
          } else {
            console.log('패스워드 불일치');
            return done(null, false, { msg: 'Incorrect password' });
          }
        }
      });
      conn.release();
    });  
  }));
  
  passport.use('kakao-login', 
    new kakaoStrategy(kakaoKey, (accessToken, refreshToken, profile, done) => {
      const newUserEmail = profile._json.kakao_account.email;
      const newUserName = profile.username;
      let newUserPassword;
      bcrypt.hash(profile.id+'', salt, (err, hash) => {
        if (err)
          console.error(err);
        newUserPassword = hash;
  
        getConnection(conn => {
          //해당 email을 가진 user가 있는지 찾아보기
          conn.query('SELECT * FROM user WHERE email=?', [newUserEmail], (err, results) => {
            if (err) {
              console.error(err);
              return done(err);
            }
            //해당 유저가 없다면 
            //새로운 아이디를 만들어주고 로그인시키기
            if (results.length === 0) {
              conn.query('INSERT user (email, pw, name) values (?, ?, ?)',
              [newUserEmail, newUserPassword, newUserName], (err2, result2) => {
                if (err2) {
                  console.error(err2);
                  return done(err2);
                }
                conn.query('SELECT * FROM user WHERE email=?', [newUserEmail], (err3, result3) => {
                  if (err3) {
                    console.error(err3);
                    return done(err3);
                  }
                  const user = result3[0];
                  return done(null, user);
                });
              });
            } else {
              //해당 유저가 이미 있는 경우
              const user = results[0];
              return done(null, user);
            }
          })
        });
      });
    }));
};