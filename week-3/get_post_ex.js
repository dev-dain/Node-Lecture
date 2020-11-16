const http = require('http');
const url = require('url');

http.createServer((req, res) => {
  const urlObj = url.parse(req.url, true);
  const pathName = urlObj.pathname;
  if (pathName === '/') {
    if (urlObj.search === null) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(`
      <html>
      <head>
        <meta charset="utf-8">
        <title>GET / POST 메소드 실험</title>
      </head>
      <body>
        <form action="/get" method="get">
          <label for="text"> 텍스트 </label>
          <input type="text" id="text" name="text">
          <input type="submit" value="GET">
        </form>
        <form action="/post" method="post">
          <label for="text"> 텍스트 </label>
          <input type="text" id="text" name="text">
          <input type="submit" value="POST">
        </form>
      </body>
    </html>
      `);
      res.end();
    }
  } else if (pathName === '/get') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(`
  <html>
    <head>
      <meta charset="utf-8">
      <title>GET / POST 메소드 실험</title>
    </head>
    <body>
      <h1>GET!</h1>
      <p>URL을 확인해 보세요.</p>
    </body>
  </html>
`);
    console.log(urlObj.query);
    res.end();
  } else if (pathName === '/post') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(`
  <html>
    <head>
      <meta charset="utf-8">
      <title>GET / POST 메소드 실험</title>
    </head>
    <body>
      <h1>POST!</h1>
      <p>URL을 확인해 보세요.</p>
    </body>
  </html>
`);
    console.log(urlObj.query);
    res.end();
  } else {
    res.writeHead(404);
    res.end();
  }
}).listen(3000);