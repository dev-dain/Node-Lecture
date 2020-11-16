const fs = require('fs');

// fs.readFile('./data/Friends.txt', 'utf8', function (err, data) {
//   if (err) throw err;
//   console.log(data);
// });

fs.readdir('./data', (err, files) => {
  if (err) throw err;
  console.log(files);
  console.log('\n\n');
  // for (let i = 0; i < files.length; i++)
  //   console.log(files[i]);
  // files.forEach(e => console.log(e));
});

fs.writeFile('./data/dummy.txt', 'Hi', 'utf8', () => {
  console.log('done');
});

fs.appendFile('./data/dummy.txt', '\ndummy', 'utf8', () => {
  console.log('append done');
});

fs.unlink('./data/dummy.txt', () => {
  console.log('delete');
});