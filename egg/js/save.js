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



// diff seed here

var txt = JSON.stringify({game:'abc', woot:'success', player:'noob'});

SaveMgr.save(txt, null, function(data){
    console.log(data);
    console.log(SaveMgr.curCode);
    SaveMgr.find(SaveMgr.curCode, function(d){
        console.log(d);
        console.log(SaveMgr.curCode);
        window.setTimeout(function(){
            SaveMgr.save('blahblah', SaveMgr.curCode, function(d2){
               console.log(SaveMgr.curCode);
                SaveMgr.find(SaveMgr.curCode, function(d3, text){
                    console.log('2nd find: '+text);
                    console.log(SaveMgr.curCode);
                }, function(xhr, status, err){console.log(err);});
            });
        }, 300000);
    });    
});