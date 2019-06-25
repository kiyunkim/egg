import 'normalize.css';
import  '../css/main.css';

import {data} from './data/data';
import * as el from './constants';
import * as table from './table';
import * as utils from './utils';
import * as log from './log';
import * as save from './save';

const INTERVAL = 100;
const V = VERSION;
const IDNAME = 'name'; // for data-NAME

export let game = {
  // set up data
  setup: function() {
    table.setup();
    utils.assignKey(data.items, 'amount', 0);
    
    // check for saved data
    save.loadGame();
  },

  // on page load, set up the game + start interval
  init: function() {
    // show version number
    el.version.innerHTML = V;

    // setup
    this.setup();

    ///////// TODO: put this somewhere it makes sense
    el.save.addEventListener('click', function(e){
      save.saveGame();
    });
    el.reset.addEventListener('click', function() {
      save.resetGame();
    });
    

    // start interval
    this.requestInterval(this.interval, INTERVAL);
  },

  interval: function(){
    // ..
    table.update();
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