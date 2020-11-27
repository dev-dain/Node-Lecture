const passport = require('passport');
const getConnection = require('../lib/db');

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
};