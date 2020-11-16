const express = require('express');
const app = express();
const helmet = require('helmet');
const pug = require('pug');

const compression = require('compression');
const indexRouter = require('./routes/index');
const articleRouter = require('./routes/article');

const getConnection = require('./lib/db');

const PORT = 3000;

app.use(helmet());
app.use(compression());
app.post('*', express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(express.static('views'));
app.set('view engine', 'pug');

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
});

app.use('/', indexRouter);
app.use('/article', articleRouter);

app.use((req, res, next) => {
  res.status(404).send('Sorry! Wrong path.');
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send('Sorry!');
});

app.listen(PORT, () => console.log('node on 3000'));