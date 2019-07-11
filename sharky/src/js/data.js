export function reassignData(d) {
  data = d;
};

export let data = {
  // stuff
  fish: {
    name: 'fish',
    value: 1
  },
  sand: {
    name: 'sand',
    value: 1
  },
  crystal: {
    name: 'crystal',
    value: 10
  },
  coral: {
    name: 'coral',
    value: 1
  },

  // special stuff
  science: {
    name: 'science',
  },

  // workers
  sharks: {
    name: 'sharks',
    income: {
      fish: 1
    },
    prereq: {
      fish: 5
    },
    cost: {
      fish: 5
    },
    jobs: [
      // breeder
      {
        name: 'breeders',
        income: {
          sharks: 0.05
        },
      },
      // scientist
      {
        name: 'scientists',
        income: {
          science: 0.5
        }
      }
    ],
  },

  rays: {
    name: 'rays',
    income: {
      fish: 0.2,
      sand: 1
    },
    prereq: {
      fish: 15
    },
    cost: {
      fish: 15
    },
    jobs: [
      // maker
      {
        name: 'makers',
        income: {
          ray: 0.05
        }
      },
      // lapidarist
      {
        name: 'lapidarists',
        income: {
          sand: -2,
          crystal: 1
        }
      }
    ]
  },

  crabs: {
    name: 'crabs',
    income: {
      crystal: 0.01,
      coral: 0.02
    },
    prereq: {
      sharks: 4,
      rays: 4
    },
    cost: {
      fish: 10
    },
    jobs: [
      // breeders
      {
        name: 'breeders',
        income: {
          crabs: 0.2
        }
      }
    ]
  }
};