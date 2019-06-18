// code helpers

// set custom data attribute
export function setDataAttr(element, name, value) {
  element.setAttribute('data-' + name, value);
}

// buttons!
function createButton(item, action, parent) {
  // create a button that's disabled on default
  const button = document.createElement('button');
  // ..
  // insert text as ACTION + ITEM NAME
  
}