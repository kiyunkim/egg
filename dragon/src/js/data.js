let data = {
  // items
  gold: {
    name: 'gold',
    singular: 'gold',
    type: 'item',
    amount: 0,
  },

  // workers
  dragons: {
    name: 'dragons',
    singular: 'dragon',
    type: 'worker',
    amount: 0,
    cost: {
      name: 'gold',
      amount: 50
    },
    income: {
      name: 'gold',
      amount: 0.1
    },
    jobs: [
      'jeweler',
      'merchant',
      'magician',
      'hunter',
      'monk'
    ]
  },
};


export {data};