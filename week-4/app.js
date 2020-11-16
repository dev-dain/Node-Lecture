const express = require('express');
const app = express();
const pagesRouter = require('./router');
const port = 3000;

app.use('/pages', pagesRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Node on ${port}`);
});