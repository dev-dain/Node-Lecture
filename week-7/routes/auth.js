const express = require('express');
const router = express.Router();
const sanitizeHtml = require('sanitize-html');
const template = require('../lib/template');
const fs = require('fs');

//밖에서 app.use('/topic', topicRouter); 로 쓰고 있기 때문에
//기본으로 /topic이다. 앞의 /topic은 없애야 함

router.get('/login', function (req, res) {
  var title = 'WEB - login';
  var list = template.list(req.list);
  let msg = JSON.stringify(req.flash().error);
  msg = (!msg) ? '' : msg.slice(2, msg.length - 2);
  var html = template.html(title, list, `
            <p style="color: red">
            ${msg}
            </p>
            <form action="/auth/login_process" method="post">
              <p><input type="text" name="email" placeholder="email"></p>
              <p>
              <input type="password" name="pwd" placeholder="password">
              </p>
              <p>
                <input type="submit" value="login">
              </p>
            </form>
          `, '');
  res.status(200).send(html);
});

module.exports = router;