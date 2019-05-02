import 'normalize.css';
import '../main.css';


var DRGN = {};

DRGN.VERSION = '0.1.0';
DRGN.INTERVAL = 100;
DRGN.SAVE = 'dragonsave';

DRGN.el = {
  header,
  version: document.getElementById('version'),

  sidebar,
  data: document.getElementById('data'),
  game: document.getElementById('game'),
};

DRGN.main = {
  init: function() {
    showData(DRGN.data.gold);
    createButton(DRGN.el.game, 'collect', DRGN.data.gold.name, getGold());

  },
  update: function() {
    
  },
};

window.onload = function() {
  // DRGN.main.init();
  document.body.addEventListener('click', function() {
    DRGN.main.update();
  });
};



/* to organize: ------------------------------------- */

// create button
function createButton(container, action, name, handler){
  var button = document.createElement('button');
  button.setAttribute('id', action + '-' + name);
  button.innerHTML = action + ' ' + name;
  container.appendChild(button);

  button.addEventListener('click', handler);
}

function showData(name) {
  var amount = name.amount;
  var name = name.name;

  var dataDiv = document.createElement('div');
  dataDiv.setAttribute('id', name);
  dataDiv.innerHTML = name + ': <span id="' + name + '-amount">' + amount + '</span>';
  
  DRGN.el.data.appendChild(dataDiv);
}



// handler for getting gold
function getGold() {
  var goldAmount = DRGN.data.gold.amount;
  goldAmount++;
}
