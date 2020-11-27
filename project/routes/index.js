const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const nickname = req.user ? req.user.name : '';
  const title = "Index Page";
  const content = 
    "<img src='/img/pic.jpg' style='max-width: 300px; height: auto' alt='고양이'>";

  res.render('basic', {
    nickname,
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