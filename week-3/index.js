const http = require('http');
const url = require('url');
const fs = require('fs');
const qs = require('querystring');
const template = require('./template');

http.createServer((req, res) => {
  const urlObj = url.parse(req.url, true);
  const pathName = urlObj.pathname;
  if (pathName === '/') {
    if (!urlObj.search) {
      fs.readdir('./data', 'utf8', (err, files) => {
        if (err) throw err;
        const list = template.getLITag(files);
        res.writeHead(200);
        res.write(template.html);
        res.write(`
      <article>
        <img src="https://cdn.pixabay.com/photo/2019/08/19/07/45/dog-4415649_960_720.jpg">
        <ul>
          <!-- 목록이 들어갈 자리-->
          ${list}
        </ul>
        <a href="/create">글 작성하기</a>
      </article>
    </div>
  </div>
</body>

</html>
        `);
        res.end();
      });
    } else {
      console.log(urlObj.query);
      fs.readFile(`./data/${urlObj.query.title}.txt`, 'utf8', (err2, data) => {
        if (err2) throw err2;
        const title = urlObj.query.title;
        res.writeHead(200);
        res.write(template.html);
        res.end(`
      <article>
        <h2>${title}</h2>
        <p>
          ${data}
        </p>
        <a href="/">홈으로 가기</a>
        <p>
          <a href="/update?title=${encodeURIComponent(title)}">수정</a>
          <form action="/delete_post" method="post">
            <input type="hidden" name="title" value=${encodeURIComponent(title)}>
            <input type="submit" value="삭제">
          </form>
        </p>
      </article>
    </div>
  </div>
</body>

</html>
      `);
      });
    }
  } else if (pathName === '/create') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(template.html);
    res.write(`
      <article>
        <img src="https://cdn.pixabay.com/photo/2019/08/19/07/45/dog-4415649_960_720.jpg">
        <form action="/create_post" method="post">
          <p>
            <label for="title"> 제목 </label>
            <input type="text" id="title" name="title">  
          </p>
          <textarea name="content">
          </textarea>
          <p>
            <input type="submit">
          </p>
        </form>
      </article>
    </div>
  </div>
</body>

</html>
    `);
    res.end();
  } else if (pathName === '/create_post') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const post = qs.parse(body);
      const title = post.title;
      const content = post.content;
      fs.writeFile(`./data/${title}.txt`, content, 'utf8', () => {
        res.writeHead(302, {Location: `/?title=${title}`});
        res.end();
      });
    });
  } else if (pathName === '/update') {
    fs.readFile(`./data/${urlObj.query.title}.txt`, 'utf8', (err, data) => {
      if (err) throw err;
      const title = (urlObj.query.title).split(' ').join(' ');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(template.html);
      console.log(title);
      const test = 'Hi! Nice to meet you';
      res.write(`
      <article>
        <img src="https://cdn.pixabay.com/photo/2019/08/19/07/45/dog-4415649_960_720.jpg">
        <form action="/update_post" method="post">
          <p>
            <input type="hidden" name="original_title" value=${encodeURIComponent(urlObj.query.title)}>
            <label for="title"> 제목 </label>
            <input type="text" id="title" name="title" value="${test}">  
          </p>
          <textarea name="content">
            ${data}
          </textarea>
          <p>
            <input type="submit">
          </p>
        </form>
      </article>
    </div>
  </div>
</body>

</html>
    `);
      res.end();
    });
  } else if (pathName === '/update_post') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const post = qs.parse(body);
      const title = post.title;
      const original_title = post.original_title;
      if (title !== original_title) {
        fs.unlink(`./data/${original_title}.txt`, () => {
          //code
        });
      }
      const content = post.content;
      fs.writeFile(`./data/${title}.txt`, content, 'utf8', () => {
        res.writeHead(302, {Location: `/?title=${title}`});
        res.end();
      });
    });
  } else if (pathName === '/delete_post') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const post = qs.parse(body);
      console.log(post);
      fs.unlink(decodeURIComponent(`./data/${post.title}.txt`), () => {
        res.writeHead(302, {Location: '/'});
        res.end();
      });
    })
  } else {
    res.writeHead(404);
    res.end();
  }
}).listen(3000);