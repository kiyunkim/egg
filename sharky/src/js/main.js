import 'normalize.css';
import  '../css/main.scss';

import {data} from './data';

const INTERVAL = (1000 / 10);
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
      if (data[item].amount && data[item].amount > 0) {
        const itemName = data[item].name;
        const amount = data[item].amount;
        if (!document.querySelector(`#${data[item].name}`)) {
          // set up data in sidebar
          const article = document.createElement('article');
          article.setAttribute('id', itemName);
          article.innerHTML = `<p>${itemName}: <span class="amount">${amount}</span></p>`;

          document.querySelector('#data').appendChild(article);
        } else {
          // or just update the amount
          const article = document.querySelector(`#${data[item].name}`);
          article.querySelector('.amount').innerHTML = amount;
        }
      }
    }
  }

};

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
        // check if player has it
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
    
    // check tab unlocks
    // update tab
  }
}

window.onload = function(){
  game.init();
};
