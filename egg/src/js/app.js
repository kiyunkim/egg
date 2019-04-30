import {money, animals, eggs, producers} from './data';

const GAME = {};

GAME.VERSIION = '0.1.0';
GAME.INTERVAL = 1000;

// element selectors
GAME.el = {
  sidebar: document.getElementById('sidebar'),
  game: document.getElementById('game')
};

GAME.main = {
  init: function() {

  },
  update: function() {

  },
  tick: function() {
    // update on interval
    window.setInterval(function() {
      update();
    }, GAME.INTERVAL);

    // and when something is clicked
    document.body.addEventListener('click', function() {
      update();
    })
  },
}


GAME.buttons = {
  create: function(container, obj, type, handler) {
    var button = document.createElement('button');
    button.setAttribute('id', type + '-' + obj);
    button.innerHTML = type + ' ' + obj;
    container.appendChild(button);
    button.addEventListener('click', handler);
  }
}




/* 


function checkLoop() {
  updateCount(egg);
  updateCount(money);
  updateCount(chicken);
  unlock(egg, money);
  unlock(money, chicken);
  enableOrDisableButton(egg, 12, egg.html.sellButton);
  enableOrDisableButton(money, chicken.buy.amount, chicken.html.buyButton);
}
update(checkLoop);

// clicker
function addClickCount(thing) {
  document.querySelector(thing.html.buyButton).addEventListener('click', function() {
    thing.count++;
    updateCount(thing);
  });
}
addClickCount(egg);

function checkIfArray(thing) {
  if (Array.isArray(thing)) {
    return true;
  } else {
    return false
  }
}
// unhide
function unhide(hiddenThing){
  document.querySelector(hiddenThing.html.container).classList.remove(className.hidden);
  updateCount(hiddenThing);
}
// unlock
function unlock(unlockingThing, lockedThing) {
  // make sure locked thing is already hidden
  if (document.querySelector(lockedThing.html.container).classList.contains(className.hidden)) {
    // is the locked thing in an array?
    if (checkIfArray(unlockingThing.unlock)) {
      // if yes, loop through array
      for (var i = 0; i < unlockingThing.unlock.length; i++) {
        // check name and cost
        if ((lockedThing.name === unlockingThing.unlock[i].name) && (unlockingThing.count >= unlockingThing.unlock[i].atCount)) {
          unhide(lockedThing);
        }
      }
    } else {
      // no it's an object, not array
      if ((lockedThing.name === unlockingThing.unlock.name) && (unlockingThing.count >= unlockingThing.unlock[i].atCount)) {
        unhide(lockedThing);
      }
    }
  }
}

// enable buttons
function enableOrDisableButton(thing, amount, button) {
  if (thing.count >= amount) {
    document.querySelector(button).disabled = false;
  } else {
    document.querySelector(button).disabled = true;
  }
}

function sellThing(thing) {
  document.querySelector(thing.html.sellButton).addEventListener('click', function() {
    money.count = money.count + (thing.sell.money * thing.sell.count);
    thing.count = thing.count - thing.sell.count;
    // TODO: finish this function
    updateCount(thing);
    updateCount(money);
  });
}

sellThing(egg);
*/
