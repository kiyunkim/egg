import 'normalize.css';
import  '../css/main.css';

// import {data} from './data';


// -------------------- constants:
const INTERVAL = 100; 
const V = VERSION;
const EL = {
  version: document.getElementById('version'),
  dataTable: document.getElementById('data'),
  game: document.getElementById('game'), // main ui
  log: document.getElementById('log'),
};

// -------------------- data:
let data = {
  gold: {
    name: 'gold',
    amount: 0,
  },
  dragon: {
    name: 'dragon',
    amount: 0,
  },
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

function dataAttr(name) {
  // easier than typing 'data-' all the time
  return 'data-' + name;
}


function createButton(item, verb, container) {
  // create button
  let button = document.createElement('button');
  button.setAttribute('type', 'button');
  // item name from data object
  let name = item.name;
  let dtr = dataTable.row; // dtr = data table row

  // set item name as 'data-name'
  button.setAttribute(dataAttr(dtr.name), name);
  // set button text
  button.innerHTML = verb + ' ' + name;
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
    var col = document.createElement('td');
    col.setAttribute(dataAttr(r), itemName);
    row.appendChild(col);
  });

  EL.dataTable.querySelector('tbody').appendChild(row);
}


var game = {

  init: function() {
    // create gold button and append to game body
    createButton(data.gold, 'collect', EL.game);
    
    // on click for all buttons, +1 of 'data-get' item
    document.addEventListener('click', function(e){
      if (e.target.type === 'button') {
        // get item name from 'data-name' attribute
        var itemName = e.target.getAttribute('data-name');
        // update data object
        data[itemName].amount++;
      }
    });
  },

  interval: function(){
    // refresh data
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