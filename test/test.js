const assert = require('chai').assert;

const DebtCollector = require('./../src/debt-collector');


describe('DebtCollector', function() {

  describe('integration tests', function() {
    it('successfully returns with only debt data', function() {
      let debts = [
        { "amount": 123.46, "id": 0 },
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

  describe('unit tests', function() {
    it('correctly aggregates payments', function() {
      let payments = [
        {
          "amount": 5,
          "date": "2020-09-29",
          "payment_plan_id": 0
        },
        {
          "amount": 10,
          "date": "2020-10-29",
          "payment_plan_id": 0
        },
        {
          "amount": 100,
          "date": "2020-08-08",
          "payment_plan_id": 1
        },
      ];

      let dc = new DebtCollector(null, null, payments);
      dc.calculateAmountPaid();

      let aggregatedPayments = dc.aggregatedPayments;

      // checks 1 debt was processed with all fields
      assert.equal(aggregatedPayments[0].amount_paid, 15);
      assert.equal(aggregatedPayments[1].amount_paid, 100);
    });
  });
});
