// code helpers

// imports: constants
import {DATA_NAME} from './constants';

// set custom data attribute
export function setDataAttr(element, name, value) {
  element.setAttribute(`data-${name}`, value);
}

// check if iterable
export function isIterable(obj) {
  return typeof obj[Symbol.iterator] === 'function';
}

// buttons!
export function createButton(item, action, parent) {
  // create a button that's disabled on default
  const button = document.createElement('button');
  button.disabled = true;

  // insert text as action + item name &
  // set attr data-DATA_NAME value as item name
  const itemName = item.name;
  button.innerHTML = `${action} ${itemName}`; // TODO: get singular item name
  setDataAttr(button, DATA_NAME, itemName);
  
  // check if the item costs anything
  if (item.cost) {
    // yes, add a span to display the cost
    const costInfo = document.createElement('span');
    costInfo.setAttribute('class', 'cost'); // TODO: might need a better class name

    // check if cost requires more than 1 type of item,
    // then add cost info to the span
    if (isIterable(item.cost)) { // TODO: decide if i should use this or Object.keys(item.cost).length ?
      // TODO
      // ..
    } else { // costs only 1 type of item
      for (const costItem in item.cost) {
        const costValue = item.cost[costItem];
        costInfo.innerHTML = `${costValue} ${costItem}`;
      }
    }
    // add the cost span to button
    button.appendChild(costInfo);
  } else {
    // if it doesn't cost anything, enable the button
    button.disabled = false;
  }

  parent.appendChild(button);
}