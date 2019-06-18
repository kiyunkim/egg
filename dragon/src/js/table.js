// all things to do with the data table

import {table, DATANAME} from './constants';
import {setDataAttr} from './utils';
import {data} from './data/data';

export let rows = {
  name: 'name',
  amount: 'amount',
  income: 'income',
};

// set up the headers for screen readers,
// based on the rows object
export function setup(){
  // tr to house headers
  const tr = document.createElement('tr');
  tr.setAttribute('class', 'sr-only');

  // set up th with string names from rows obj
  Object.keys(rows).forEach(function(rowName){
    const th = document.createElement('th');
    th.setAttribute('scope', 'col');
    th.innerHTML = rowName;
    tr.appendChild(th);
  });

  // insert to table
  table.appendChild(tr);
}


// add item row to table
export function addItemRow(item) {
  // tr with item name as data-name
  const row = document.createElement('tr');
  const itemName = item.name;
  setDataAttr(row, DATANAME, itemName);

  // add columns to row
  Object.keys(rows).forEach(function(rowName){
    let col;

    if (rowName === DATANAME) {
      // name th:
      col = document.createElement('th');
      col.setAttribute('scope', 'row');
      col.innerHTML = itemName;
    } else {
      // all else are td:
      col = document.createElement('td');
      setDataAttr(col, rowName, itemName);
    }
    row.appendChild(col);
    table.appendChild(row);
  });
}

// TODO: update/refrehs table with data
function update(){
  Object.keys(data).forEach(function(item){
    // display only items that have amount > 0
    if (data[item].amount > 0) {
      // ..
    }
  });
}