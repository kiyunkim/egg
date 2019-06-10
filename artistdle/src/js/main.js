import 'normalize.css';
import '../css/main.scss';

import './dev';
import {data} from './data';

const tick = 100;

// names for each action, for picking up article id
const sketch = 'sketch';

// element/selector names
const progressBarName = 'progress-bar'; // progress bar wrapper

/**
 * progress bar loading interval
 * @param {object} name - const name of the wrapper/action
 */
function progressInt(name) {
  let wrapper = document.getElementById(name);

  let progressBar = wrapper.querySelector('[data-name="'+progressBarName+'"');    // progress bar wrapper selector
  let progressMeter = progressBar.querySelector('[data-name="progress-meter"]');  // progress bar meter selector
  let progressText = progressBar.querySelector('[data-name="progress-amount"]');  // progress bar amount selector

  let progressVal = parseInt(progressBar.getAttribute('data-value'));             // progress bar value
  let progressMax = parseInt(progressBar.getAttribute('data-max'));               // progress bar max value
  let unit = '%';
  let progressStep = 1;
  let progressInterval = 25;

  var interval = setInterval(function() {
    // if value meets the max,
    if (progressVal === progressMax) {
      // hold for 150ms
      setTimeout(function(){
        // reset values to 0
        progressVal = 0;
        progressMeter.style.width = 0;
        progressText.innerHTML = 0 + unit;
      }, 150);
      // stop the loading interval
      clearInterval(interval);
      return;
    }
    // if value !== max, increase the value by step
    progressVal += progressStep;
    // update the meter and text to match value
    progressMeter.style.width = progressVal + unit;
    progressText.innerHTML = progressVal + unit;
  }, progressInterval);
}

/**
 * 
 * @param {*} name 
 */
function work(name) {
  let wrapper = document.getElementById(name);
  let button = wrapper.querySelector('[data-button="'+ name + '"');

  button.addEventListener('click', function() {
    progressInt(name);
  });
}
work(sketch);