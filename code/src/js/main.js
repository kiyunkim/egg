import 'normalize.css';
import '../css/main.scss';

import './dev';
// import {data} from './data';

let data = {
  increment: 0
}
const body = document.querySelector('body');

const versionNumber = VERSION;
const version = document.querySelector('#version');

version.innerHTML = 'v'+versionNumber;




const incrementButton = document.querySelector('.increment');

body.addEventListener('click', function(){
  console.log('body clicked');
  update();
});

let links = document.querySelectorAll('a');
console.log(links)
for (let i = 0; i < links.length; i++) {
  links[i].addEventListener('keypress', function(e){
    console.log('a enter')
    if (e.keyCode === 13){
      e.preventDefault();
      console.log('a enter')
    }
  });
}

incrementButton.onclick = function(){
  console.log('incrementButton c');
  data.increment++;
};
incrementButton.addEventListener('keypress', function(e){
  if (e.keyCode === 13) {
    e.preventDefault();
    console.log('incrementButton enter');
    data.increment++;
  }
});


function update() {
  // console.log('update');
  document.querySelector('.increment-counter').innerHTML = data.increment;
  
  if (data.increment >= 5) {
    document.querySelector('.header').classList.remove('hidden');
    enableSave();
  }
}

const tick = 1000;

function ticker() {
  update();
}

export let interval = setInterval(ticker, tick);


// save
export function enableSave(){
  const saveName = 'code-save';

  document.getElementById('save').addEventListener('click', function(e){
    let save = {
      increment: data.increment
    };
    try {
      var success = true;
  
      // try saving..
      try {
        localStorage.setItem(saveName, JSON.stringify(save));
      } catch(e) {
        success = false;
        console.log('Error occurred while trying to save!   "'+e+'"');
      }
  
      if(success) {
        console.log('Saved successfully');
      }
    
    } catch(e) {
      console.log('Something went wrong while trying to save');
    }
  });
  
  // load
  document.getElementById('load').addEventListener('click', function(e){
    let save = JSON.parse(localStorage.getItem(saveName));
    data.increment = save.increment;
    update();
  });
  
  // reset
  document.getElementById('reset').addEventListener('click', function(e){
    if (confirm('Are you sure you want to clear your save? This will wipe out everything!')) {
      localStorage.removeItem(saveName);
    }
  });
}
