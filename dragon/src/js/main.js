import 'normalize.css';
import '../main.css';

import {data} from './data';

const V = VERSION;

/* to organize: ------------------------------------- */

const ELEMENT = {
  header,
  version: document.getElementById('version'),

  sidebar,
  dataTable: document.getElementById('data'),
  
  game: document.getElementById('game'),
};


ELEMENT.version.innerHTML = 'v' + V;

// create gold button
var collectGold = document.createElement('button');
collectGold.setAttribute('data-get', data.gold.name);
collectGold.innerHTML = 'collect gold';

game.appendChild(collectGold);


// data table format
function setupData(item) {
  var row = document.createElement('tr');
  var itemName = item.name;

  row.setAttribute('data-id', itemName);

  // create columns
  var nameCol = '<th scope="row">' + itemName + '</th>';
  var amountCol = document.createElement('td');
  amountCol.setAttribute('id', itemName + '-amount');
  amountCol.innerHTML = item.amount;

  var rpsCol = document.createElement('td');
  rpsCol.setAttribute('id', itemName + '-income');

  row.innerHTML += nameCol;
  row.appendChild(amountCol);
  row.appendChild(rpsCol);

  ELEMENT.dataTable.querySelector('tbody').appendChild(row);
}

setupData(data.gold);


// on button click, +1 of 'data-get'
var buttons = document.querySelectorAll('button');
for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', function(e){
    var itemName = e.target.getAttribute('data-get');
    data[itemName].amount++;

    // show gold in table
    // TODO: put in interval. check amount for each obj
    if (data[itemName].amount > 0) {
      if (document.querySelectorAll('[data-id="'+ itemName +'"]').length === 0) {
        var dataRow = document.createElement('tr');
        dataRow.setAttribute('data-id', itemName);
  
        dataRow.innerHTML += '<th scope="row">' + itemName + '</th>';
        dataRow.innerHTML += '<td id="' + itemName + '-amount">' + data.gold.amount + '</td>';
  
        ELEMENT.dataTable.appendChild(dataRow);
        return;
      }
      var amount = document.getElementById('gold-amount');
      amount.innerHTML = data.gold.amount;
    };
  });
}


Object.keys(data).forEach(function(k) {
  console.log(k);
  console.log(data[k])
});