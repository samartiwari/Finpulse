import { fetchLastPrice, isInvalidSymbolError } from '@/services/binance';
import type { OrderSide } from '@/store/orderLedger';
import { formatAssetPrice } from '@/utils/formatters';

const REQUEST_TIMEOUT_MS = 10_000;

export interface SubmitOrderRequest {
  /** The broker treats repeats of the same id as the same order. */
  clientOrderId: string;
  symbol: string;
  side: OrderSide;
  quantity: number;
  protectionPrice: number;
}

export type OrderExecution =
  | { status: 'FILLED'; executedPrice: number; executedAt: number }
  | { status: 'REJECTED'; reason: string };

/*
 * Stand-in for a broker's order gateway. It fills market orders at Binance's
 * current price, enforces the protection price, and is idempotent per
 * clientOrderId the way a real gateway is, so a retry after a dropped response
 * never fills twice. A real backend would persist this map; here it lives for
 * the app session.
 *
 * Transport failures throw so the caller can retry. Business outcomes are returned.
 */
const executions = new Map<string, OrderExecution>();

async function fetchMarketPrice(symbol: string): Promise<number> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetchLastPrice(symbol, controller.signal);
  } finally {
    clearTimeout(timeout);
  }
}

export async function submitOrder(request: SubmitOrderRequest): Promise<OrderExecution> {
  const previous = executions.get(request.clientOrderId);
  if (previous) return previous;

  let marketPrice: number;
  try {
    marketPrice = await fetchMarketPrice(request.symbol);
  } catch (error) {
    if (!isInvalidSymbolError(error)) throw error;
    const rejection: OrderExecution = { status: 'REJECTED', reason: `${request.symbol} is not tradable` };
    executions.set(request.clientOrderId, rejection);
    return rejection;
  }

  const breached =
    request.side === 'BUY' ? marketPrice > request.protectionPrice : marketPrice < request.protectionPrice;

  const execution: OrderExecution = breached
    ? {
        status: 'REJECTED',
        reason: `Price moved past your protection limit of ${formatAssetPrice(request.protectionPrice)}`,
      }
    : { status: 'FILLED', executedPrice: marketPrice, executedAt: Date.now() };

  executions.set(request.clientOrderId, execution);
  return execution;
}
