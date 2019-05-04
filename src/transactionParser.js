const csvtojson = require('csvtojson');
const path = require('path');
const _ = require('lodash');

function getTransactions() {
  return csvtojson().fromFile(path.resolve(__dirname, '../transactions.csv'));
}

function getTradesFromTransactions(transactions) {
  // group by stock
  // loop thourhg each stock

  const transactionsGroupedByStockCode = _.groupBy(
    transactions,
    x => x.stockCode
  );
  let trades = [];

  Object.keys(transactionsGroupedByStockCode).forEach(stockCode => {
    const stockCodeTransactions = transactionsGroupedByStockCode[stockCode];
    const stockCodeTrades = getStockTradesFromTransactions(
      stockCodeTransactions
    );
    trades = [...trades, ...stockCodeTrades];
  });

  return trades;
}

function getStockTradesFromTransactions(stockTransactions) {
  // sort transactions by date
  const stockTransactionsSortedByDate = _.orderBy(
    stockTransactions,
    x => new Date(x.date)
  );
  const buyTrades = [];
  const sellTrades = [];
  let currentTradeShares = 0;

  stockTransactionsSortedByDate.forEach((transaction, index) => {
    let { action, quantity, stockCode } = transaction;
    quantity = parseInt(quantity);
    const isSell = action === 'SELL';
    const isBuy = action === 'BUY';

    if (currentTradeShares === 0 && isBuy) {
      currentTradeShares += quantity;
      buyTrades.push({ index, transaction, stockCode });
      return;
    }

    if (isBuy) {
      currentTradeShares += quantity;
    } else if (isSell) {
      currentTradeShares -= quantity;
    }

    if (isSell && currentTradeShares === 0) {
      sellTrades.push({
        index,
        transaction
      });
    }
  });

  let trades = [];
  buyTrades.forEach((buyTrade, index) => {
    const sellTrade = sellTrades[index];
    const isIncompleteTrade = !sellTrade;
    // console.log({ buyTrade: trade, sellTrade });
    let tradeTransactions = [];
    if (isIncompleteTrade) {
      tradeTransactions = stockTransactionsSortedByDate.slice(
        buyTrade.index,
        stockTransactionsSortedByDate.length
      );
    } else {
      tradeTransactions = stockTransactionsSortedByDate.slice(
        buyTrade.index,
        sellTrade.index + 1
      );
    }

    const sellQuantity = getSellTotalSellQuantityFromTransactions(
      tradeTransactions
    );
    const buyQuantity = getSellTotalBuyQuantityFromTransactions(
      tradeTransactions
    );
    const sellTransactions = _.filter(
      tradeTransactions,
      x => x.action === 'SELL'
    );
    const buyTransactions = _.filter(
      tradeTransactions,
      x => x.action === 'BUY'
    );
    const buyTransactionsTotal = getTotalFromTransactions(buyTransactions);
    const sellTransactionsTotal = getTotalFromTransactions(sellTransactions);
    const grainsOrLosses = !isIncompleteTrade
      ? parseFloat((sellTransactionsTotal - buyTransactionsTotal).toFixed(2))
      : 0;
    const firstBuyTransaction = _.first(buyTransactions);
    const lastSellTransaction = _.last(sellTransactions);
    const firstTransaction = _.first(tradeTransactions);
    const lastHoldingPeriodDate = lastSellTransaction
      ? lastSellTransaction.date
      : new Date().toISOString();
    const holdingPeriod =
      getDateDifferencesInDays(firstTransaction.date, lastHoldingPeriodDate) ||
      1;
    const isLoss = Math.max(0, grainsOrLosses) === 0;
    const isWin = !isLoss;
    trades.push({
      transactions: tradeTransactions,
      stockCode: buyTrade.stockCode,
      quantity: isIncompleteTrade ? buyQuantity : sellQuantity,
      isIncomplete: isIncompleteTrade,
      quantityOnHold: isIncompleteTrade ? buyQuantity - sellQuantity : 0,
      dateBought: firstBuyTransaction ? firstBuyTransaction.date : null,
      dateSold: lastSellTransaction ? lastSellTransaction.date : null,
      holdingPeriod,
      averageBuyPrice: getAveragePriceFromTransactions(buyTransactions),
      averageSellPrice: getAveragePriceFromTransactions(sellTransactions),
      grainsOrLosses,
      isWin,
      isLoss
    });
  });
  // loop through transactions

  // get first buy date
  // get last sell transaction
  // Should have sold all shares from previous buy transactions
  // if there are buy transactions after then it will be a new trade
  return trades;
}

function getAveragePriceFromTransactions(transactions) {
  let sum = transactions
    .map(x => x.price)
    .reduce((previous, current) => (current += previous), 0);
  return parseFloat((sum / transactions.length).toFixed(4)) || null;
}

function getDateDifferencesInDays(date1, date2) {
  dt1 = new Date(date1);
  dt2 = new Date(date2);
  return Math.floor(
    (Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) -
      Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) /
      (1000 * 60 * 60 * 24)
  );
}

function getSellTotalSellQuantityFromTransactions(transactions) {
  let count = 0;

  _.filter(transactions, x => x.action === 'SELL').forEach(x => {
    count += parseInt(x.quantity || '');
  });

  return count;
}

function getSellTotalBuyQuantityFromTransactions(transactions) {
  let count = 0;

  _.filter(transactions, x => x.action === 'BUY').forEach(x => {
    count += parseInt(x.quantity || '');
  });

  return count;
}

function getTotalFromTransactions(transactions) {
  let count = 0;

  transactions.forEach(x => {
    count += parseFloat(x.total || '', 2);
  });

  return parseFloat(count.toFixed(2));
}

module.exports = {
  getTransactions,
  getTradesFromTransactions,
  getStockTradesFromTransactions,
  getQuantityFromTransactions: getSellTotalSellQuantityFromTransactions
};
