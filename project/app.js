const express = require('express');
const app = express();
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const lokiStore = require('connect-loki')(session);
const compression = require('compression');
const bcrypt = require('bcrypt');
const passport = require('passport');
const kakaoStrategy = require('passport-kakao').Strategy;

const indexRouter = require('./routes/index');
const articleRouter = require('./routes/article');
const authRouter = require('./routes/auth');

const getConnection = require('./lib/db');
const salt = require('./lib/salt');
const passportConfig = require('./lib/passport');
const clientID = require('./lib/kakao');

const PORT = 3000;
const kakaoKey = {
  clientID,
  callbackURL: '/auth/kakao/callback'
};

passportConfig();
app.use(helmet());
app.use(compression());
app.post('*', express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(express.static('views'));
app.use(express.static('uploads'));
app.set('view engine', 'pug');

app.use(cookieParser());

app.use(session({
  secret: '41jklgakldq4515cast',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    maxAge: 1000*60*60*24
  },
  store: new lokiStore()
}));
app.use(passport.initialize());
app.use(passport.session());

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

app.get('*', (req, res, next) => {
  getConnection(conn => {
    conn.query(`SELECT title, id FROM article ORDER BY created_time desc`, (err, results) => {
      if (err)
        next(err);
      req.list = results;
      next();
    });
    conn.release();
  });
  console.log("user:", req.user);
  console.log("session:", req.session);
});

app.use('/', indexRouter);
app.use('/article', articleRouter);
app.use('/auth', authRouter);

app.use((req, res, next) => {
  res.status(404).send('Sorry! Wrong path.');
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send('Sorry!');
});

app.listen(PORT, () => console.log('node on 3000'));