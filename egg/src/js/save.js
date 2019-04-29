import {egg, money, chicken} from './data';

var save = {
  egg: egg,
  money: money,
  chicken: chicken
};

document.getElementById('save').addEventListener('click', function() {
  localStorage.setItem("save",JSON.stringify(save));
});
document.getElementById('load').addEventListener('click', function() {
  var saved = JSON.parse(localStorage.getItem('save'));
  egg = saved.egg;
  money = saved.money;
  chicken = saved.chicken;
});
