DRGN.data = {
  gold: {
    name: 'gold',
  },
  gems: {
    name: 'gems',
  },

  dragons: {
    name: 'dragons',
    cost: {
      gold: 20
    },
    jobs: [
      // collectors
      {
        name: 'collectors',
        income: {
          gold: 0.1
        },
        req: {
          gold: 10
        }
      },
      // jewelers
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

DRGN.dataTypes = {
  raw: {
    name: 'raw materials',
    items: [
      'gold',
      'gems'
    ]
  },
  creatures: {
    name: 'creatures',
    items: [
      
    ],
  },
  workers: { // creatures with jobs
    name: 'workers',
    items: {
      dragons: [
        'collectors',
        'jewelers',
        'merchants',
        'miners',
        'monks',
        'magicians',
        'hunters'
      ]
    }
  },
}