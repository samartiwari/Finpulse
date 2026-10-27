import {
  applyFill,
  canCover,
  getProtectionPrice,
  holdPrices,
  MARKET_PROTECTION,
  projectLedger,
  type Ledger,
  type Order,
  type OrderSide,
} from '@/store/orderLedger';

const order = (id: string, side: OrderSide, quantity: number, price: number): Order => ({
  id,
  symbol: 'BTCUSDT',
  side,
  quantity,
  requestedPrice: price,
  protectionPrice: getProtectionPrice(side, price),
  executedPrice: null,
  status: 'PENDING_SYNC',
  rejectionReason: null,
  placedOffline: true,
  attempts: 0,
  createdAt: 0,
  updatedAt: 0,
});

const cashOnly = (cashBalance: number): Ledger => ({ cashBalance, positions: {} });

const holding = (cashBalance: number, quantity: number, costBasis: number): Ledger => ({
  cashBalance,
  positions: { BTCUSDT: { symbol: 'BTCUSDT', quantity, costBasis } },
});

describe('getProtectionPrice', () => {
  it('caps buys above and floors sells below the reference price', () => {
    expect(getProtectionPrice('BUY', 100)).toBe(102);
    expect(getProtectionPrice('SELL', 100)).toBe(98);
  });
});

describe('projectLedger', () => {
  it('holds cash for a buy at its protection price but records cost at the requested price', () => {
    const projected = projectLedger(cashOnly(10_000), [order('buy', 'BUY', 0.1, 50_000)]);

    expect(projected.cashBalance).toBe(10_000 - 0.1 * 50_000 * (1 + MARKET_PROTECTION));
    expect(projected.positions.BTCUSDT).toEqual({ symbol: 'BTCUSDT', quantity: 0.1, costBasis: 5_000 });
  });

  it('skips an order it can no longer cover instead of going negative', () => {
    const settled = holding(0, 1, 100);

    expect(projectLedger(settled, [order('sell', 'SELL', 2, 100)])).toEqual(settled);
  });

  it('rolls back a rejected order by replaying the rest, keeping average cost right', () => {
    const settled = holding(100_000, 10, 1_000);
    const buy = order('buy', 'BUY', 10, 200);
    const sell = order('sell', 'SELL', 5, 100);

    // With the buy pending, the sell takes cost out at the blended average of 150,
    // so subtracting the buy's own cost afterwards would leave 250, not the true 500.
    expect(projectLedger(settled, [buy, sell]).positions.BTCUSDT.costBasis).toBe(2_250);
    expect(projectLedger(settled, [sell]).positions.BTCUSDT).toEqual({
      symbol: 'BTCUSDT',
      quantity: 5,
      costBasis: 500,
    });
  });
});

describe('applyFill', () => {
  it('settles a buy at the fill price, releasing the rest of the hold', () => {
    const settled = applyFill(cashOnly(10_000), order('buy', 'BUY', 0.1, 50_000), { cash: 50_100, cost: 50_100 });

    expect(settled.cashBalance).toBe(4_990);
    expect(settled.positions.BTCUSDT).toEqual({ symbol: 'BTCUSDT', quantity: 0.1, costBasis: 5_010 });
  });

  it('removes a fully sold position together with its cost basis', () => {
    const settled = applyFill(holding(100_000, 10, 1_000), order('sell', 'SELL', 10, 120), { cash: 120, cost: 120 });

    expect(settled).toEqual(cashOnly(101_200));
  });

  it('closes a position out cleanly despite floating-point dust', () => {
    const fill = { cash: 10, cost: 10 };
    let ledger = cashOnly(1_000);
    ledger = applyFill(ledger, order('a', 'BUY', 0.1, 10), fill);
    ledger = applyFill(ledger, order('b', 'BUY', 0.2, 10), fill);
    ledger = applyFill(ledger, order('c', 'SELL', 0.3, 10), fill);

    expect(ledger).toEqual(cashOnly(1_000));
  });
});

describe('canCover', () => {
  it('accepts a buy that uses exactly the available cash and rejects anything more', () => {
    const exact = order('exact', 'BUY', 1, 100);
    const over = order('over', 'BUY', 1.01, 100);

    expect(canCover(cashOnly(102), exact, holdPrices(exact))).toBe(true);
    expect(canCover(cashOnly(102), over, holdPrices(over))).toBe(false);
  });

  it('rejects selling more than is held', () => {
    const sell = order('sell', 'SELL', 2, 100);

    expect(canCover(holding(0, 1, 100), sell, holdPrices(sell))).toBe(false);
  });
});
