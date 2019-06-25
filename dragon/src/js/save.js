import {data, reassignData} from './data/data';
import {SAVE_NAME} from './constants';
import * as log from './log';

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
      console.log('Game saved.'); // TODO: add small modal to show message? 
      log.write('Game saved.');
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
    // log.write('Loaded game.');
  }
}

export function resetGame() {
  // TODO: add confirmation alert
  localStorage.removeItem(SAVE_NAME);
  // TODO: some refresh of the page to update ui
}