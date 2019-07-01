const eggs = {
  chicken: {
    amount: 0,
    rarity: 1000,
    sell: {
      cost: 0.5,
    },
  },
  duck: {
    amount: 0,
    rarity: 60,
  },
  goose: {
    amount: 0,
    rarity: 5
  },
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

let animals = [];
for (let animal in eggs) {
  for (let i = 0; i < eggs[animal].rarity; i++) {
    animals.push(animal);
  }
}

document.getElementById('gather-egg').addEventListener('click', function(){
  const name = animals[Math.floor(Math.random()*animals.length)];
  
  eggs[name].amount++;
  document.querySelector(`.${name}-eggs .amount`).innerHTML = eggs[name].amount;
  
});

