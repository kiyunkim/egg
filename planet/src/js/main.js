import 'normalize.css';
import '../css/main.scss';

import {Resource} from './resources';

export const GAME = {};

GAME.VERSION = '0.1.0';
GAME.INTERVAL = 1000;

let fish = new Resource({
  name: 'fish',
  id: 'fish'
});

fish.introduce();