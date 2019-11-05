DRGN.resources = {


  resetAmounts: function() {
    for (itemName in DRGN.data) {
      var item = DRGN.data[itemName];
      if (item.hasOwnProperty('name')) {
        // if item has 'name', set amount
        item.amount = 0;
        for (prop in item) {
          if (prop === 'jobs') {
            var jobName = prop;
            for (job in item[jobName]) {
              // if item is a creature & has workers,
              // reset amounts for those
              item[jobName][job].amount = 0;
            }
          }
        }
      }
    }
  }
}