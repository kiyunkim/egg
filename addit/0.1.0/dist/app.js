"use strict";

var count = 0;
var builders = {
  unlocked: false,
  count: 0,
  mult: 1
};

var testing = function testing(name) {
  return "ello ".concat(name);
};

function log(message) {
  var msg = document.createElement('p');
  msg.innerHTML = message;
  document.getElementById('log').appendChild(msg);
}

;

function updateCount() {
  document.getElementById('count').innerHTML = count;
}

function addit() {
  count++;
}

;

function save() {
  var saveData = {
    data: data
  };
  log('game saved.');
}

;
var util = {
  createButton: function createButton(container, id, text, fnc) {
    var button = document.createElement('button');
    button.setAttribute('id', id);
    button.innerHTML = text;
    document.querySelector(container).appendChild(button);
  }
};

function checkUnlocks() {
  if (count >= 5 && !builders.unlocked) {
    util.createButton('#builders', 'builder' + (builders + 1), 'buy builder');
    builders.unlocked = true;
  }
}

;

function tick() {
  updateCount();
  checkUnlocks();
}

var interval = setInterval(function () {
  tick();
}, 1000 / 10);