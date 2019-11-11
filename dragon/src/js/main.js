var DRAGON = DRAGON || {};
var DRGN = DRAGON;

var VERSION = '0.1.0';
var EPSILON = 1E-6;
var INTERVAL = (1000/10);

DRGN.main = {
  
  init: function() {
    DRGN.resources.init();
  }

};

DRGN.test = function() {
  
};

window.onload = function() {
  DRGN.main.init();
  DRGN.test();
};