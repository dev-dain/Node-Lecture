const express = require('express');
const app = express();
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const lokiStore = require('connect-loki')(session);
const compression = require('compression');
const passport = require('passport');

const indexRouter = require('./routes/index');
const articleRouter = require('./routes/article');
const authRouter = require('./routes/auth');

const getConnection = require('./lib/db');
const passportConfig = require('./lib/passport');

const PORT = 3000;

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