var myCar = new Object();
myCar['make'] = 'Ford'; 
// myCar.make = 'Ford';

var propertyName = 'model';
myCar[propertyName] = 'Mustang'; 
// myCar.model = 'Mustang';

myCar[propertyName] = 1969; 
// myCar.year = 1969;


function showProps(obj, objName) {
  var result = '';
  for (var i in obj) { 
    // obj.hasOwnProperty() is used to filter out properties from the object's prototype chain
    if (obj.hasOwnProperty(i)) {
      result += objName + '.' + i + ' = ' + obj[i] + ';\n';
    }
  }
  return result;
}

console.log(showProps(myCar, 'myCar'));