const money = {};
money = {
  name: 'money',
  count: 0,
  unlocks: {
    chicken: {
      at: 10,
    }
  }
};

const animals = {};
animals = {
  chicken,
  duck,
  goose
};

const eggs = {};
eggs = {
  default: {
    // name: 'egg',
    count: 0,
    unlocks: [],
    sell: {
      count: 12,
      costPerCount: 0.5,
    }
  },
  chicken: {},
  duck: {},
  goose: {},
};

const producers = {};
producers = {
  chicken: {
    count: 0,
    cost: 15,
    produce: {
      egg: 0.5
    }
  },
  duck: {},
  goose: {},
};

export {
  money,
  animals,
  eggs,
  producers
};