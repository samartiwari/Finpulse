import { areWatchlistRowPropsEqual, type WatchlistRowProps } from '@/components/WatchlistRow';
import type { WatchlistRowData } from '@/hooks/useWatchlistQuotes';

const onPress = jest.fn();
const onLongPress = jest.fn();
const onToggleAlert = jest.fn();

// A fresh object every call, like the rows rebuilt on each flushed frame.
const props = (item: Partial<WatchlistRowData> = {}): WatchlistRowProps => ({
  item: {
    symbol: 'BTCUSDT',
    baseAsset: 'BTC',
    quoteAsset: 'USDT',
    alertEnabled: false,
    lastPrice: 50_000.004,
    priceChangePercent: 1.234,
    ...item,
  },
  onPress,
  onLongPress,
  onToggleAlert,
});

describe('areWatchlistRowPropsEqual', () => {
  it('skips the render for a new object with the same values', () => {
    expect(areWatchlistRowPropsEqual(props(), props())).toBe(true);
  });

  it('skips the render when the change is below display precision', () => {
    expect(areWatchlistRowPropsEqual(props(), props({ lastPrice: 50_000.001, priceChangePercent: 1.2349 }))).toBe(true);
  });

  it('re-renders when the displayed price or change moves', () => {
    expect(areWatchlistRowPropsEqual(props(), props({ lastPrice: 50_000.01 }))).toBe(false);
    expect(areWatchlistRowPropsEqual(props(), props({ priceChangePercent: 1.24 }))).toBe(false);
  });

  it('re-renders when the first quote arrives', () => {
    expect(areWatchlistRowPropsEqual(props({ lastPrice: null, priceChangePercent: null }), props())).toBe(false);
  });

  it('re-renders when the alert is toggled or a callback changes', () => {
    expect(areWatchlistRowPropsEqual(props(), props({ alertEnabled: true }))).toBe(false);
    expect(areWatchlistRowPropsEqual(props(), { ...props(), onPress: jest.fn() })).toBe(false);
  });
});
