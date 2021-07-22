const express = require('express');
const router = express.Router();
const template = require('../lib/template');
const auth = require('../lib/auth');

router.get('/', (req, res) => {
  console.log('/', req.user);
  var title = 'Welcome';
  var description = 'Hello, Node.js';

  let authLogin = auth.auth(req, res);
  var list = template.list(req.list);
  var html = template.html(title, list,
    `<h2>${title}</h2>${description}
    <img src="/img/photo.jpg" style="max-width: 100%; height: auto">`,
    `<a href="/topic/create">create</a>`, authLogin);
  res.status(200).send(html);
});

//꼭 export해주기
module.exports = router;