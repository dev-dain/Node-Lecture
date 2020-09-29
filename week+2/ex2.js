// var과 const/let의 스코프 차이

if (true) {
  var x = 1;
}
console.log(x);

if (true) {
  const y = 2;
}
console.log(y);