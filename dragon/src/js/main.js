import 'normalize.css';
import '../main.css';

// import {data} from './data';


// -------------------- constants:
const V = VERSION;
const EL = {
  version: document.getElementById('version'),
  dataTable: document.getElementById('data'),
  game: document.getElementById('game'),
};
// -------------------- data attributes:


// -------------------- data:
let data = {
  gold: {
    name: 'gold',
    amount: 0
  },
  dragon: {
    name: 'dragon',
    amount: 0,
    cost: {
      gold: 10
    },
    income: {
      gold: 0.1
    }
  },
};

// -------------------- player data:
let player = {};




// -------------------- game

// 'data-id' - for identifying the item (e.g. data-id="gold")
// 'data-amount' - selector for displaying the amount of its value (e.g. data-amount="gold")
// 'data-income' - same as amount but for income


// item: from data object
// verb: for button text
// container: to append to
function createButton(item, verb, container) {
  // create button
  let button = document.createElement('button');
  let name = item.name;

  // set item name as 'data-id'
  button.setAttribute('data-id', name);
  // button text
  button.innerHTML = verb + ' ' + name;
  // append to container
  container.appendChild(button);
}

// create gold button and append to game body
createButton(data.gold, 'collect', game);

// add item row to data table
function addItemRow(item) {
  var row = document.createElement('tr');
  var itemName = item.name;

  // set item name as the data-id
  row.setAttribute('data-id', itemName);

  // name column
  var nameCol = '<th scope="row">' + itemName + '</th>';

  // amount column
  var amountCol = document.createElement('td');
  amountCol.setAttribute('data-amount', itemName);
  amountCol.innerHTML = item.amount;

  // income column
  var incomeCol = document.createElement('td');
  incomeCol.setAttribute('data-income', itemName);

  // bring it altogether now
  row.innerHTML += nameCol;
  row.appendChild(amountCol);
  row.appendChild(incomeCol);

  EL.dataTable.querySelector('tbody').appendChild(row);
}

// put gold data in table
addItemRow(data.gold);



// on click for all buttons, +1 of 'data-get' item
var buttons = document.querySelectorAll('button');
for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', function(e){
    // get item name from 'data-id' attribute
    var itemName = e.target.getAttribute('data-id');
    // update data object
    data[itemName].amount++;

    // TODO: put in interval. check amount for each obj
    // TODO: data table should be wiped out on reset
    if (data[itemName].amount > 0) {
      // TODO: make the query selector... better.
      // if item isn't already in the data table, add it
      if (document.querySelectorAll('tr[data-id="'+ itemName +'"]').length === 0) {
        addItemRow(data[itemName]);
        return;
      }

      // if it already exists, update the amount
      let itemRow = document.querySelector('[data-amount="' + itemName +'"');
      itemRow.innerHTML = data[itemName].amount;
    };
  });
}


Object.keys(data).forEach(function(k) {
  console.log(k);
  console.log(data[k])
});