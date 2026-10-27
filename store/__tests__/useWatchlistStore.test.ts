import { BinanceApiError, fetchLastPrice } from '@/services/binance';
import { useWatchlistStore } from '@/store/useWatchlistStore';

jest.mock('@/services/binance', () => ({
  ...jest.requireActual('@/services/binance'),
  fetchLastPrice: jest.fn(),
}));

const mockFetchLastPrice = jest.mocked(fetchLastPrice);

const symbols = () => useWatchlistStore.getState().entries.map((entry) => entry.symbol);

beforeEach(() => {
  mockFetchLastPrice.mockReset();
  useWatchlistStore.setState({
    entries: ['BTCUSDT', 'ETHUSDT', 'SOLUSDT'].map((symbol) => ({ symbol, alertEnabled: false, addedAt: 0 })),
  });
});

it('shows a new pair immediately and rolls it back if Binance does not list it', async () => {
  let rejectLookup!: (error: unknown) => void;
  mockFetchLastPrice.mockReturnValue(new Promise((_, reject) => (rejectLookup = reject)));

  const pending = useWatchlistStore.getState().addSymbol(' fakeusdt ');
  expect(symbols()).toContain('FAKEUSDT');

  rejectLookup(new BinanceApiError('Invalid symbol.', 400, -1121));
  await expect(pending).resolves.toBe('invalid');
  expect(symbols()).not.toContain('FAKEUSDT');
});

it('keeps the pair when validation fails for network reasons', async () => {
  mockFetchLastPrice.mockRejectedValue(new TypeError('Network request failed'));

  await expect(useWatchlistStore.getState().addSymbol('AVAXUSDT')).resolves.toBe('added');
  expect(symbols()).toContain('AVAXUSDT');
});

it('rejects duplicates and malformed input without a network request', async () => {
  await expect(useWatchlistStore.getState().addSymbol('btcusdt')).resolves.toBe('duplicate');
  await expect(useWatchlistStore.getState().addSymbol('BTC-USD')).resolves.toBe('invalid');
  expect(mockFetchLastPrice).not.toHaveBeenCalled();
});

it('toggles alerts, reorders and removes entries', () => {
  const { toggleAlert, reorderWatchlist, removeSymbol } = useWatchlistStore.getState();

  toggleAlert('ETHUSDT');
  reorderWatchlist(2, 0);
  removeSymbol('BTCUSDT');

  expect(useWatchlistStore.getState().entries).toEqual([
    { symbol: 'SOLUSDT', alertEnabled: false, addedAt: 0 },
    { symbol: 'ETHUSDT', alertEnabled: true, addedAt: 0 },
  ]);
});

it('ignores a reorder with an out-of-range index', () => {
  const before = useWatchlistStore.getState().entries;

  useWatchlistStore.getState().reorderWatchlist(0, 5);

  expect(useWatchlistStore.getState().entries).toBe(before);
});
