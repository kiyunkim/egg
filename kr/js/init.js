$(document).ready(function () {
  var game = new _game({
    variable: '',
    variable2: '',
    attackButton: '#attack'
  });
  var test = new _test();

  game.init();
  test.init();
});