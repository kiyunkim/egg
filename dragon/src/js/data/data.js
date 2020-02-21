export function reassignData(d) {
  data = d;
};

// TODO: automate amounts
export let data = {};

// items: resources
// workers: builders that generate resources

data.items = [
  { name: 'gold', type: 'item' },
  { name: 'gems', type: 'item' },
  {
    name: 'dragons',
    type: 'worker',
    cost: { gold: 20 },
    jobs: [
      // collector
      {
        name: 'collectors',
        income: { gold: 0.1 },
        req: { gold: 10 }
      },
      // jeweler
      {
        name: 'jewelers',
        income: {},
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
  
];