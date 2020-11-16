const express = require('express');
const router = express.Router();
const fs = require('fs');
const template = require('../lib/template');
const sanitizeHtml = require('sanitize-html');
const getConnection = require('../lib/db');

router.get('/create', (req, res) => {
  const login = '';
  const title = "Create";
  const content =
    `
  <form action="/article/create" method="post">
  <p>
    <input type="text" name="title" placeholder="title">
  </p>
  <p>
    <textarea name="content"></textarea>
  </p> 
  <input type="submit" value="글쓰기">
  </form>
  `;
  const list = template.list(req.list);
  const create = template.create();
  const html = template.html(title, content, list,
    create, login);
  res.status(200).send(html);
});

router.post('/create', (req, res) => {
  const title = sanitizeHtml(req.body.title);
  const content = sanitizeHtml(req.body.content, {
    allowedTags: ['em', 'strong', 'h1']
  });
  // fs.writeFile(`./data/${title}.txt`, content, 'utf8', () => {
  //   res.redirect(302, `/article/${title}`);
  // });
  getConnection(conn => {
    conn.query(`INSERT INTO article (title, content, created_time, author_id) values (?, ?, now(), 1)`,
      [title, content], (err, result) => {
        if (err)
          next(err);
        res.redirect(302, `/article/${result.insertId}`);
      });
    conn.release();
  });
});

router.get('/update/:id', (req, res, next) => {
  getConnection(conn => {
    conn.query(`SELECT id, title, content FROM article WHERE id=?`,
      [req.params.id], (err, result) => {
        if (err)
          next(err);
        const title = `Update - ${result[0].title}`;
        const content =
          `
    <form action="/article/update" method="post">
      <p>
        <input type="hidden" name="id" value="${req.params.id}" readonly>
        <input type="text" name="title" placeholder="title"
        value="${result[0].title}">
      </p>
      <p>
        <textarea name="content">${result[0].content}</textarea>
      </p>
      <input type="submit" value="수정하기">
    </form>
    `;
        const login = '';
        const list = template.list(req.list);
        const create = template.create();
        const updateDelete = template.updateDelete(req.params.id);
        const html = template.html(title, content, list,
          `${create}${updateDelete}`, login);
        res.status(200).send(html);
      });
    conn.release();
  });
});

router.post('/update', (req, res) => {
  const id = req.body.id;
  const title = sanitizeHtml(req.body.title);
  const content = sanitizeHtml(req.body.content, {
    allowedTags: ['em', 'strong', 'h1']
  });
  getConnection(conn => {
    conn.query(`UPDATE article SET title=?, content=? WHERE id=?`,
    [title, content, id], (err, result) => {
      if (err)
        next(err);
      res.redirect(302, `/article/${id}`);
    });
    conn.release();
  });
})

router.post('/delete', (req, res) => {
  const id = req.body.id;

  getConnection(conn => {
    conn.query(`DELETE FROM article WHERE id=?`, [id], (err, result) => {
      res.redirect(302, '/');
    });
    conn.release();
  });
});

router.get('/:id', (req, res, next) => {
  getConnection(conn => {
    conn.query(`SELECT ID, TITLE, CONTENT FROM ARTICLE WHERE ID=?`,
      [req.params.id], (err, results) => {
        if (err)
          next(err);

        console.log(results);
        const login = '';
        const title = results[0].TITLE;
        const content = results[0].CONTENT;
        const list = template.list(req.list);
        const create = template.create();
        const updateDelete = template.updateDelete(results[0].ID);

        const html = template.html(title, content, list,
          `${create}${updateDelete}`, login);
        res.status(200).send(html);
      });
    conn.release();
  });
});

module.exports = router;