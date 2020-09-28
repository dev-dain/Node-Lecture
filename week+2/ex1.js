// var, const, let

var a = 10;
console.log(`선언 직후 a 값 : ${a}`);

{
  var a = 20;
  console.log(`블록에서의 a 값 : ${a}`);
  a = 100;
}

console.log(`블록 바깥의 a 값 : ${a}`);



let b = 30;
console.log(`선언 직후 b 값 : ${b}`);
{
  let b = 40;
  console.log(`블록에서의 b 값 : ${b}`);
  b = 50;
}

console.log(`블록 바깥의 b 값 : ${b}`);



const c = 60;
console.log(`선언 직후 c 값 : ${c}`);

{
  const c = 70;
  console.log(`블록에서의 c 값 : ${c}`);
  c = 80;
}

console.log(`블록 바깥의 c 값 : ${c}`);