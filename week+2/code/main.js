const time = document.querySelector('.time');

function timer() {
  const today = new Date();
  let h = today.getHours(); //20
  let m = today.getMinutes(); //18
  let s = today.getSeconds(); //58

  time.textContent = `${h} : ${m} : ${s}`;
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
  
  
  createBtn.addEventListener('click', () => {
    const buttonBox = createBtn.parentElement;
    const newPTag = document.createElement('p');
    newPTag.textContent = 
      (inputText.value) ? inputText.value : `Hi! I'm a new <p> tag.`;
    inputText.value = '과제가 너무 많아';
    buttonBox.appendChild(newPTag);
  });

  const pic = document.querySelector('.pic');
  pic.addEventListener('dblclick', () => {
    window.open('popup.html', '팝업창', 
    'width=300, height=300, fullscreen=no, location=no');
  });
}

window.onload = startFunc;