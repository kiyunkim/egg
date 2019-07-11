import 'normalize.css';
import  '../css/main.scss';

import {data, reassignData} from './data';

const INTERVAL = 100;
const VERSION = V;
const SAVE = 'sharky';
let saveEvents = false;
let initData = {};

// ------------------------------ log ------------------------------
const log = {
  log: function(msg) {
    const log = document.getElementById('log');
    const message = document.createElement('p');
    message.innerHTML = msg;

    log.appendChild(message);
  },
}

// ------------------------------ save ------------------------------
const save = {
  save: function() {
    try {
      let success = true;
      // try saving:
      try {
        localStorage.setItem(SAVE, JSON.stringify(data));
      } catch(e) {
        success = false;
        console.error(`There was an error while trying to save. Error: ${e}`);
      }
      if (success) {
        console.log('Game saved.');
        log.log('Game saved.');
      }
    } catch(e){
      console.error(`There was an error while trying to save. Error: ${e}`);
    }

  },

  load: function() {
    let saveData = JSON.parse(localStorage.getItem(SAVE));
    // make sure there is a saved game
    if (saveData !== null) {
      reassignData(saveData);
    }
  },

  reset: function() {
    if (confirm('Do you want to clear your save and completely start over?')) {
      // clear saved game
      if (localStorage.getItem(SAVE)) {
        localStorage.removeItem(SAVE);
      }
      // clear the table
      document.getElementById('data').innerHTML = '';
      // clear the contents
      document.getElementById('content').innerHTML = '';

      reassignData(initData);
      game.init();
    }
  }
};


// ------------------------------ resources ------------------------------
const resources = {
  init: function() {
    // set up all init amount to 0 if amount doesn't exist
    for (const item in data) {
      if (!data[item].amount) {
        data[item].amount = 0;
      }
    }
  },

  tick: function() {
    for (const i in data) {
      const item = data[i];
      const itemName = item.name;
      const amount = item.amount;
      const article = document.querySelector(`#${item.name}`);

      // set up article if null
      if (!article) {
        if (item.amount && item.amount > 0) {
          // set up data in sidebar
          const article = document.createElement('article');
          article.setAttribute('id', itemName);
          article.innerHTML = `<p>${itemName}: <span class="amount">${utils.num(amount)}</span> <span class="income"></span></p>`;

          document.querySelector('#data').appendChild(article);
        }

      // article already exists:
      } else {
        // check for income
        if (item.income) {
          for (const k in item.income) {
            const incomePerTick = (item.income[k] * amount) / (1000/INTERVAL);
            data[k].amount = data[k].amount + incomePerTick;
          }
        }
        // update the amount
        article.querySelector('.amount').innerHTML = utils.num(amount);
      }

      
    }
  }

};

// ------------------------------ home ------------------------------
const home = {
  tick: function() {
    // add buttons for items that are unlocked
    for (let i in data) {
      const item = data[i];
      const prereq = item.prereq;
      if (!!prereq) {
        const prereqAmount = Object.keys(prereq).length;
        let prereqMetAmount = 0; // to check for multiple prereqs
        for (let costItem in prereq) {
          const costItemAmountReq = prereq[costItem];
          if (data[costItem].amount >= costItemAmountReq) {
            prereqMetAmount++;
          }
        }
        if (prereqAmount === prereqMetAmount) {
          if (!document.querySelector(`[data-name='${item.name}']`)) {
            utils.createButton(item, 'get');
          }
        }
      }
    }
    // update buttons
    const buttons = document.querySelectorAll('button');
    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      const buttonDataName = button.dataset.name;
      const item = data[buttonDataName];

      // enable/disable button
      for (const costItem in item.cost) {
        if (data[costItem].amount >= item.cost[costItem]) {
          button.disabled = false;
        } else {
          button.disabled = true;
        }
      }

      // update cost info
      if (item.cost) {
        for (const costItem in item.cost) {
          button.querySelector('.cost').innerHTML = `${utils.num(item.cost[costItem])} ${costItem}`;
        }
      }
    }
  }
}

// ------------------------------ utils ------------------------------
const utils = {
  num: function(number) {
    return Math.round(number);
  },

  getSingular: function(name) {
    if (name.slice(-1) === 's'){
      return name.slice(0, -1);
    }
    return name;
  },

  createButton: function(item, action) {
    const button = document.createElement('button');
    const itemName = item.name;

    button.innerHTML = `<p>${action} ${utils.getSingular(itemName)}</p>`;
    if (item.cost) {
      button.disabled = true;
      button.innerHTML += `<p>(cost: <span class="cost"></span>)</p>`;
      for (const costItem in item.cost) {
        button.querySelector('.cost').innerHTML += `${utils.num(item.cost[costItem])} ${costItem}`;
      }
    }
    button.setAttribute('data-name', itemName);
    
    button.addEventListener('click', function() {
      if (!item.cost) {
        item.amount++;
      } else {
        for (const costItem in item.cost) {
          if (data[costItem].amount >= item.cost[costItem]) {

            data[costItem].amount = data[costItem].amount - item.cost[costItem];

            // increase the price of the item
            if (!item.baseCost) {
              item.baseCost = {};
              item.baseCost[costItem] = item.cost[costItem];
            }
            item.cost[costItem] = item.baseCost[costItem] * (Math.pow(1.07, item.amount));
            item.amount++;

            if (data[costItem].amount < item.cost[costItem]) {
              button.disabled = true;
            }
          }
        }
      }
    });

    document.querySelector('#content').appendChild(button);
  }
}

// ------------------------------ game ------------------------------
const game = {
  init: function() {
    // put aside initData
    if (Object.keys(initData).length === 0 && initData.constructor === Object) {
      initData = data;
    }

    save.load();
    resources.init();
    utils.createButton(data.fish, 'get');

    if (!saveEvents) {
      document.getElementById('save').addEventListener('click', function() {
        save.save();
      });
      document.getElementById('reset').addEventListener('click', function() {
        save.reset();
      });
      saveEvents = true; // prevent reapplying eventlisteners on reset
    }
    
    // start the tick
    const gameTick = setInterval(game.tick, INTERVAL);
  },

  tick: function() {
    // check resource table
    resources.tick();
    home.tick();
    
    // check tab unlocks
    // update tab

  }
}

window.onload = function(){
  game.init();
};
