import 'normalize.css';
import  '../css/main.css';

import {data, player} from './data/data';
import * as el from './constants';
import * as table from './table';
import * as utils from './utils';
import * as log from './log';
import * as save from './save';


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



// unlocking first dragon is special
function unlockFirstDragon() {
  if (data.gold.amount >= 10 && data.dragons.amount === 0) {
    log.write('a dragon was lured by your gold.');
    data.dragons.amount = 1;
    utils.createButton(data.dragons, 'lure', EL.game);
  }
};


let game = {

  init: function() {

    save.loadGame();
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

    // TODO: put this somewhere it makes sense
    el.save.addEventListener('click', function(e){
      save.saveGame();
    });

    // start interval
    this.requestInterval(this.interval, INTERVAL);
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

  },

  // https://gist.github.com/joelambert/1002116
  // https://css-tricks.com/snippets/javascript/replacements-setinterval-using-requestanimationframe/
  requestInterval: function(fn, interval) {
    const requestAnimFrame = (function() {
      return window.requestAnimationFrame || function(callback) {
        window.setTimeout(callback, interval);
      };
    })();

    let start = new Date().getTime();
    let handle = {};

    function loop() {
      var current = new Date().getTime();
      var delta = current - start;
      if (delta >= interval) {
        fn.call();
        start = new Date().getTime();
      }
      handle.value = requestAnimFrame(loop);
    }
    handle.value = requestAnimFrame(loop);
    return handle;
  },

}

window.onload = function() {
  game.init();
}