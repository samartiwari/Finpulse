import { BinanceApiError, fetchLastPrice } from '@/services/binance';
import { submitOrder, type SubmitOrderRequest } from '@/services/orderApi';

jest.mock('@/services/binance', () => ({
  ...jest.requireActual('@/services/binance'),
  fetchLastPrice: jest.fn(),
}));

const mockFetchLastPrice = jest.mocked(fetchLastPrice);

// The gateway remembers every order id for the session, so each test uses its own.
const request = (clientOrderId: string, overrides: Partial<SubmitOrderRequest> = {}): SubmitOrderRequest => ({
  clientOrderId,
  symbol: 'BTCUSDT',
  side: 'BUY',
  quantity: 0.1,
  protectionPrice: 51_000,
  ...overrides,
});

beforeEach(() => mockFetchLastPrice.mockReset());

it('fills at the market price when it is inside the protection limit', async () => {
  mockFetchLastPrice.mockResolvedValue(50_500);

  await expect(submitOrder(request('fill'))).resolves.toMatchObject({ status: 'FILLED', executedPrice: 50_500 });
});

it('rejects a buy above its protection price and a sell below it', async () => {
  mockFetchLastPrice.mockResolvedValueOnce(51_001).mockResolvedValueOnce(48_999);

  await expect(submitOrder(request('buy-high'))).resolves.toMatchObject({ status: 'REJECTED' });
  await expect(submitOrder(request('sell-low', { side: 'SELL', protectionPrice: 49_000 }))).resolves.toMatchObject({
    status: 'REJECTED',
  });
});

it('returns the original result when the same order id is submitted again', async () => {
  mockFetchLastPrice.mockResolvedValueOnce(50_000).mockResolvedValueOnce(50_900);

  const first = await submitOrder(request('retry'));
  const replay = await submitOrder(request('retry'));

  expect(replay).toEqual(first);
  expect(mockFetchLastPrice).toHaveBeenCalledTimes(1);
});

it('rejects unknown pairs but lets network failures propagate so the queue retries', async () => {
  mockFetchLastPrice.mockRejectedValueOnce(new BinanceApiError('Invalid symbol.', 400, -1121));
  await expect(submitOrder(request('unknown', { symbol: 'NOPEUSDT' }))).resolves.toMatchObject({
    status: 'REJECTED',
  });

  mockFetchLastPrice.mockRejectedValueOnce(new TypeError('Network request failed'));
  await expect(submitOrder(request('offline'))).rejects.toThrow('Network request failed');
});
