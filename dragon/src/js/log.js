// log

import {log as container} from './constants';

// write message and show in the log
export function write(text) {
  const msg = document.createElement('p');
  msg.setAttribute('class', 'log-message'); // TODO: maybe not have this hard-coded
  msg.innerHTML = text;
  container.insertBefore(msg, container.firstChild);
}