var game = {};

// variables
game.v = {};
game.v.letters = 'ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎ';
game.v.letters_array = game.v.letters.split('');
game.v.letters_count = game.v.letters_array.length;

// elements
game.e = {};
game.e.main = document.getElementById('game');
game.e.letters_container = document.getElementById('letters');

// html templates
game.t = {};
game.t.letter = document.createElement('article');
  game.t.letter.setAttribute('id', 'letter-'+1);
  game.t.letter.innerHTML = game.v.letters_array[0];

game.e.letters_container.appendChild(game.t.letter);


// functions
game.init = function() {
  var self = this;

  
}

game.init();