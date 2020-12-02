const DebtCollector = require('./src/debt-collector');

 let dc = new DebtCollector();
 dc.populateData().then(() => {
  dc.calculateAmountPaid();
  dc.processDebts(true);
 }).catch((error) => {
   console.log('Error populating data from API');
   console.log(error);
 });

