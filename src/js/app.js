import 'normalize.css';
import '../css/style.scss';

// import {v} from './save';
// import * as data from './data';
// import './data';

// console.log(v);
// console.log(data.d);

let data = {
  increment: 0
}

document.querySelector('.increment').addEventListener('click', function(){
  console.log(data.increment);
  data.increment++;
  document.querySelector('.increment-counter').innerHTML = data.increment;
  console.log(data.increment);
});

// save
document.getElementById('save').addEventListener('click', function(e){
  let save = {
    increment: data.increment
  };
  localStorage.setItem('code-save', JSON.stringify(save));
});

// load
document.getElementById('load').addEventListener('click', function(e){
  let save = JSON.parse(localStorage.getItem('code-save'));
  data.increment = save.increment;
});

// reset
document.getElementById('reset').addEventListener('click', function(e){
  if (confirm('Are you sure you want to clear your save? This will wipe out everything!')) {
    localStorage.removeItem('code-save');
  }
});