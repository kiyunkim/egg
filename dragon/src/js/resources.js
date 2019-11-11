DRGN.resources = {

  init: function() {
    this.resetAmounts();

    // create player resource obj
    var player = DRGN.player;
    var data = DRGN.data;

    for (itemName in data) {
      player[itemName] = data[itemName];
    }
  },


  resetAmounts: function() {
    for (itemName in DRGN.data) {
      var item = DRGN.data[itemName];
      if (item.hasOwnProperty('name')) { // check if item has 'name' property
        item.amount = 0; // if yes, set amount
        for (prop in item) {
          if (prop === 'jobs') { // then check if it has jobs/workers
            var jobName = prop;
            for (job in item[jobName]) {
              item[jobName][job].amount = 0; // & reset amounts for those
            }
          }
        }
      }
    }
  }
}