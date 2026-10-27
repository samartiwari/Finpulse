export type OrderSide = 'BUY' | 'SELL';

export type OrderStatus = 'PENDING_SYNC' | 'SYNCING' | 'EXECUTED' | 'REJECTED';

export interface Position {
  symbol: string;
  quantity: number;
  /** Total cost of the open quantity; average price is costBasis / quantity. */
  costBasis: number;
}

export interface Ledger {
  cashBalance: number;
  positions: Record<string, Position>;
}

export interface Order {
  /** Generated on device; doubles as the idempotency key when the order is submitted. */
  id: string;
  symbol: string;
  side: OrderSide;
  quantity: number;
  /** Last traded price the user saw when placing the order. */
  requestedPrice: number;
  /** Worst fill the user accepts: above requestedPrice for buys, below it for sells. */
  protectionPrice: number;
  executedPrice: number | null;
  status: OrderStatus;
  rejectionReason: string | null;
  placedOffline: boolean;
  attempts: number;
  createdAt: number;
  updatedAt: number;
}

interface FillPrices {
  /** Price that moves cash. */
  cash: number;
  /** Price recorded in the position's cost basis. */
  cost: number;
}

type FillableOrder = Pick<Order, 'symbol' | 'side' | 'quantity'>;

export const MARKET_PROTECTION = 0.02;

const PRECISION = 1e8;

export const roundAmount = (value: number): number => Math.round(value * PRECISION) / PRECISION;

export function getProtectionPrice(side: OrderSide, price: number): number {
  return roundAmount(side === 'BUY' ? price * (1 + MARKET_PROTECTION) : price * (1 - MARKET_PROTECTION));
}

/**
 * Prices used while an order is unconfirmed. Buys hold cash at their protection
 * price so a fill that slips up to the limit can never overdraw the account;
 * sells only count the proceeds they're guaranteed.
 */
export function holdPrices(order: Pick<Order, 'requestedPrice' | 'protectionPrice'>): FillPrices {
  return { cash: order.protectionPrice, cost: order.requestedPrice };
}

export function canCover(ledger: Ledger, order: FillableOrder, prices: FillPrices): boolean {
  if (order.side === 'BUY') {
    return roundAmount(order.quantity * prices.cash) <= ledger.cashBalance;
  }
  const held = ledger.positions[order.symbol]?.quantity ?? 0;
  return roundAmount(order.quantity) <= held;
}

/** Applies a fill using average-cost accounting. Does not check affordability; see canCover. */
export function applyFill(ledger: Ledger, order: FillableOrder, prices: FillPrices): Ledger {
  const current = ledger.positions[order.symbol] ?? { symbol: order.symbol, quantity: 0, costBasis: 0 };

  let cashBalance: number;
  let quantity: number;
  let costBasis: number;
  if (order.side === 'BUY') {
    cashBalance = ledger.cashBalance - order.quantity * prices.cash;
    quantity = current.quantity + order.quantity;
    costBasis = current.costBasis + order.quantity * prices.cost;
  } else {
    const averageCost = current.quantity > 0 ? current.costBasis / current.quantity : 0;
    cashBalance = ledger.cashBalance + order.quantity * prices.cash;
    quantity = current.quantity - order.quantity;
    costBasis = current.costBasis - order.quantity * averageCost;
  }

  const positions = { ...ledger.positions };
  quantity = roundAmount(quantity);
  if (quantity <= 0) {
    delete positions[order.symbol];
  } else {
    positions[order.symbol] = { symbol: order.symbol, quantity, costBasis: roundAmount(costBasis) };
  }

  return { cashBalance: roundAmount(cashBalance), positions };
}

/**
 * The balances the user sees: broker-confirmed state with every queued order
 * replayed on top, oldest first. Keeping confirmed state separate means a
 * rejection is just "drop it from the queue and replay", with no hand-written
 * inverse to get wrong. An order the replay can't cover (because an earlier one
 * was rejected) is left out and gets rejected when the queue reaches it.
 */
export function projectLedger(settled: Ledger, pending: readonly Order[]): Ledger {
  return pending.reduce((ledger, order) => {
    const prices = holdPrices(order);
    return canCover(ledger, order, prices) ? applyFill(ledger, order, prices) : ledger;
  }, settled);
}
