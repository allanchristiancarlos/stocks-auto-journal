const csvtojson = require('csvtojson');

async function main() {
  const transactions = await csvtojson().fromFile('./transactions.csv');

  console.log(transactions);
}

main();

