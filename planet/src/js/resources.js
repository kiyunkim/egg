class Planets {
  constructor() {
    // something..
  }
}


export class Resource {
  constructor(data){
    // something
    this.name = data.name;
    this.id = data.id;
  }

  introduce() {
    console.log(`Hello, my name is ${this.name}.`);
  }
}