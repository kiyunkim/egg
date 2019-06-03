import 'normalize.css';
import '../css/main.scss';

import './dev';

const saveName = 'artistdle';
const versionNumber = VERSION;
const version = document.querySelector('#version');

// buttons
const drawBtn = document.getElementById('draw');


// data
const data = {
  pieces: {

  }
};

version.innerHTML = 'v'+versionNumber;

drawBtn.addEventListener('click', function() {
  if (data.pieces.sketches === undefined) {
    data.pieces.sketches = 1;
    return;
  }
  data.pieces.sketches += 1;
});




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
  });
  
  // reset
  document.getElementById('reset').addEventListener('click', function(e){
    if (confirm('Are you sure you want to clear your save? This will wipe out everything!')) {
      localStorage.removeItem(saveName);
      data = initData;
    }
  });
}
