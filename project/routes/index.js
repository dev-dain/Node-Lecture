const express = require('express');
const router = express.Router();
const template = require('../lib/template');

router.get('/', (req, res) => {
  const login = '';
  const title = "Index Page";
  const content = 
    "<img src='/img/pic.jpg' style='max-width: 300px; height: auto' alt='고양이'>";

  res.render('basic', {
    title,
    content,
    list: req.list
  }, (err, html) => {
    if (err)
      next(err);
    res.status(200).send(html);
  });
});

module.exports = router;