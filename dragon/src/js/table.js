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
  const items = data.items;
  const workers = data.workers;
  
  for (const i in items) {
    const item = items[i];
    const name = item.name;
    /////// TODO: make this selector better (use rows array to generate `data-${row}`?)
    const itemRow = table.querySelector(`tr[data-${DATA_NAME}=${name}]`);
    if (item.amount > 0) { // if there's any resources,
      if (!itemRow) { // check to see if it exists in the table
        // if not, add it
        addItemRow(item);
      }
      // update amount
      table.querySelector(`td[data-amount=${name}]`).innerHTML = item.amount;
    } else { // if it's <= 0,
      if (itemRow) {
        table.removeChild(itemRow);
      }
    }
  };

  for (const w in workers) {
    //////// TODO:
    // same as items BUT instead of
    // updating just the amount, also
    // update columns
  };

}