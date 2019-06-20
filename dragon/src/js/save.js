import {data, reassignData} from './data/data';
import {save as saveLink, reset as resetLink, SAVE_NAME} from './constants';

// TODO: add try catch statement
// TODO: encode string to something for import/export
// TODO: have autosave
export function saveGame() {
  try {
    let success = true;
    // try saving:
    try {
      localStorage.setItem(SAVE_NAME, JSON.stringify(data));
    } catch(e) {
      success = false;
      console.log(`There was an error while trying to save. Error: ${e}`);
    }
    if (success) {
      console.log('saved'); // TODO: add small modal to show message? 
    }
  } catch(e){
    console.log(`There was an error while trying to save. Error: ${e}`);
  }
}

export function loadGame() {
  let saveData = JSON.parse(localStorage.getItem(SAVE_NAME));
  // make sure there is a saved game
  if (saveData !== null) {
    reassignData(saveData);
  }
}

export function resetGame() {
  // TODO: add confirmation alert
  localStorage.removeItem(SAVE_NAME);
  // TODO: some refresh of the page to update ui
}