const express = require('express');
const app = express();
const path = require('path');
const pug = require('pug');

app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

app.get('/', (req, res) => {
  res.render('basic', (err, html) => {
    if (err) throw err;
    res.status(200).send(html);
  });
});

app.listen(3000, () => console.log('node on 3000'));