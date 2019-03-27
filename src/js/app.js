import 'normalize.css';
import '../css/style.scss';

let data = {
  increment: 0
}

document.querySelector('.increment').addEventListener('click', function(){
  data.increment++;
  update();
});

function update() {
  document.querySelector('.increment-counter').innerHTML = data.increment;
}

if (ENV_DEV) {
  console.log('Environment: Development');
  document.querySelector('.save-buttons').classList.remove('hidden');
  enableSave();
} else {
  console.log('Environment: Production');
}


// save
function enableSave(){
  document.getElementById('save').addEventListener('click', function(e){
    let save = {
      increment: data.increment
    };
    try {
      var success = true;
  
      // try saving..
      try {
        localStorage.setItem('code-save', JSON.stringify(save));
      } catch(e) {
        success = false;
        console.log('Error occurred while trying to save!   "'+e+'"');
      }
  
      if(success) {
        console.log('Saved successfully');
      }
    
    } catch(e) {
      console.log('Something went wrong while trying to save');
    }
  });
  
  // load
  document.getElementById('load').addEventListener('click', function(e){
    let save = JSON.parse(localStorage.getItem('code-save'));
    data.increment = save.increment;
    update();
  });
  
  // reset
  document.getElementById('reset').addEventListener('click', function(e){
    if (confirm('Are you sure you want to clear your save? This will wipe out everything!')) {
      localStorage.removeItem('code-save');
    }
  });
}
