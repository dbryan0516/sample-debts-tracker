const assert = require('chai').assert;

const DebtCollector = require('./../src/debt-collector');


describe('Script', function() {

  describe('integration tests', function() {
    it('successfully returns with only debt data', function() {

      let debts = [
        {
          "amount": 123.46,
          "id": 0
        },
      ];

      let dc = new DebtCollector(debts);
      dc.calculateAmountPaid();
      dc.processDebts();

      let processedDebts = dc.debts;

      // checks 1 debt was processed with all fields
      assert.equal(processedDebts.length, 1);
      assert.equal(processedDebts[0].amount, 123.46);
      assert.equal(processedDebts[0].id, 0);
      assert.equal(processedDebts[0].remaining_amount, 123.46);
      assert.isNull(processedDebts[0].next_payment_due_date);
      assert.isFalse(processedDebts[0].is_in_payment_plan);
    });
  });
});
