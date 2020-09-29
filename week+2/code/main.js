const time = document.querySelector('.time');

function timer() {
  const today = new Date();
  let amOrPm = 'AM ';
  let h = today.getHours();
  let m = today.getMinutes(); 
  let s = today.getSeconds();
  if (h === 0) {
    h = 12;
  } else if (h === 12) {
    amOrPm = 'PM ';
  } else if (h > 12) {
    h -= 12;
    amOrPm = 'PM ';
  }
  (h < 10) ? h = '0'.concat(h) : h;
  (m < 10) ? m = '0'.concat(m) : m;
  (s < 10) ? s = '0'.concat(s) : s; 

  time.textContent = `${amOrPm}${h} : ${m} : ${s}`;
}

const startFunc = () => {
  timer();
  setInterval(timer, 1000);

  
  
  const alertBtn = document.querySelector('.alert-btn');
  alertBtn.addEventListener('click', () => {
    alert('You clicked a button!');
  });
  
  

  //const createBtn = document.getElementById('create-btn');
  const createBtn = document.querySelector('#create-btn');
  // const buttonBox = document.querySelector('button-box');
  const inputText = document.getElementsByTagName('input')[0];
  const timerSection = createBtn.parentElement.parentElement;
  
  createBtn.addEventListener('click', () => {
    const newPTag = document.createElement('p');
    newPTag.textContent = 
      (inputText.value) ? inputText.value : `Hi! I'm a new <p> tag.`;
    inputText.value = '';
    timerSection.appendChild(newPTag);
  });

  const pic = document.querySelector('.pic');
  pic.addEventListener('dblclick', () => {
    window.open('popup.html', '팝업창', 
    'width=300, height=300, fullscreen=no, location=no');
  });
}

window.onload = startFunc;