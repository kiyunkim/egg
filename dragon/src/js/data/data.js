DRGN.initData = {};

DRGN.data = {
  test: {
    test: ''
  },
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
    jobs: {
      collectors: {
        name: 'collectors',
        income: {
          gold: 0.1
        },
        prereq: {
          gold: 0.1
        }
      },
      jewelers: {
        name: 'jewelers',
        prereq: {
          gold: 0,
          gems: 0
        }
      },
      merchants: {
        name: 'merchants'
      },
      miners: {
        name: 'miners'
      },
      magicians: {
        name: 'magicians'
      },
      hunters: {
        name: 'hunters'
      }
    },
  },
  fairies: {
    name: 'fairies',
    cost: {

    },
    jobs: {
      dusters: {
        name: 'dusters'
      },
      scientists: {
        name: 'scientists'
      }
    }
  }
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