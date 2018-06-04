var _game = (function (option) {
  var self = this,
    proto = _game.prototype,
    
    variable = option.variable,
    variable2 = option.variable2,
    attackButton = option.attackButton,

    resources = {

    },
    player = {
      hp: 100,
      level: 0
    },
    zombies = {
      hp: 150,      
      count: 0,
      level: 0 
    };
  

  proto.init = function () {
    // ..
  };

  return { init: self.init };
});