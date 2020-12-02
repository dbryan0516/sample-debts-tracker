const assert = require('chai').assert;

const DebtCollector = require('./../src/debt-collector');


describe('DebtCollector', function() {

  describe('integration tests', function() {
    it('successfully processes one debt in a payment plan with payments', function() {
      let debts = [
        { "amount": 150, "id": 0 },
      ];

      let payments = [
        {
          "amount": 5,
          "date": "2020-10-01",
          "payment_plan_id": 0
        },
        {
          "amount": 5,
          "date": "2020-10-15",
          "payment_plan_id": 0
        }
      ];

      let plans = [
        {
          "amount_to_pay": 100,
          "debt_id": 0,
          "id": 0,
          "installment_amount": 5,
          "installment_frequency": "BI_WEEKLY",
          "start_date": "2020-9-30"
        },
      ];

      let dc = new DebtCollector(debts, plans, payments);
      dc.calculateAmountPaid();
      dc.processDebts();

      let processedDebts = dc.debts;

      // checks 1 debt was processed with all fields
      assert.equal(processedDebts.length, 1);
      assert.equal(processedDebts[0].amount, 150);
      assert.equal(processedDebts[0].id, 0);
      assert.equal(processedDebts[0].remaining_amount, 90);
      assert.equal(processedDebts[0].next_payment_due_date, '2020-11-11T00:00:00.000Z');
      assert.isTrue(processedDebts[0].is_in_payment_plan);
    });

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

    it('correctly gets next payment date, when two payments are made', function() {
      let payments = [
        {
          "amount": 5,
          "date": "2020-10-01",
          "payment_plan_id": 0
        },
        {
          "amount": 5,
          "date": "2020-10-14",
          "payment_plan_id": 0
        }
      ];

      let plan = {
          "amount_to_pay": 100,
          "debt_id": 0,
          "id": 0,
          "installment_amount": 5,
          "installment_frequency": "BI_WEEKLY",
          "start_date": "2020-9-30"
        };

      let fakeDebt = {remaining_amount: 100};

      let dc = new DebtCollector(null, null, payments);
      dc.calculateAmountPaid();
      let date = dc.getNextPaymentDate(fakeDebt, plan);

      assert.equal(date, '2020-11-11T00:00:00.000Z');
    });
  });
});
