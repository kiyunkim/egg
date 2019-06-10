// data
let data = {};

// player data
let player = {
  talent: 0,
  pieces: {},
  skills: {},
  materials: {},
};

// pieces
data.pieces = {
  sketches: {
    quality: {
      poor: 0,
      ok: 0,
      good: 0,
      great: 0,
      excellent: 0
    },
    total: 0
  },
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

export {data};