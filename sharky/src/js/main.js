import 'normalize.css';
import  '../css/main.scss';

import {data} from './data';

// -------------------- constants:
const INTERVAL = 100; 
const VERSION = V;

// -------------------- element selectors:
const EL = {
  dataTable: document.getElementById('data-table')
}


const util = {
  // set data attribute
  setDataAttr: function(el, name, value) {
    el.setAttribute('data-' + name, value);
  },
};


// data table
const dataTable = {
  rows: {
    name: 'name',
    amount: 'amount'
  },

  // data table init setup
  setup: function() {
    // create tr and give sr-only class
    let tr = document.createElement('tr');
    tr.setAttribute('class', 'sr-only');
    // create th columns
    Object.keys(this.rows).forEach(function(row){
      let th = document.createElement('th');
      // set col scope + name it
      th.setAttribute('scope', 'col');
      th.innerHTML = row;
      // append to tr
      tr.appendChild(th);
    });
    // insert tr to table
    EL.dataTable.appendChild(tr);
  },

  update: function() {
    Object.keys(data).forEach(function(key) {
      if (data[key].amount > 0) {
  
      }
    });
  }

};

const buttons = {
  onclick: function() {
    // TODO: ORGANIZE THIS
    // get resource on button click
    // all buttons with a data-get
    const buttons = document.querySelectorAll('.btn[data-get]');
    for (let i = 0; i < buttons.length; i++) {
      // on button click,
      buttons[i].addEventListener('click', function(e){
        // get the resource to get
        let resource = e.target.getAttribute('data-get');

        // add +1 to amount
        data[resource].amount++;
      });
    }
  }

}

const main = {
  // set all data values to zero
  initDataAmount: function() {
    Object.keys(data).forEach(function(key) {
      if (key.amount !== 0) {
        data[key].amount = 0;
      }
    });
  },

  init: function() {
    main.initDataAmount();
    dataTable.setup();
    buttons.onclick();
  },

  interval: function() {
    console.log(data.fish);
  }
}

window.onload = function(){
  main.init();
  const game = setInterval(function() {
    main.interval();
  }, INTERVAL);
};
