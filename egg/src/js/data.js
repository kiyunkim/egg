const money = {
  name: 'money',
  count: 0,
  unlocks: {
    chicken: {
      at: 10,
    }
  }
};

const animals = {
  chicken: {},
  duck: {},
  goose: {},
};

const eggs = {
  chicken: {
    count: 0,
    unlocks: {},
    sell: {
      count: 12,
      costPerCount: 0.5,
    }
  },
  duck: {},
  goose: {},
};

const producers = {
  chicken: {
    count: 1,
    cost: 15,
    produce: {
      egg: 0.05
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