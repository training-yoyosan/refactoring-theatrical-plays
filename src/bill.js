function statement(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `Statement for ${invoice.customer}\n`;
  const format = new Intl.NumberFormat("en-US", {style: "currency", currency: "USD", minimumFractionDigits: 2}).format;

  function volumeCreditsFor(aPerformance) {
    let result = 0;

    volumeCredits += Math.max(aPerformance.audience - 30, 0);
    if (playFor(aPerformance).type === "comedy") {
      volumeCredits += Math.floor(aPerformance.audience / 5);
    }

    return result;
  }

  function playFor(aPerformance) {
    return plays[aPerformance.playID];
  }

  function amountFor(aPerfomance) {
    let result = 0;

    switch (playFor(aPerfomance).type) {
      case "tragedy":
        result = 40000;
        if (aPerfomance.audience > 30) {
          result += 1000 * (aPerfomance.audience - 30);
        }

        break;
      case "comedy":
        result = 30000;
        if (aPerfomance.audience > 20) {
          result += 10000 + 500 * (aPerfomance.audience - 20);
        }
        result += 300 * aPerfomance.audience;

        break;
      default:
        throw new Error(`unknown type: ${playFor(aPerfomance).type}`);
    }

    return result;
  }

  for (let perf of invoice.performances) {
    volumeCredits += volumeCreditsFor(perf);

    // print line for this order
    result += ` ${playFor(perf).name}: ${format(amountFor(perf) / 100)} (${perf.audience} seats)\n`;
    totalAmount += amountFor(perf);
  }

  result += `Amount owed is ${format(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits\n`;

  return result;
}

const invoices = require("./data/invoices.json");
const plays = require("./data/plays.json");

for (let invoice of invoices) {
  console.log(statement(invoice, plays));
}
