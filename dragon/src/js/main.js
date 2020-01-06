var DRAGON = DRAGON || {};
var DRGN = DRAGON;

var VERSION = '0.1.0';
var EPSILON = 1E-6;
var INTERVAL = (1000/10);

DRGN.el = {
  table: document.getElementById('data')
}

DRGN.main = {
  
  init: function() {
    DRGN.resources.init();
  },

  tick: function() {

  }

};

DRGN.test = function() {
  DRGN.resources.rebuildTable();

  // free resources
  var buttons = document.querySelectorAll('button');

  for (btn of buttons) {
    if (btn.dataset.name) {
      btn.addEventListener('click', function() {
        var btnName = btn.dataset.name;
        var data = DRGN.data;
        
        data[btnName].amount += 1;
        console.log(data[btnName]);
      });
    }
  }
};

window.onload = function() {
  DRGN.main.init();
  DRGN.test();
};