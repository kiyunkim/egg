import 'normalize.css';
import '../css/main.scss';

import './dev';
// import {data} from './data';


// variables
const initData = {};

initData.increment = 0;
initData.upgrades = {
  save
};
initData.upgrades.save = {
  unlocked: false
};

let data = initData;

const tick = 1000;
const saveName = 'code-save';

// selectors
const body = document.querySelector('body');
const incrementButton = document.getElementById('increment');
const upgradeButton = document.querySelectorAll('.upgrade');

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
// shows/hides upgrade buttons
// disable/enables upgrade buttons
function checkUpgrades(){
  // loop each upgrade button
  for (let i = 0; i < upgradeButton.length; i++) {
    // if increment >= min
    if (data.increment >= upgradeButton[i].dataset.min) {
      // unhide the button
      upgradeButton[i].classList.remove('hidden');
      // if increment >= cost
      if (data.increment >= upgradeButton[i].dataset.cost) {
        // enable the button
        upgradeButton[i].disabled = false;
      } else {
        upgradeButton[i].disabled = true;
      }
    }
    else {
      upgradeButton[i].classList.add('hidden');
    }
  }
}




// get upgrade
for (let i = 0; i < upgradeButton.length; i++) {
  upgradeButton[i].onclick = function(){
    // get type of upgrade
    let upgradeType = this.dataset.type;
    let upgradeName = this.dataset.name;

    switch (upgradeType) {
      case 'unlock':
        data.upgrades[upgradeName].unlocked = true;
        break;
      case 'upgrade':
        break;
      default:
        console.log('not sure what type this is');
    }
  }
}
function getUpgrade(upgrade) {

}

// update data
body.addEventListener('click', function(){
  update();
});

function update() {
  document.querySelector('.increment-counter').innerHTML = data.increment;
  checkUpgrades();

  // below should be automated
  if (data.upgrades.save.unlocked) {
    document.querySelector('header').classList.remove('hidden');
    enableSave();
  }
  console.log(data);
}

// on page load
window.onload = function() {
  init();
}

// init
function init() {
  let save = JSON.parse(localStorage.getItem(saveName));
  if (save) {
    data = save;
  }
  update();
}


// save
export function enableSave(){

  document.getElementById('save').addEventListener('click', function(e){
    let save = data;
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
    data = save;
    update();
  });
  
  // reset
  document.getElementById('reset').addEventListener('click', function(e){
    if (confirm('Are you sure you want to clear your save? This will wipe out everything!')) {
      localStorage.removeItem(saveName);
      data = initData;
      update();
    }
  });
}
