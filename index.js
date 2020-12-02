const DebtCollector = require('./src/debt-collector');

// Prompt: https://gist.github.com/jeffling/2dd661ff8398726883cff09839dc316c
// Script used to process debts
// Outputs debts from API with calculated remaining amounts, next payment due date, and payment plan status
let dc = new DebtCollector();

// populate object with data from API
dc.populateData().then(() => {
  dc.calculateAmountPaid(); // aggregate payments to reduce runtime
  dc.processDebts(true); // process each debt and add new fields
}).catch((error) => {
   console.log('Error populating data from API');
   console.log(error);
});

