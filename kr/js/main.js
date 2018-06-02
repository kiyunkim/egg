// to do: choose one of these




var Game = (function (option) {
  var 
  self = this,
  proto = Game.prototype,
  
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

  function updateHTML(selector, content) {
    $(selector).html(content);
  }

  function init() {
    updateHTML('#zombie-hp', zombies.hp);
  }

  function attackZombie() {
    $(attackButton).click(function() {
      if (zombies.hp >= 10) {
        zombies.hp = zombies.hp - 10;
      }
      else if (zombies.hp === 0) {
        alert('zombie is dead!');
      }
      updateHTML('#zombie-hp', zombies.hp);
    });
  } // attackZombie();
  

  proto.myFunc = function () {
    init();
    attackZombie();
  };

  proto.setup = function () {
    proto.myFunc();
  };

  return { setup: self.setup };
});


/////////////


(function() {

  var myFunc = function(options) {
    var alphabet = [],

        // element selectors
        lettersList = options.lettersList,
        lettersListItems = options.lettersListItems,
        lettersListLinks = options.lettersListLinks,
        wordsListsContainer = options.wordsListsContainer,
        $wordsSection,
        wordsSectionClass = options.wordsSectionClass,
        $wordsHeading,
        wordsHeadingClass = options.wordsHeadingClass,
        $wordsList,
        wordsListClass = options.wordsListClass,
        wordLinkClass = options.wordLinkClass,
        wordsColumnClass = options.wordsColumnClass;
        

    function addColumns() {
      $('.'+wordsListClass).each(function() {
        if ($(this).children().length > 3) {
          $(this).addClass(wordsColumnClass);
        }
      });
    }
  
  };

}());