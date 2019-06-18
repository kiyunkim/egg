import {data} from './data/data';
import {save as saveLink, reset as resetLink, SAVENAME} from './constants';

const saveData = {
  data: data
};

// TODO: add try catch statement
export function save(){
  saveLink.addEventListener('click', function(){
    const str = JSON.stringify(saveData);
    localStorage.setItem(SAVENAME, JSON.stringify(saveData));
    console.log('saved');
  });
}