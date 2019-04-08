import {enableSave} from './main';
import {interval} from './main';

if (ENV_DEV) {
  console.log('Environment: Development');
  console.log('Version: '+VERSION);
  
  enableSave();

  function unhide() {
    let hidden = document.querySelectorAll('.hidden');
    for (let i = 0; i < hidden.length; i++) {
      hidden[i].classList.remove('hidden');
    }
  }

  document.getElementById('pause').addEventListener('click', function(){
    clearInterval(interval);
  });

} else {
  console.log('Environment: Production');
}