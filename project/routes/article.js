const express = require('express');
const router = express.Router();
const sanitizeHtml = require('sanitize-html');
const getConnection = require('../lib/db');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if ((file.originalname).match(/\.(jpg|jpeg|png|gif)$/i))
      cb(null, path.basename(file.originalname, ext) + '+' + Date.now() + ext);
    else
      console.log('This is not allowed');
  }
});

const upload = multer({
  storage,
  limits: {
    files: 10,
    fileSize: 10 * 1024 * 1024
  }
});

router.get('/create', (req, res) => {
  if (!req.session.isLogined) {
    res.redirect(403, '/auth/join');
  } else {
    const nickname = req.session.nickname ? req.session.nickname : '';
    const title = "Create";
  
    res.render('create', { title, list: req.list, nickname }, 
    (err, html) => {
      if (err)
        next(err);
      res.status(200).send(html);
    });
  }
});

router.post('/create', upload.single('image'), (req, res) => {
  const title = sanitizeHtml(req.body.title);
  const content = sanitizeHtml(req.body.content, {
    allowedTags: ['em', 'strong', 'h1']
  });

  const fileName = req.file ? req.file.filename : '';

  getConnection(conn => {
    conn.query(`SELECT ID FROM user WHERE EMAIL=?`, [req.session.email], (err, results) => {
      if (err)
        next(err);
      conn.query(`INSERT INTO article (TITLE, CONTENT, CREATED_TIME, AUTHOR_ID, IMAGE) VALUES (?, ?, now(), ?, ?)`,
      [title, content, results[0].ID, `${fileName}`],
      (err2, result) => {
        console.log(result);
        if (err2)
          next(err2);
        res.redirect(302, `/article/${result.insertId}`);
      });
    });
    conn.release();
  });
});

router.get('/update/:id', (req, res, next) => {
  const nickname = req.session.nickname ? req.session.nickname : '';
  getConnection(conn => {
    conn.query(`SELECT * FROM article INNER JOIN user ON article.AUTHOR_ID=user.ID where article.ID=?`,
      [req.params.id], (err, result) => {
        if (err)
          next(err);
        if (!req.session.isLogined || req.session.email !== result[0].email) {
          res.redirect(403, '/');
        } else {
          const title = `Update - ${result[0].title}`;
          res.render('update', {
            title,
            nickname,
            list: req.list,
            id: req.params.id,
            article_title: result[0].title,
            article_content: result[0].content
          }, (err, html) => {
            if (err)
              next(err);
            res.status(200).send(html);
          });
        }
      });
    conn.release();
  });
});

router.post('/update', upload.single('image'), (req, res) => {
  const id = req.body.id;
  const title = sanitizeHtml(req.body.title);
  const content = sanitizeHtml(req.body.content, {
    allowedTags: ['em', 'strong', 'h1']
  });

  console.log(req.file);
  const fileName = req.file ? req.file.filename : '';

  getConnection(conn => {
    conn.query(`UPDATE article SET title=?, content=?, image=? WHERE id=?`,
    [title, content, `${fileName}`, id], (err, result) => {
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
    conn.query(`SELECT IMAGE FROM article WHERE id=?`, [id], (err, results) => {
      if (err)
        next(err);
      fs.unlink(`/uploads/${IMAGE}`, () => { });
      conn.query(`DELETE FROM article WHERE id=?`, [id], (err, result) => {
        res.redirect(302, '/');
      });
    });
    conn.release();
  });
});

router.get('/:id', (req, res, next) => {
  const nickname = req.session.nickname ? req.session.nickname : '';
  const email = req.session.email ? req.session.email : '';
  getConnection(conn => {
    
    conn.query(`SELECT article.ID, user.ID, TITLE, CONTENT, EMAIL, NAME, IMAGE FROM ARTICLE INNER JOIN user ON article.AUTHOR_ID=user.ID where article.ID=?`,
      [req.params.id], (err, results) => {
        if (err)
          next(err);

        const title = results[0].TITLE;
        let content = results[0].CONTENT;
        const name = results[0].NAME; //누가 썼는지 보도록
        const image = results[0].IMAGE;
        
        content = image ?
          `<img src="/${image}" style='max-width:350px'><p>${content}</p>`
          : content;

        res.render('basic', {
          nickname,
          name,
          title,
          id: req.params.id,
          content,
          list: req.list,
          email,
          author: results[0].EMAIL
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