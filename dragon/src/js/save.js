import {data, reassignData} from './data/data';
import {save as saveLink, reset as resetLink, SAVE_NAME} from './constants';

// TODO: add try catch statement
// TODO: encode string to something for import/export
// TODO: have autosave
export function enableSave() {
  saveLink.addEventListener('click', function(){
    const str = JSON.stringify(data);
    localStorage.setItem(SAVE_NAME, JSON.stringify(data));
    console.log('saved'); // TODO: add small modal to show message?
  });
}

export function loadSave() {
  let saveData = JSON.parse(localStorage.getItem(SAVE_NAME));
  // make sure there is a saved game
  if (saveData !== null) {
    reassignData(saveData);
  }
}