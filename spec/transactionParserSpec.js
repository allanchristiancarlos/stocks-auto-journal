const transactionParser = require('../src/transactionParser');

describe('transactionParserSpec', () => {
  it('should parse transactions csv file to json array', async done => {
    const transactions = await transactionParser.getTransactions();
    expect(transactions.length).toBeGreaterThan(1);
    done();
  });

  it('should return trades from transactions', async () => {
    const transactions = await transactionParser.getTransactions();
    const trades = transactionParser.getTradesFromTransactions(transactions);
    console.log({ trades });
  });

  it('should return an incomplete trade if trade last transaction is a BUY action', () => {
    const [, trade2] = transactionParser.getStockTradesFromTransactions([
      {
        trade_id: 3297483,
        date: '2019-03-28T03:57:30.000Z',
        action: 'BUY',
        stockCode: 'CPG',
        quantity: 20000,
        price: 0.53,
        fees: 31.27,
        total: 10631.27
      },
      {
        trade_id: 3260239,
        date: '2019-03-21T02:41:15.000Z',
        action: 'SELL',
        stockCode: 'CPG',
        quantity: 20000,
        price: 0.55,
        fees: 98.45,
        total: 10901.55
      },
      {
        trade_id: 3259769,
        date: '2019-03-21T02:08:21.000Z',
        action: 'BUY',
        stockCode: 'CPG',
        quantity: 20000,
        price: 0.55,
        fees: 32.45,
        total: 11032.45
      }
    ]);

    expect(trade2.isIncomplete).toBe(true);
  });

  it('should return correct trade quantity/shares if trade is incomplete', () => {
    const trades = transactionParser.getStockTradesFromTransactions([
      {
        trade_id: 3484228,
        date: '2019-05-02T12:23:18.000Z',
        action: 'SELL',
        stockCode: 'CPG',
        quantity: 10000,
        price: 0.53,
        fees: 94.87,
        total: 10505.13
      },
      {
        trade_id: 3297483,
        date: '2019-03-28T03:57:30.000Z',
        action: 'BUY',
        stockCode: 'CPG',
        quantity: 20000,
        price: 0.53,
        fees: 31.27,
        total: 10631.27
      },
      {
        trade_id: 3484228,
        date: '2019-05-03T12:23:18.000Z',
        action: 'SELL',
        stockCode: 'CPG',
        quantity: 5000,
        price: 0.53,
        fees: 94.87,
        total: 10505.13
      },
      {
        trade_id: 3484228,
        date: '2019-05-04T12:23:18.000Z',
        action: 'BUY',
        stockCode: 'CPG',
        quantity: 10000,
        price: 0.53,
        fees: 94.87,
        total: 10505.13
      },
      {
        trade_id: 3484228,
        date: '2019-05-05T12:23:18.000Z',
        action: 'SELL',
        stockCode: 'CPG',
        quantity: 10000,
        price: 0.53,
        fees: 94.87,
        total: 10505.13
      }
    ]);

    expect(trades[0].quantity).toBe(30000);
  });

  it('should return correct quantity on hold if trade is an incomplete trade', () => {
    const trades = transactionParser.getStockTradesFromTransactions([
      {
        trade_id: 3484228,
        date: '2019-05-02T12:23:18.000Z',
        action: 'SELL',
        stockCode: 'CPG',
        quantity: 10000,
        price: 0.53,
        fees: 94.87,
        total: 10505.13
      },
      {
        trade_id: 3297483,
        date: '2019-03-28T03:57:30.000Z',
        action: 'BUY',
        stockCode: 'CPG',
        quantity: 20000,
        price: 0.53,
        fees: 31.27,
        total: 10631.27
      },
      {
        trade_id: 3484228,
        date: '2019-05-03T12:23:18.000Z',
        action: 'SELL',
        stockCode: 'CPG',
        quantity: 5000,
        price: 0.53,
        fees: 94.87,
        total: 10505.13
      },
      {
        trade_id: 3484228,
        date: '2019-05-04T12:23:18.000Z',
        action: 'BUY',
        stockCode: 'CPG',
        quantity: 10000,
        price: 0.53,
        fees: 94.87,
        total: 10505.13
      },
      {
        trade_id: 3484228,
        date: '2019-05-05T12:23:18.000Z',
        action: 'SELL',
        stockCode: 'CPG',
        quantity: 10000,
        price: 0.53,
        fees: 94.87,
        total: 10505.13
      },
      {
        trade_id: 3484228,
        date: '2019-05-06T12:23:18.000Z',
        action: 'SELL',
        stockCode: 'CPG',
        quantity: 2500,
        price: 0.53,
        fees: 94.87,
        total: 10505.13
      }
    ]);

    expect(trades[0].quantityOnHold).toBe(2500);
  });

  it('should return correct trade quantity/shares if trade has multiple transactions', () => {
    const trades = transactionParser.getStockTradesFromTransactions([
      {
        trade_id: 3484228,
        date: '2019-05-02T12:23:18.000Z',
        action: 'SELL',
        stockCode: 'CPG',
        quantity: 10000,
        price: 0.53,
        fees: 94.87,
        total: 10505.13
      },
      {
        trade_id: 3297483,
        date: '2019-03-28T03:57:30.000Z',
        action: 'BUY',
        stockCode: 'CPG',
        quantity: 20000,
        price: 0.53,
        fees: 31.27,
        total: 10631.27
      },
      {
        trade_id: 3484228,
        date: '2019-05-03T12:23:18.000Z',
        action: 'SELL',
        stockCode: 'CPG',
        quantity: 5000,
        price: 0.53,
        fees: 94.87,
        total: 10505.13
      },
      {
        trade_id: 3484228,
        date: '2019-05-04T12:23:18.000Z',
        action: 'BUY',
        stockCode: 'CPG',
        quantity: 10000,
        price: 0.53,
        fees: 94.87,
        total: 10505.13
      },
      {
        trade_id: 3484228,
        date: '2019-05-05T12:23:18.000Z',
        action: 'SELL',
        stockCode: 'CPG',
        quantity: 15000,
        price: 0.53,
        fees: 94.87,
        total: 10505.13
      }
    ]);

    expect(trades[0].quantity).toBe(30000);
  });

  it('should return correct trade quantity/shares for 1 sell and 1 buy trades', () => {
    const [trade1] = transactionParser.getStockTradesFromTransactions([
      {
        trade_id: 3484228,
        date: '2019-05-02T12:23:18.000Z',
        action: 'SELL',
        stockCode: 'CPG',
        quantity: 20000,
        price: 0.53,
        fees: 94.87,
        total: 10505.13
      },
      {
        trade_id: 3297483,
        date: '2019-03-28T03:57:30.000Z',
        action: 'BUY',
        stockCode: 'CPG',
        quantity: 20000,
        price: 0.53,
        fees: 31.27,
        total: 10631.27
      }
    ]);

    expect(trade1.quantity).toBe(20000);
  });

  it('should return correct trade transactions count', () => {
    const [trade1, trade2] = transactionParser.getStockTradesFromTransactions([
      {
        trade_id: 3484228,
        date: '2019-05-02T12:23:18.000Z',
        action: 'SELL',
        stockCode: 'CPG',
        quantity: 20000,
        price: 0.53,
        fees: 94.87,
        total: 10505.13
      },
      {
        trade_id: 3297483,
        date: '2019-03-28T03:57:30.000Z',
        action: 'BUY',
        stockCode: 'CPG',
        quantity: 20000,
        price: 0.53,
        fees: 31.27,
        total: 10631.27
      },
      {
        trade_id: 3260239,
        date: '2019-03-21T02:41:15.000Z',
        action: 'SELL',
        stockCode: 'CPG',
        quantity: 20000,
        price: 0.55,
        fees: 98.45,
        total: 10901.55
      },
      {
        trade_id: 3259769,
        date: '2019-03-21T02:08:21.000Z',
        action: 'BUY',
        stockCode: 'CPG',
        quantity: 20000,
        price: 0.55,
        fees: 32.45,
        total: 11032.45
      }
    ]);

    expect(trade1.transactions.length).toBe(2);
    expect(trade2.transactions.length).toBe(2);
  });

  it('should return correct trade count if stock transactions are sold and filled from different dates.', () => {
    const trades = transactionParser.getStockTradesFromTransactions([
      {
        trade_id: 3484228,
        date: '2019-05-02T12:23:18.000Z',
        action: 'SELL',
        stockCode: 'CPG',
        quantity: 20000,
        price: 0.53,
        fees: 94.87,
        total: 10505.13
      },
      {
        trade_id: 3297483,
        date: '2019-03-28T03:57:30.000Z',
        action: 'BUY',
        stockCode: 'CPG',
        quantity: 20000,
        price: 0.53,
        fees: 31.27,
        total: 10631.27
      },
      {
        trade_id: 3260239,
        date: '2019-03-21T02:41:15.000Z',
        action: 'SELL',
        stockCode: 'CPG',
        quantity: 20000,
        price: 0.55,
        fees: 98.45,
        total: 10901.55
      },
      {
        trade_id: 3259769,
        date: '2019-03-21T02:08:21.000Z',
        action: 'BUY',
        stockCode: 'CPG',
        quantity: 20000,
        price: 0.55,
        fees: 32.45,
        total: 11032.45
      }
    ]);

    expect(trades.length).toBe(2);
  });

  it('should return correct holding period for an incomplete trade', () => {
    const [trade1, trade2] = transactionParser.getStockTradesFromTransactions([
      {
        trade_id: 3484228,
        date: '2019-04-28T03:57:30.000Z',
        action: 'SELL',
        stockCode: 'CPG',
        quantity: 10000,
        price: 0.53,
        fees: 94.87,
        total: 10505.13
      },
      {
        trade_id: 3297483,
        date: '2019-03-28T03:57:30.000Z',
        action: 'BUY',
        stockCode: 'CPG',
        quantity: 20000,
        price: 0.53,
        fees: 31.27,
        total: 10631.27
      },
      {
        trade_id: 3260239,
        date: '2019-03-21T02:41:15.000Z',
        action: 'SELL',
        stockCode: 'CPG',
        quantity: 20000,
        price: 0.55,
        fees: 98.45,
        total: 10901.55
      },
      {
        trade_id: 3259769,
        date: '2019-03-21T02:08:21.000Z',
        action: 'BUY',
        stockCode: 'CPG',
        quantity: 20000,
        price: 0.55,
        fees: 32.45,
        total: 11032.45
      }
    ]);

    expect(trade1.holdingPeriod).toBe(1);
    expect(trade2.holdingPeriod).toBe(31);
  });

  it('should return correct holding period of the trade base on transactions.', () => {
    const [trade1, trade2] = transactionParser.getStockTradesFromTransactions([
      {
        trade_id: 3484228,
        date: '2019-04-03T12:23:18.000Z',
        action: 'SELL',
        stockCode: 'CPG',
        quantity: 20000,
        price: 0.53,
        fees: 94.87,
        total: 10505.13
      },
      {
        trade_id: 3297483,
        date: '2019-03-28T03:57:30.000Z',
        action: 'BUY',
        stockCode: 'CPG',
        quantity: 20000,
        price: 0.53,
        fees: 31.27,
        total: 10631.27
      },
      {
        trade_id: 3260239,
        date: '2019-03-21T02:41:15.000Z',
        action: 'SELL',
        stockCode: 'CPG',
        quantity: 20000,
        price: 0.55,
        fees: 98.45,
        total: 10901.55
      },
      {
        trade_id: 3259769,
        date: '2019-03-21T02:08:21.000Z',
        action: 'BUY',
        stockCode: 'CPG',
        quantity: 20000,
        price: 0.55,
        fees: 32.45,
        total: 11032.45
      }
    ]);

    expect(trade1.holdingPeriod).toBe(1);
    expect(trade2.holdingPeriod).toBe(6);
  });

  it('should return correct buy and sell price from transactions', () => {
    const [trade1, trade2] = transactionParser.getStockTradesFromTransactions([
      {
        trade_id: 3484228,
        date: '2019-04-03T12:23:18.000Z',
        action: 'SELL',
        stockCode: 'CPG',
        quantity: 20000,
        price: 0.53,
        fees: 94.87,
        total: 10505.13
      },
      {
        trade_id: 3297483,
        date: '2019-03-28T03:57:30.000Z',
        action: 'BUY',
        stockCode: 'CPG',
        quantity: 20000,
        price: 0.53,
        fees: 31.27,
        total: 10631.27
      },
      {
        trade_id: 3260239,
        date: '2019-03-21T02:47:15.000Z',
        action: 'SELL',
        stockCode: 'CPG',
        quantity: 10000,
        price: 0.7,
        fees: 98.45,
        total: 10901.55
      },
      {
        trade_id: 3260239,
        date: '2019-03-21T02:41:15.000Z',
        action: 'SELL',
        stockCode: 'CPG',
        quantity: 10000,
        price: 0.55,
        fees: 98.45,
        total: 10901.55
      },
      {
        trade_id: 3259769,
        date: '2019-03-21T02:08:21.000Z',
        action: 'BUY',
        stockCode: 'CPG',
        quantity: 20000,
        price: 0.55,
        fees: 32.45,
        total: 11032.45
      }
    ]);

    expect(trade1.averageBuyPrice).toBe(0.55);
    expect(trade1.averageSellPrice).toBe(0.625);
    expect(trade2.averageBuyPrice).toBe(0.53);
    expect(trade2.averageSellPrice).toBe(0.53);
  });

  it('should return correct gains or losses', async () => {
    const transactions = await transactionParser.getTransactions();
    const trade = transactionParser
      .getTradesFromTransactions(transactions)
      .find(x => x.stockCode === 'AGI');
    expect(trade.grainsOrLosses).toBe(-338.64);
  });

  it('should return correct holding period from date bought to date when trade is not yet sold', async done => {
    const transactions = await transactionParser.getTransactions();
    const diffDates = (date1, date2) => {
      dt1 = new Date(date1);
      dt2 = new Date(date2);
      return Math.floor(
        (Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) -
          Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) /
          (1000 * 60 * 60 * 24)
      );
    };
    const incompleteTrade = transactionParser
      .getTradesFromTransactions(transactions)
      .find(x => x.stockCode === 'RLC');

    expect(incompleteTrade.holdingPeriod).toBe(
      diffDates(incompleteTrade.dateBought, new Date())
    );
    done();
  });

  it('should determine whether trade is a loss or win', () => {
    const [trade1, trade2] = transactionParser.getStockTradesFromTransactions([
      {
        trade_id: 3484228,
        date: '2019-04-28T03:57:30.000Z',
        action: 'SELL',
        stockCode: 'CPG',
        quantity: 20000,
        price: 0.53,
        fees: 94.87,
        total: 10505.13
      },
      {
        trade_id: 3297483,
        date: '2019-03-28T03:57:30.000Z',
        action: 'BUY',
        stockCode: 'CPG',
        quantity: 20000,
        price: 0.53,
        fees: 31.27,
        total: 10631.27
      },
      {
        trade_id: 3260239,
        date: '2019-03-21T02:41:15.000Z',
        action: 'SELL',
        stockCode: 'CPG',
        quantity: 20000,
        price: 0.55,
        fees: 98.45,
        total: 10901.55
      },
      {
        trade_id: 3259769,
        date: '2019-03-21T02:08:21.000Z',
        action: 'BUY',
        stockCode: 'CPG',
        quantity: 20000,
        price: 0.55,
        fees: 32.45,
        total: 11032.45
      }
    ]);

    expect(trade1.isWin).toBe(false);
    expect(trade1.isLoss).toBe(true);
    expect(trade2.isWin).toBe(false);
    expect(trade2.isLoss).toBe(true);
  });

  it('should return average sell price for tranched trades', () => {
    const trades = transactionParser.getStockTradesFromTransactions([
      {
        trade_id: 3484228,
        date: '2019-05-02T12:23:18.000Z',
        action: 'SELL',
        stockCode: 'CPG',
        quantity: 10000,
        price: 0.58,
        fees: 94.87,
        total: 10505.13
      },
      {
        trade_id: 3297483,
        date: '2019-03-28T03:57:30.000Z',
        action: 'BUY',
        stockCode: 'CPG',
        quantity: 20000,
        price: 0.53,
        fees: 31.27,
        total: 10631.27
      },
      {
        trade_id: 3484228,
        date: '2019-05-03T12:23:18.000Z',
        action: 'SELL',
        stockCode: 'CPG',
        quantity: 5000,
        price: 0.53,
        fees: 94.87,
        total: 10505.13
      },
      {
        trade_id: 3484228,
        date: '2019-05-04T12:23:18.000Z',
        action: 'BUY',
        stockCode: 'CPG',
        quantity: 10000,
        price: 0.53,
        fees: 94.87,
        total: 10505.13
      },
      {
        trade_id: 3484228,
        date: '2019-05-05T12:23:18.000Z',
        action: 'SELL',
        stockCode: 'CPG',
        quantity: 15000,
        price: 0.53,
        fees: 94.87,
        total: 10505.13
      }
    ]);
    expect(trades[0].averageSellPrice).toBe(0.5467);
  });
});
