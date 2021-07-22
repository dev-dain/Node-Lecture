const fs = require('fs');
//파일 읽기는 fs.readFile로
//fs.readFile(path/name, encoding, callback);
fs.readFile('sample.txt', 'utf8', function(err, data) {
  console.log(data);
});