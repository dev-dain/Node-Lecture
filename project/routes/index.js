const express = require('express');
const router = express.Router();
const template = require('../lib/template');

router.get('/', (req, res) => {
  const login = '';
  
  const title = "Index Page";
  const content = 
    "<img src='/img/pic.jpg' style='max-width: 300px; height: auto' alt='고양이'>";
  const list = template.list(req.list);
  const create = template.create();
  const html = template.html(title,
    `${content}`, list, create, login);
  res.status(200).send(html);
});

module.exports = router;