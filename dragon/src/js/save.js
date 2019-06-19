import {data} from './data/data';
import {save as saveLink, reset as resetLink, SAVE_NAME} from './constants';

const saveData = data;

// TODO: add try catch statement
// TODO: encode string to something for import/export
function enableSave() {
  saveLink.addEventListener('click', function(){
    const str = JSON.stringify(saveData);
    localStorage.setItem(SAVE_NAME, JSON.stringify(saveData));
    console.log('saved'); // TODO: add small modal to show message?
  });
}
enableSave();
function load(data) {
  const savedData = JSON.parse(localStorage.getItem(SAVE_NAME));
  // make sure there is a saved game
  if (savedData !== null) {
    
    console.log(data);
    data = savedData;
    console.log(data);
    
  }
}
load(data);