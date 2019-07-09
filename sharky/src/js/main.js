import 'normalize.css';
import  '../css/main.scss';

import {data} from './data';

const INTERVAL = 100;
const VERSION = V;

// ------------------------------ resources ------------------------------
const resources = {
  init: function() {
    // set up all init amount to 0
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
          article.innerHTML = `<p>${itemName}: <span class="amount">${amount}</span> <span class="income"></span></p>`;

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
    // update buttons
    const buttons = document.querySelectorAll('button');
    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      const itemName = button.dataset.name;
      const item = data[itemName];

      // enable button
      if (button.disabled === true) {
        for (const costItem in item.cost) {
          if (data[costItem].amount >= item.cost[costItem]) {
            button.disabled = false;
          }
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

  createButton: function(item, action, parent) {
    const button = document.createElement('button');
    const itemName = item.name;

    button.innerHTML = `<p>${action} ${utils.getSingular(itemName)}</p>`;
    if (item.cost) {
      button.disabled = true;
      button.innerHTML += `<p>(cost: <span class="cost"></span>)</p>`;
      for (const costItem in item.cost) {
        button.querySelector('.cost').innerHTML += `${item.cost[costItem]} ${costItem}`;
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
            // TODO: there should be a base cost that does not change
            if (!item.baseCost) {
              item.baseCost = {};
              item.baseCost[costItem] = item.cost[costItem];
            }
            item.cost[costItem] = item.baseCost[costItem] * (Math.pow(1.07, item.amount));
            console.log(item.cost[costItem]);
            item.amount++;

            if (data[costItem].amount < item.cost[costItem]) {
              button.disabled = true;
            }
          }
        }
      }
    });

    document.querySelector(parent).appendChild(button);
  }
}

// ------------------------------ game ------------------------------
const game = {
  init: function() {
    resources.init();
    utils.createButton(data.fish, 'get', '#content');
    utils.createButton(data.sharks, 'get', '#content');

    // start the tick
    const tick = setInterval(game.tick, INTERVAL);
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
