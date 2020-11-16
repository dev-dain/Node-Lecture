const path = require('path');

module.exports = {
  html: (title, content, list, cud, login='<a href="/auth/login">login</a>') => `
  <!doctype>
  <html lang="ko">
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width">
      <link rel="stylesheet" href="/css/style.css">
    </head>
    <body>
      <div id="wrap">
      ${login}
      <header>
        <h1>
          <a href="/">Welcome to Node Page!</a>
        </h1>
      </header>
      <div class="container">
      <div class="list">
        ${list}
      </div>
      <div class="cud">
        ${cud}
      </div>
      <section>
        <h2>${title}</h2>
        <article>
          <p>${content}</p>
        </article>
      </section>
      </div>
      <footer>
        2020 Dukboon
      </footer>
      </div>
    </body>
  </html>
  `, list: (files) => {
    let list = '<ol>';

    files.forEach(file => {
      const name = file.title;
      const id = file.id;
      list += `<li><a href="/article/${id}">${name}</a></li>`
    });
    list += '</ol>';
    return list;
  }, create: () => '<a class="btn" href="/article/create">글쓰기</a>',
  updateDelete: (name='') => 
  `
    <a class="btn" href="/article/update/${name}">수정</a>
    <form action="/article/delete" method="post">
      <input type="hidden" name="title" value="${name}" readonly>
      <input type="submit" value="삭제">
    </form>
  `
}