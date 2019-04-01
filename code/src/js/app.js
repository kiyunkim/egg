import 'normalize.css';
import '../css/style.scss';

import './dev';

let data = {
  increment: 0
}

const incrementButton = document.querySelector('.increment');


incrementButton.addEventListener('click', function(){
  data.increment++;
  update();
});

function update() {
  document.querySelector('.increment-counter').innerHTML = data.increment;
}
