DRGN.resources = {


  resetAmounts: function() {
    for (category in DRGN.data) {
      for (thing in DRGN.data[category]) {
        console.log(thing);
        console.log(DRGN.data[category][thing]);
      }
    }
  }
}