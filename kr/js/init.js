$(document).ready(function () {
  var game = new Game({
    variable: '',
    variable2: '',
    attackButton: '#attack'
  });

  game.setup();
});

/////////


  $(document).ready(function() {
    // TODO: change function name..
    myFunc({
      lettersList: '.letters-list',
      lettersListItems: '',
      lettersListLinks: '.letters-link',
      wordsListsContainer: '.words-container',   // using
      wordsSectionClass: 'words-section',        // using
      wordsHeadingClass: 'words-heading',        // using
      wordsListClass: 'words-list',              // using
      wordLinkClass: 'word',                     // using
      wordsColumnClass: 'columns'                // using
    });
  });
