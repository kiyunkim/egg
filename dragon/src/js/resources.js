DRGN.resources = {

  rebuildTable: true,

  init: function() {
    this.resetAmounts();

    // create initData obj
    var initData = DRGN.initData;
    var data = DRGN.data;

    for (itemName in data) {
      initData[itemName] = data[itemName];
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
  },

  updateTable: function() {


  },

  rebuildTable: function() {
    var table = DRGN.el.table;
    var data = DRGN.data;
    data.dragons.amount = 2;
    data.dragons.jobs.collectors.amount = 2;

    // empty table
    table.innerHTML = '<caption class="sr-only">resource data</caption>';
    
    for (itemName in data) {
      var item = data[itemName];
      if (item.amount > 0) { // check if item exists
        // set up labels ..
        this.appendTableLabels();

        this.appendTableRow(item);
        if (!!item['jobs']) { // check if item is a creature that might have been assigned jobs
          for (jobName in item['jobs']) {
            var worker = item['jobs'][jobName];
            if (worker.amount > 0) {
              this.appendTableRow(worker);
            }
          }
        }
      }
    }
  },

  appendTableLabels: function() {
    var table = DRGN.el.table;

    var row = document.createElement('tr');
    var name = document.createElement('th');
    var amount = document.createElement('th');
    var income = document.createElement('th');

    name.setAttribute('scope', 'col');
    name.innerHTML = 'item';
    
    amount.setAttribute('scope', 'col');
    amount.innerHTML = 'amount';

    income.setAttribute('scope', 'col');
    income.innerHTML = 'income';

    row.appendChild(name);
    row.appendChild(amount);
    row.appendChild(income);
    table.appendChild(row);
  },

  appendTableRow: function(item) {
    var table = DRGN.el.table;

    var row = document.createElement('tr');
    var name = document.createElement('td');
    var amount = document.createElement('td');
    var income = document.createElement('td');

    row.dataset.name = item.name; // set row data-name to item name

    name.dataset.td = 'name';
    name.innerHTML = item.name;
    amount.dataset.td = 'amount';
    amount.innerHTML = item.amount;
    income.dataset.td = 'income';
    // TODO: income calc

    row.appendChild(name);
    row.appendChild(amount);
    row.appendChild(income);

    table.appendChild(row);
  }
}