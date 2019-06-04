import 'normalize.css';
import '../css/styles.scss';

import * as name from './elements';

const $openTicketsCounter = document.getElementById(name.openTicketsCounter);

const tick = 500;
const decimalPlaces = 0;

function increment(el, amount) {
  el.innerHTML = (Number(el.innerHTML) + amount).toFixed(decimalPlaces);
}
const ticketIncrement = setInterval(function() {
  increment($openTicketsCounter, 1)
}, tick);