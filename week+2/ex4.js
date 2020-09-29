setTimeout(() => console.log('3초 뒤 실행'), 3000);

for (let i = 0; i < 10; i++) {
  console.log(i);
}

const wrap = document.getElementById('wrap');

function timer() {
  const date = new Date();
  const h = date.getHours();
  const m = date.getMinutes();
  const s = date.getSeconds();
  wrap.textContent = 
  `이 시계는 5초 뒤 종료됩니다.\n
  현재 시간 ${h}시 ${m}분 ${s}초`;
}

timer();
const timerInterval = setInterval(timer, 1000);

setTimeout(() => {
  clearInterval(timerInterval);
}, 5000);