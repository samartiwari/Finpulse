import { submitOrder } from '@/services/orderApi';
import type { Order, OrderSide } from '@/store/orderLedger';
import { useOrderStore } from '@/store/useOrderStore';

jest.mock('@/services/orderApi', () => ({ submitOrder: jest.fn() }));
jest.mock('@/utils/toast', () => ({
  showErrorToast: jest.fn(),
  showInfoToast: jest.fn(),
  showSuccessToast: jest.fn(),
}));

const mockSubmitOrder = jest.mocked(submitOrder);

const startingLedger = () => ({ cashBalance: 10_000, positions: {} });

beforeEach(() => {
  mockSubmitOrder.mockReset();
  useOrderStore.setState({
    settled: startingLedger(),
    optimistic: startingLedger(),
    orders: [],
    queue: [],
    isOnline: false,
    isSyncing: false,
  });
});

function place(side: OrderSide, quantity: number, price: number): Order {
  const result = useOrderStore.getState().placeOrder({ symbol: 'BTCUSDT', side, quantity, price });
  if (!result.ok) throw new Error(result.reason);
  return result.order;
}

async function goOnlineAndDrain() {
  useOrderStore.getState().setOnline(true);
  await useOrderStore.getState().processQueue();
}

const findOrder = (id: string) => useOrderStore.getState().orders.find((order) => order.id === id);

it('applies offline orders optimistically and queues them without submitting', () => {
  const buy = place('BUY', 0.1, 50_000);
  const state = useOrderStore.getState();

  expect(buy).toMatchObject({ status: 'PENDING_SYNC', placedOffline: true });
  expect(state.queue).toEqual([buy.id]);
  // 0.1 BTC held at the 2% protection price of 51,000.
  expect(state.optimistic.cashBalance).toBe(4_900);
  expect(state.optimistic.positions.BTCUSDT.quantity).toBe(0.1);
  expect(state.settled).toEqual(startingLedger());
  expect(mockSubmitOrder).not.toHaveBeenCalled();
});

it('refuses an order the optimistic balance cannot cover', () => {
  const result = useOrderStore.getState().placeOrder({ symbol: 'BTCUSDT', side: 'BUY', quantity: 1, price: 10_000 });

  expect(result).toEqual({ ok: false, reason: expect.stringContaining('Insufficient funds') });
  expect(useOrderStore.getState().orders).toHaveLength(0);
});

it('submits queued orders first-in first-out once online and settles at the fill price', async () => {
  mockSubmitOrder.mockImplementation(async ({ side }) => ({
    status: 'FILLED',
    executedPrice: side === 'BUY' ? 50_100 : 50_200,
    executedAt: 0,
  }));
  const buy = place('BUY', 0.1, 50_000);
  const sell = place('SELL', 0.04, 50_000);

  await goOnlineAndDrain();

  expect(mockSubmitOrder.mock.calls.map(([request]) => request.clientOrderId)).toEqual([buy.id, sell.id]);
  expect(findOrder(buy.id)).toMatchObject({ status: 'EXECUTED', executedPrice: 50_100 });
  expect(findOrder(sell.id)).toMatchObject({ status: 'EXECUTED', executedPrice: 50_200 });

  const { settled, optimistic, queue } = useOrderStore.getState();
  expect(queue).toEqual([]);
  expect(settled.cashBalance).toBeCloseTo(10_000 - 0.1 * 50_100 + 0.04 * 50_200, 8);
  expect(settled.positions.BTCUSDT.quantity).toBeCloseTo(0.06, 8);
  expect(optimistic).toEqual(settled);
});

it('releases the optimistic hold when the broker rejects an order', async () => {
  mockSubmitOrder.mockResolvedValue({ status: 'REJECTED', reason: 'Price moved past your protection limit' });
  const buy = place('BUY', 0.1, 50_000);

  await goOnlineAndDrain();

  expect(findOrder(buy.id)).toMatchObject({
    status: 'REJECTED',
    rejectionReason: 'Price moved past your protection limit',
  });
  expect(useOrderStore.getState().optimistic).toEqual(startingLedger());
  expect(useOrderStore.getState().settled).toEqual(startingLedger());
});

it('rejects a queued sell when the buy it depended on was rejected', async () => {
  mockSubmitOrder.mockResolvedValueOnce({ status: 'REJECTED', reason: 'Price moved' });
  const buy = place('BUY', 0.1, 50_000);
  // Only coverable because of the pending buy.
  const sell = place('SELL', 0.1, 50_000);

  await goOnlineAndDrain();

  expect(mockSubmitOrder).toHaveBeenCalledTimes(1);
  expect(findOrder(buy.id)?.status).toBe('REJECTED');
  expect(findOrder(sell.id)).toMatchObject({ status: 'REJECTED', rejectionReason: 'Insufficient holdings' });
  expect(useOrderStore.getState().optimistic).toEqual(startingLedger());
});

it('keeps a failed order at the head of the queue so later orders cannot jump it', async () => {
  jest.useFakeTimers();
  try {
    mockSubmitOrder.mockRejectedValue(new TypeError('Network request failed'));
    const first = place('BUY', 0.01, 50_000);
    const second = place('BUY', 0.01, 50_000);

    await goOnlineAndDrain();

    expect(mockSubmitOrder).toHaveBeenCalledTimes(1);
    expect(useOrderStore.getState().queue).toEqual([first.id, second.id]);
    expect(findOrder(first.id)).toMatchObject({ status: 'PENDING_SYNC', attempts: 1 });
    expect(findOrder(second.id)).toMatchObject({ status: 'PENDING_SYNC', attempts: 0 });
  } finally {
    jest.clearAllTimers();
    jest.useRealTimers();
  }
});

it('puts an order that was in flight back to pending when the app restarts', () => {
  const merge = useOrderStore.persist.getOptions().merge!;
  const inFlight: Order = { ...place('BUY', 0.1, 50_000), status: 'SYNCING' };

  const restored = merge({ settled: startingLedger(), orders: [inFlight], queue: [inFlight.id] }, useOrderStore.getState());

  expect(restored.orders[0].status).toBe('PENDING_SYNC');
  expect(restored.optimistic.cashBalance).toBe(4_900);
});
