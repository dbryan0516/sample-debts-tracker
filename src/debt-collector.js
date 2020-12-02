const { apiGet } = require('./utils');

class DebtCollector {

  plansUrl = 'https://my-json-server.typicode.com/druska/trueaccord-mock-payments-api/payment_plans';
  debtsUrl = 'https://my-json-server.typicode.com/druska/trueaccord-mock-payments-api/debts';
  paymentsUrl = 'https://my-json-server.typicode.com/druska/trueaccord-mock-payments-api/payments';

  constructor(debts, plans, payments) {
    this.debts = debts || [];
    this.paymentPlans = plans || [];
    this.payments = payments || [];
  }

  // Fetch data from API asynchronously
  async populateData() {
    // gather independent api calls
    let promises = Promise.all([
      apiGet(this.plansUrl),
      apiGet(this.debtsUrl),
      apiGet(this.paymentsUrl)
    ]);

    // fire off async api calls
    await promises.then((responses) => {
      this.paymentPlans = responses[0];
      this.debts = responses[1];
      this.payments = responses[2];
    });
  }

  // Aggregate payments for each payment plan
  calculateAmountPaid() {
    this.aggregatedPayments = {};
    if (this.payments && this.payments.length === 0) {
      return;
    }

    this.payments.forEach((payment) => {
      let planId = payment.payment_plan_id;
      if (!this.aggregatedPayments.hasOwnProperty(planId)) {
        this.aggregatedPayments[planId] = {amount_paid: 0};
      }
      this.aggregatedPayments[planId]['amount_paid'] += payment.amount;
    });

  }

  // Returns remaining amount needed to pay off debt
  getRemainingAmount(debt, paymentPlan) {
    let paymentPlanId = paymentPlan.id;

    let totalPaid = 0;
    if (this.aggregatedPayments.hasOwnProperty(paymentPlanId)) {
      totalPaid = this.aggregatedPayments[paymentPlan.id]['amount_paid'];
    }

    return paymentPlan.amount_to_pay - totalPaid;
  }

  // Calculates the next payment date based off of
  // total amount paid, installment frequency, and payment plan start date
  // Returns date as in ISO 8601 String format
  getNextPaymentDate(debt, paymentPlan) {

    if (debt.remaining_amount === 0) {
      return null;
    }
    let frequency = paymentPlan.installment_frequency;
    let paymentStartString = paymentPlan.start_date;

    let paymentStartDate = new Date(paymentStartString);

    let numWeeks = 1; // default to WEEKLY
    if (frequency === 'BI_WEEKLY') {
      numWeeks = 2;
    }
    let totalPaid = 0;
    if (this.aggregatedPayments.hasOwnProperty(paymentPlan.id)) {
       totalPaid = this.aggregatedPayments[paymentPlan.id]['amount_paid'];
    }
    // determine what payment number they are on
    // 2 or 2.5 payments made, means they are on payment 3
    let paymentNumber = Math.floor(totalPaid / paymentPlan.installment_amount) + 1;

    paymentStartDate.setDate(paymentStartDate.getDate() + (numWeeks * 7 * paymentNumber));

    // this is needed to ignore UTC offsets
    // time is not given via API so lets set things back to 0:00
    // src: https://stackoverflow.com/questions/17545708/parse-date-without-timezone-javascript
    let offsetFreeDate = new Date(paymentStartDate.getTime() - paymentStartDate.getTimezoneOffset() * 60000);
    return offsetFreeDate.toISOString();
  }

  // Process each of the debts to determine additional fields
  // Prints debts to console if output is set to true
  processDebts(output = false) {

    this.debts.forEach((debt) => {
      let paymentPlan = this.paymentPlans.find((plan) => plan.debt_id === debt.id) || null;
      debt['is_in_payment_plan'] = paymentPlan != null;
      if (debt.is_in_payment_plan) {
        debt['remaining_amount'] = this.getRemainingAmount(debt, paymentPlan);
        debt['next_payment_due_date'] = this.getNextPaymentDate(debt, paymentPlan);
      } else {
        debt['remaining_amount'] = debt.amount;
        debt['next_payment_due_date'] = null;
      }

      if (output) {
        //console.log(debt);
        console.log(JSON.stringify(debt));
      }

    });
  }
}


module.exports = DebtCollector;
