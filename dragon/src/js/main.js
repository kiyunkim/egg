import 'normalize.css';
import  '../css/main.css';

import {data} from './data/data';
import * as table from './table';

// -------------------- constants:
const INTERVAL = 100; 
const V = VERSION;
const EL = {
  version: document.getElementById('version'),
  dataTable: document.getElementById('data'),
  game: document.getElementById('game'), // main ui
  log: document.getElementById('log'),
};
const IDNAME = 'name'; // for data-NAME

// -------------------- player data:
const player = {};

// -------------------- data table:

// -------------------- misc??:
const util = {
  setDataAttr: function(el, name, value){
    el.setAttribute('data-' + name, value);
  },
};

function createButton(item, action, parent) {
  // create button: disabled on default, insert text
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.disabled = true;
  button.innerHTML = action + ' ' + item.name;

  // set data-IDNAME with itemName as its value
  const itemName = item.name;
  util.setDataAttr(button, IDNAME, itemName);

  // does it cost anything?
  if (item.cost) {
    // yes, update button with the cost in a span ..
    const cost = document.createElement('span');
    cost.setAttribute('class', 'cost');

    // go through each requirement to buy item
    Object.keys(item.cost).forEach(function(key) {
      const costItem = data[key].name;
      cost.innerHTML = item.cost[costItem] + ' ' + costItem;
    });
    button.appendChild(cost);
  } else {
    button.disabled = false;
  }
  // append to container
  parent.appendChild(button);
}

const log = {
  write: function(msg){
    let para = document.createElement('p');
    para.setAttribute('class', 'log-message');
    para.innerHTML = msg;

    EL.log.insertBefore(para, EL.log.firstChild);
  }
};

// unlocking first dragon is special
function unlockFirstDragon() {
  if (data.gold.amount >= 10 && data.dragons.amount === 0) {
    log.write('a dragon was lured by your gold.');
    data.dragons.amount = 1;
    createButton(data.dragons, 'lure', EL.game);
  }
};


let game = {

  init: function() {

    table.setup();
    // on click for all buttons, +1 of item
    document.addEventListener('click', function(e){
      if (e.target.type === 'button') {
        // get item name from 'data-name' attribute
        // TODO: again data-name is hard coded
        let itemName = e.target.getAttribute('data-' + IDNAME);
        // does it cost anything?
        if (data[itemName].cost) {

        }
        // update data object
        data[itemName].amount++;
      }
    });
  },

  // TODO: use requestFrameAnimation
  interval: function(){

    unlockFirstDragon();
    // refresh data + table
    Object.keys(data).forEach(function(itemName) {
      // TODO: data table should be wiped out on reset
      if (data[itemName].amount > 0) {
        // TODO: make the query selector... better.
        // if item isn't already in the data table, add it
        if (document.querySelectorAll('tr[data-name="'+ itemName +'"]').length === 0) {
          table.addItemRow(data[itemName]);
        }

        // update the amount
        let itemRow = document.querySelector('[data-amount="' + itemName +'"');
        itemRow.innerHTML = data[itemName].amount;
      };
    });

  }
}

window.onload = function() {
  game.init();
  let interval = setInterval(function(){
    game.interval();
  }, INTERVAL);
}