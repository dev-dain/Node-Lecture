const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const fileStore = require('session-file-store')(session);
const app = express();
const PORT = 3000;

app.use(cookieParser());

app.use(session({
  secret: '41jklgakldq4515cast',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    maxAge: 1000*60*60*24
  },
  store: new fileStore()
}));

app.get('/', (req, res, next) => {
  if (!req.session.nickname)
    req.session.nickname = 'dain';
  next();
});

app.get('*', (req, res) => {
  res.cookie('myCookie', 'Choco', {
    maxAge: 10000
  });
  res.cookie('name', 'dain', {
    maxAge: 100000,
    httpOnly: true
  });
  res.cookie('cookiecookie', 'strawberry', {
    maxAge: 10000,
    httpOnly: true,
    secure: true
  });

  console.log(req.cookies);
  res.send(`My cookie is ${req.cookies.myCookie} by ${req.session.nickname}`);
});

app.listen(PORT, () => console.log(`Node on ${PORT}!`));