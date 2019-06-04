import 'normalize.css';
import '../css/main.scss';

import './dev';


// data
const data = {};

// player data
let player = {
  talent: 0,
  pieces: {},
  skills: {},
  materials: {},
};

// pieces
data.pieces = {
  sketches: 0,
  drawings: 0,
  paintings: 0,
  prints: 0,
};

// skills
data.skills = {
  drawing: {
    name: 'drawing',
    level: 1,
    boost: 1
  },
  printing: {
    name: 'printing'
  },

};

// materials
data.materials = {
  medium: {
    brush: {
      oil: {},
      acrylic: {},
      watercolor: {},
    },
    paint: {
      oil: {},
      acrylic: {},
      gouache: {},
      watercolor: {}
    },
    charcoal: {},
    graphite: {
      pencil: {},
      block: {},
    },
    ink: {},
    printingPress: {
      name: 'printing press',
      skill: 'printing',
      quality: {
        poor: {
          cost: 800,
          boost: 0.5
        },
        ok: {
          cost: 1000,
          boost: 0.8,
        },
        good: {
          cost: 1500,
          boost: 1,
        },
        great: {
          cost: 2000,
          boost: 1.2,
        },
        excellent: {
          cost: 3000,
          boost: 1.5
        }
      },
    },
  },
  surface: {
    paper: {},
    canvas: {}
  }
};

const tick = 100;


// names for each action, for picking up section id
const sketch = 'sketch';

// element/selector names
const progressBarName = 'progress-bar';

// data-tag
// data-progress, data-value, data-max
let progressStep = 1;
let progressInterval = 25;

// start progress bar interval
function progressInt(name) {
  let wrapper = document.getElementById(name);

  let progressBar = wrapper.querySelector('[data-name="progress-bar"');
  let progressVal = parseInt(progressBar.getAttribute('data-value'));
  let progressMax = parseInt(progressBar.getAttribute('data-max'));
  let progressMeter = progressBar.querySelector('[data-name="progress-meter"]');
  let progressText = progressBar.querySelector('[data-name="progress-amount"]');
  let unit = '%';

  var interval = setInterval(function() {
    if (progressVal === progressMax) {
      setTimeout(function(){
        progressVal = 0;
        progressMeter.style.width = 0;
        progressText.innerHTML = 0 + unit;
      }, 150);
      clearInterval(interval);
      return;
    }
    progressVal += progressStep;
    progressMeter.style.width = progressVal + unit;
    progressText.innerHTML = progressVal + unit;
  }, progressInterval);
}

function work(name) {
  let wrapper = document.getElementById(name);
  let button = wrapper.querySelector('[data-button="'+ name + '"');

  button.addEventListener('click', function() {
    progressInt(name);
  });
}
work(sketch);