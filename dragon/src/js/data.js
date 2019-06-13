let data = {
  // TODO: automate amounts

  // items
  gold: {
    name: 'gold',
    type: 'item',
    amount: 0,
  },
  gems: {
    name: 'gems',
    type: 'item',
    amount: 0,
  },

  // workers
  dragons: {
    name: 'dragons',
    type: 'worker',
    amount: 0,
    cost: {
      gold: 20
    },
    jobs: [
      // collector
      {
        name: 'collectors',
        amount: 0,
        income: {
          gold: 0.1
        },
        req: ['gold']
      },
      // jeweler
      {
        name: 'jewelers',
        income: {
          
        },
        req: ['gold', 'gems']
      },
      // merchant
      {
        name: 'merchants',
      },
      // miner
      {
        name: 'miners',
        income: {

        }
      },
      // monk
      {
        name: 'monks',
      },
      // magician
      {
        name: 'magicians',
      },
      // hunter
      {
        name: 'hunters',
      },
    ]
  },
  
};


export {data};