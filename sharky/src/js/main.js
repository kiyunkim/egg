import 'normalize.css';
import  '../css/main.scss';


// -------------------- constants:
const INTERVAL = 100; 
const VERSION = V;

let resources = {
  // animals
  shark: {
    name: 'sharks',
    singular: 'shark',
    cost: {
      resource: 'fish',
      rate: 'linear',
      increase: 5
    },
    income: {
      fish: 1
    },
    prereq: {
      fish: 5
    }
  }
}

let table = {
  rows: {
    name: 'name',
    amount: 'amount'
  },
}
