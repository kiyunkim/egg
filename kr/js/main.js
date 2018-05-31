var game = {
  fps: 100, // tick ms
  decimals: 0,
  amount: 0,

  // element selectors
  button: {},
  counter: {},

  // setInterval
  // stop with window.clearInterval(game.interval)
  interval: {},
  
  producers: [],

  init: function() {
    var self = this; // var game

    this.button = $('.btn');
    this.counter = $('.counter');

    // click to increment
    this.button.click(function() {
      self.increment();
    });

    // interval
    this.interval = window.setInterval(function() {
      self.update();
    }, this.interval);

  },

  increment: function() {
    this.amount++;
  },

  update: function() {
    this.counter.text(this.amount);
  }
};

game.init();