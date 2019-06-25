// all things to do with the data table

// imports: constants, utils, data
import {table, DATA_NAME} from './constants';
import {setDataAttr} from './utils';
import {data} from './data/data';

export let rows = ['name', 'amount', 'income'];

// set up the headers for screen readers,
// based on the rows array
export function setup() {
  // tr to house headers
  const tr = document.createElement('tr');
  tr.setAttribute('class', 'sr-only');

  // set up th with string names from rows obj
  for (const rowName of rows) {
    const th = document.createElement('th');
    th.setAttribute('scope', 'col');
    th.innerHTML = rowName;
    tr.appendChild(th);
  }

  // insert to table
  table.appendChild(tr);
}


// add item row to table
export function addItemRow(item) {
  // tr with item name as data-name
  const row = document.createElement('tr');
  const itemName = item.name;
  setDataAttr(row, DATA_NAME, itemName);

  // add columns to row
  for (const rowName of rows) {
    let col;
    if (rowName === DATA_NAME) {
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
  }
}

// TODO: update/refresh table with data
export function update() {
  // TODO: replace below with for..of
  const items = data.items;
  const workers = data.workers;
  
  for (const i in items) {
    console.log(items[i]);
  };

  for (const w in workers) {

  };

    // refresh data + table
    Object.keys(data).forEach(function(itemName) {
      // TODO: data table should be wiped out on reset
      // display only items that have amount > 0
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