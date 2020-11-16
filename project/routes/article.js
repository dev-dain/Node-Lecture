const express = require('express');
const router = express.Router();
const sanitizeHtml = require('sanitize-html');
const getConnection = require('../lib/db');

router.get('/create', (req, res) => {
  const title = "Create";

  res.render('create', { title, list: req.list }, (err, html) => {
    if (err)
      next(err);
    res.status(200).send(html);
  });
});

router.post('/create', (req, res) => {
  const title = sanitizeHtml(req.body.title);
  const content = sanitizeHtml(req.body.content, {
    allowedTags: ['em', 'strong', 'h1']
  });

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
          res.render('update', {
            title,
            list: req.list,
            id: req.params.id,
            article_title: result[0].title,
            article_content: result[0].content
          }, (err, html) => {
            if (err)
              next(err);
            res.status(200).send(html);
          });
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

        const title = results[0].TITLE;
        const content = results[0].CONTENT;

        res.render('basic', {
          title,
          id: req.params.id,
          content,
          list: req.list
        }, (err, html) => {
          if (err)
            next(err);
          res.status(200).send(html);
        })
      });
    conn.release();
  });
});

module.exports = router;