let data = {
  // TODO: automate amounts

  // items
  gold: {
    name: 'gold',
    singular: 'gold',
    type: 'item',
    amount: 0,
  },
  gems: {
    name: 'gems',
    singular: 'gem',
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
      gold: 20
    },
    jobs: [
      // collector
      {
        name: 'collector',
        amount: 0,
        income: {
          gold: 0.1
        },
        req: ['gold']
      },
      // jeweler
      {
        name: 'jeweler',
        income: {
          
        },
        req: ['gold', 'gems']
      },
      // merchant
      {
        name: 'merchant',
      },
      // miner
      {
        name: 'miner',
        income: {

        }
      },
      // monk
      {
        name: 'monk',
      },
      // magician
      {
        name: 'magician',
      },
      // hunter
      {
        name: 'hunter',
      },
    ]
  },
  
};


export {data};