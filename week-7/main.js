const express = require('express')
const app = express()
const fs = require('fs');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const session = require('express-session');
const lokiStore = require('connect-loki')(session);
const flash = require('connect-flash');

const topicRouter = require('./routes/topic');
const rootRouter = require('./routes/root');
const authRouter = require('./routes/auth');

app.use(helmet());
//'public' 디렉토리 안에서 static file을 찾겠다는 의미
app.use(express.static('public'));
//폼 데이터일 때 받는 방법
//사용자가 전송한 post 데이터를 내부적으로 받아서 콜백 호출,
app.post('*', bodyParser.urlencoded({ extended: false }));
app.use(compression());

app.use(session({
  secret: '!#%SAGTA@%Tdacr&%$#^WD',
  resave: false,
  saveUninitialized: true,
  store: new lokiStore()
}));
app.use(flash());
app.get('/flash', (req, res) => {
  req.flash('msg', 'Flash is back!!');
  res.send('flash');
});
app.get('/flash-display', (req, res) => {
  const fmsg = req.flash();
  console.log(fmsg);
  res.send(fmsg);
});

const passport = require('./lib/passport')(app);

app.post('/auth/login_process',
passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login',
  failureFlash: true
  })
);

app.get('*', (req, res, next) => {
  fs.readdir('./data', (error, filelist) => {
    req.list = filelist;
    next();
  });
});

//route, routing
app.use('/topic', topicRouter);
app.use('/auth', authRouter);
app.use('/', rootRouter);

app.get('/logout', (req, res) => {
  req.logOut();
  req.session.save((err) => {
    if (err) throw err;
    res.redirect('/');
  });
});

app.use((req, res, next) => {
  res.status(404).send('Not found');
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send('Sorry!');
});

app.listen(3001, () => console.log('Example app listening on port 3001!'));