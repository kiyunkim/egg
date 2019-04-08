import 'normalize.css';
import '../css/main.scss';

import './dev';
// import {data} from './data';


// variables
let data = {
  increment: 0,
  upgrades: {
    save: false
  }
}
const tick = 1000;
const body = document.querySelector('body');
const incrementButton = document.getElementById('increment');
const upgradeButton = document.querySelectorAll('.upgrade');

const saveName = 'code-save';
// dev info
const versionNumber = VERSION;
const version = document.querySelector('#version');

version.innerHTML = 'v'+versionNumber;


// ticker
function ticker() {
  //update();
}
export let interval = setInterval(ticker, tick);

// increment click
incrementButton.onclick = function(){
  data.increment++;
};

// check for upgrades
function checkUpgrades(){
  for (let i = 0; i < upgradeButton.length; i++) {
    if (data.increment >= upgradeButton[i].dataset.min) {
      upgradeButton[i].classList.remove('hidden');
      if (data.increment >= upgradeButton[i].dataset.cost) {
        upgradeButton[i].disabled = false;
      }
    }
    else {
      upgradeButton[i].disabled = true;
    }
  }
}


// get upgrade
for (let i = 0; i < upgradeButton.length; i++) {
  upgradeButton[i].onclick = function(){
    // get type of upgrade
    let type = this.dataset.type;
    switch (type) {
      case 'unlock':
        console.log(this);
        break;
      default:
        console.log('not sure what type this is');
    }
  }
}

// update data
body.addEventListener('click', function(){
  update();
});

function update() {
  document.querySelector('.increment-counter').innerHTML = data.increment;
  checkUpgrades();
}

// init
window.onload = function() {
  let save = JSON.parse(localStorage.getItem(saveName));
  if (save) {
    data.increment = save.increment;
  }
  update();
}


// save
export function enableSave(){

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
      data.increment = 0; 
      update();
    }
  });
}
