setTimeout(() => console.log('3초 뒤 실행'),3000);//콜백함수예제

for(let i=0;i<10;i++){
    console.log(i);
}

const wrap=document.getElementById('wrap');

function timer(){
    const date=new Date();
    const h=date.getHours();//20
    const m=date.getMinutes();//18
    const s=date.getSeconds();
    wrap.textContent=
    `이시계는 5초 뒤 종료 현 시간 ${h}시 ${m}분 ${s}초`;
}
timer();
const timeInterval=setInterval(timer,1000);

setTimeout(() => {
    clearInterval(timeInterval);
},5000);