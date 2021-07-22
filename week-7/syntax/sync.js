var fs = require('fs');

console.log('A');
var b = fs.readFileSync('sample.txt', 'utf8');
//readFileSync는 return값이 있음
console.log(b);
console.log('C');

console.log('A');
fs.readFile('sample.txt', 'utf8', function(err, data) {
  console.log(data);
});
//하지만 readFile은 return값이 없고 파일을 다 읽으면 callback을 실행할뿐
console.log('C');