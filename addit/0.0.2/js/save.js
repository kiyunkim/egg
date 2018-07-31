// i really do not know what i am doing here

// call function on 'save' button
function save() {
  var save = game;
  localStorage.setItem("save",JSON.stringify(save));
}

// call function on page load.. or something
function loadSave() {
  var savedGame = JSON.parse(localStorage.getItem("save"));
}