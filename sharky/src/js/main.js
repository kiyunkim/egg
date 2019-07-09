import 'normalize.css';
import  '../css/main.scss';

import {data} from './data';

const INTERVAL = 100;
const VERSION = V;


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
    for (const item in data) {
      const itemName = data[item].name;
      const amount = data[item].amount;
      const article = document.querySelector(`#${data[item].name}`);

      if (!article) {
        if (data[item].amount && data[item].amount > 0) {
          // set up data in sidebar
          const article = document.createElement('article');
          article.setAttribute('id', itemName);
          article.innerHTML = `<p>${itemName}: <span class="amount">${amount}</span></p>`;

          document.querySelector('#data').appendChild(article);
        }
      } else {
        // or just update the amount
        article.querySelector('.amount').innerHTML = amount;
      }
      
    }
  }

};

const home = {
  tick: function() {
    const buttons = document.querySelectorAll('button');
    for (let i = 0; i < buttons.length; i++) {
      const itemName = buttons[i].dataset.name;
      // enable button
      if (buttons[i].disabled === true) {
        const item = data[itemName];
        for (const k in item.cost) {
          if (data[k].amount >= item.cost[k]) {
            buttons[i].disabled = false;
          }
        }
      }
    }
  }
}

const utils = {
  getSingular: function(name) {
    if (name.slice(-1) === 's'){
      return name.slice(0, -1);
    }
    return name;
  },

  createButton: function(item, action, parent) {
    const button = document.createElement('button');
    const itemName = item.name;

    if (item.cost) {
      button.disabled = true;
    }
    button.innerHTML = `${action} ${utils.getSingular(itemName)}`;
    button.setAttribute('data-name', itemName);
    
    button.addEventListener('click', function() {
      if (!item.cost) {
        item.amount++;
      } else {
        for (const k in item.cost) {
          if (data[k].amount >= item.cost[k]) {
            data[k].amount = data[k].amount - item.cost[k];
            item.amount++;

            if (data[k].amount < item.cost[k]) {
              button.disabled = true;
            }
          }
        }
      }
    });

    document.querySelector(parent).appendChild(button);
  }
}

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
