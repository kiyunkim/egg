let data = {
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

export {data};