const express = require('express');
const router = express.Router();
const sanitizeHtml = require('sanitize-html');
const template = require('../lib/template');
const auth = require('../lib/auth');
const fs = require('fs');

//밖에서 app.use('/topic', topicRouter); 로 쓰고 있기 때문에
//기본으로 /topic이다. 앞의 /topic은 없애야 함

router.get('/create', function (req, res) {
  let authLogin = auth.auth(req, res);
  if (!req.user) {
    res.redirect(302, '/auth/login');
    return false;
  }
  var title = 'WEB - create';
  var list = template.list(req.list);
  var html = template.html(title, list, `
            <form action="/topic/create_process" method="post">
              <p><input type="text" name="title" placeholder="title"></p>
              <p>
                <textarea name="description" placeholder="description"></textarea>
              </p>
              <p>
                <input type="submit">
              </p>
            </form>
          `, '', authLogin);
  res.status(200).send(html);
});

//post를 할 때는 get이 아니라 post를 해야 함
router.post('/create_process', function (req, res) {
  var post = req.body;
  var title = post.title;
  var description = post.description;
  fs.writeFile(`./data/${title}`, description, 'utf8', function (err) {
    res.redirect(302, `/topic/${title}`);
  });
});

router.get('/:pageId', (req, res, next) => {
  fs.readFile(`./data/${req.params.pageId}`, 'utf8', function (err, description) {
    if (err) {
      //없는 파일을 찾았을 때
      next(err);
    } else {
      var title = req.params.pageId;
      var sanitizeTitle = sanitizeHtml(title);
      var sanitizeDescription = sanitizeHtml(description, {
        allowedTags: ['h2']
      });
      console.log(req.user);
      let authLogin = auth.auth(req, res);
      let authCUD = (!req.user) ? '' : `
      <a href="/topic/create">create</a> 
      <a href="/topic/update/${sanitizeTitle}">update</a>
      <form action="/topic/delete_process" method="post">
        <input type="hidden" name="id" value="${sanitizeTitle}">
        <input type="submit" value="delete">
      </form>
      `;
      var list = template.list(req.list);
      var html = template.html(sanitizeTitle, list,
        `<h2>${sanitizeTitle}</h2>${sanitizeDescription}`,
        authCUD, authLogin);
      res.status(200).send(html);
    }
  });
});

router.get('/update/:pageId', (req, res) => {
  let authLogin = auth.auth(req, res);
  if (!req.user) {
    res.redirect(302, '/auth/login');
    return false;
  }
  fs.readFile(`./data/${req.params.pageId}`, 'utf8', function (err, description) {
    var title = req.params.pageId;
    var list = template.list(req.list);
    var html = template.html(title, list,
      `
                <form action="/topic/update/${title}" method="post">
                <input type="hidden" name="id" value="${title}">
                <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                <p>
                  <textarea name="description" placeholder="description" value="${description}">${description}</textarea>
                </p>
                <p>
                  <input type="submit">
                </p>
              </form>
                `,
      `<a href="/topic/create">create</a> <a href="/topic/update/${title}">update</a>`,
      authLogin);
    res.status(200).send(html);
  });
});
router.post('/update/:pageId', (req, res) => {
  const post = req.body;
  const title = post.title;
  const description = post.description;
  fs.rename(`./data/${req.params.pageId}`, `./data/${title}`, function () {
    fs.writeFile(`./data/${title}`, description, 'utf8', function () {
      res.redirect(302, `/topic/${title}`);
    });
  });
});
router.post('/delete_process', (req, res) => {
  const post = req.body;
  const id = post.id;
  fs.unlink(`./data/${id}`, function () {
    res.redirect(302, '/');
  });
});

module.exports = router;