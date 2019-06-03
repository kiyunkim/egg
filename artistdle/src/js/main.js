import 'normalize.css';
import '../css/main.scss';

import './dev';


// data
const data = {};

// player data
let player = {
  talent: 0,
  skills: {},
  boost: 0,
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

console.log(data);