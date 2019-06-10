import 'normalize.css';
import  '../css/main.css';

import {data} from './data';


// -------------------- constants:
const INTERVAL = 100; 
const V = VERSION;
const EL = {
  version: document.getElementById('version'),
  dataTable: document.getElementById('data'),
  game: document.getElementById('game'), // main ui
  log: document.getElementById('log'),
};

// -------------------- player data:
let player = {};

// -------------------- data table:
let dataTable = {
  row: {
    name: 'name',
    job: 'job',
    amount: 'amount',
    income: 'income'
  }
};

console.log(data);
function dataAttr(name) {
  // easier than typing 'data-' all the time
  return 'data-' + name;
}

function createButton(item, verb, container) {
  // create button
  let button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.disabled = true;
  // get name from data.name
  let name = item.name;
  let dtr = dataTable.row; // dtr = data table row

  // set name as 'data-name'
  button.setAttribute(dataAttr(dtr.name), name);
  // set button text
  button.innerHTML = verb + ' ' + item.singular;
  // does it cost anything?
  if (item.cost) {
    // if it does, show on the button
    let cost = document.createElement('span');
    cost.setAttribute('class', 'cost');
    cost.innerHTML = '(cost: ' + item.cost.amount + ' ' + item.cost.name + ')';
    button.appendChild(cost);
  } else {
    button.disabled = false;
  }
  // append to container
  container.appendChild(button);
}

// add item row to data table
function addItemRow(item) {
  let row = document.createElement('tr');
  let itemName = item.name;
  let dtr = dataTable.row; // dtr = data table row

  // set item name as the data-name for the table row
  row.setAttribute(dataAttr(dtr.name), itemName);

  // name column
  let nameCol = '<th scope="row">' + itemName + '</th>';

  // for each column
  Object.keys(dtr).forEach(function(r) {
    // the name col is special:
    if (r === dtr.name) {
      let col = '<th scope="row">' + itemName + '</th>';
      row.innerHTML += col;
      return;
    }
    // set up rest of the columns
    let col = document.createElement('td');
    col.setAttribute(dataAttr(r), itemName);
    row.appendChild(col);
  });

  EL.dataTable.querySelector('tbody').appendChild(row);
}

let log = {
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
    // create gold button and append to game body
    createButton(data.gold, 'collect', EL.game);
    
    // on click for all buttons, +1 of 'data-get' item
    document.addEventListener('click', function(e){
      if (e.target.type === 'button') {
        // get item name from 'data-name' attribute
        let itemName = e.target.getAttribute('data-name');
        // does it cost anything?
        if (data[itemName].cost) {

        }
        // update data object
        data[itemName].amount++;
      }
    });
  },

  interval: function(){
    unlockFirstDragon();

    // refresh data + table
    Object.keys(data).forEach(function(itemName) {
      // TODO: data table should be wiped out on reset
      if (data[itemName].amount > 0) {
        // TODO: make the query selector... better.
        // if item isn't already in the data table, add it
        if (document.querySelectorAll('tr[data-name="'+ itemName +'"]').length === 0) {
          addItemRow(data[itemName]);
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