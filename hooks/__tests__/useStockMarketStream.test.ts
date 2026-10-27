import { act, renderHook } from '@testing-library/react-native';
import {
  buildStreamUrl,
  normalizeSymbols,
  parseTickerMessage,
  useMarketTickerStream,
  useStockMarketStream,
} from '@/hooks/useStockMarketStream';

class FakeWebSocket {
  static instances: FakeWebSocket[] = [];

  onopen: (() => void) | null = null;
  onmessage: ((event: { data: unknown }) => void) | null = null;
  onerror: ((event: unknown) => void) | null = null;
  onclose: (() => void) | null = null;
  closed = false;

  constructor(readonly url: string) {
    FakeWebSocket.instances.push(this);
  }

  close() {
    this.closed = true;
  }
}

const tickerFrame = (symbol: string, price: number, eventTime = 1) =>
  JSON.stringify({ e: '24hrTicker', E: eventTime, s: symbol, p: '10', P: '1.5', c: String(price), h: '0', l: '0', v: '0', q: '0' });

const latestSocket = () => FakeWebSocket.instances[FakeWebSocket.instances.length - 1];

const RealWebSocket = global.WebSocket;

beforeEach(() => {
  jest.useFakeTimers();
  FakeWebSocket.instances = [];
  global.WebSocket = FakeWebSocket as unknown as typeof WebSocket;
});

afterEach(() => {
  global.WebSocket = RealWebSocket;
  jest.useRealTimers();
});

describe('stream helpers', () => {
  it('normalizes symbols into a sorted, de-duplicated, lower-case set', () => {
    expect(normalizeSymbols([' ETHUSDT', 'btcusdt', 'BTCUSDT', ''])).toEqual(['btcusdt', 'ethusdt']);
  });

  it('uses the raw endpoint for one symbol and the combined endpoint for several', () => {
    expect(buildStreamUrl(['btcusdt'])).toBe('wss://stream.binance.com:9443/ws/btcusdt@ticker');
    expect(buildStreamUrl(['btcusdt', 'ethusdt'])).toBe(
      'wss://stream.binance.com:9443/stream?streams=btcusdt@ticker/ethusdt@ticker',
    );
  });

  it('parses raw and combined ticker frames and ignores anything else', () => {
    const raw = tickerFrame('BTCUSDT', 50_000, 42);

    expect(parseTickerMessage(raw)).toMatchObject({ symbol: 'BTCUSDT', lastPrice: 50_000, priceChangePercent: 1.5, eventTime: 42 });
    expect(parseTickerMessage(JSON.stringify({ stream: 'btcusdt@ticker', data: JSON.parse(raw) }))).toMatchObject({
      symbol: 'BTCUSDT',
    });
    expect(parseTickerMessage(JSON.stringify({ result: null, id: 1 }))).toBeNull();
    expect(parseTickerMessage('not json')).toBeNull();
    expect(parseTickerMessage(new ArrayBuffer(8))).toBeNull();
  });
});

describe('useStockMarketStream', () => {
  it('batches a burst of ticks into one render on the next frame', () => {
    let renders = 0;
    const { result } = renderHook(() => {
      renders += 1;
      return useStockMarketStream('BTCUSDT');
    });
    act(() => latestSocket().onopen?.());
    expect(result.current.isConnected).toBe(true);

    const rendersBeforeBurst = renders;
    act(() => {
      for (let i = 1; i <= 100; i += 1) latestSocket().onmessage?.({ data: tickerFrame('BTCUSDT', 50_000 + i, i) });
    });
    // Buffered in a ref: nothing has rendered yet.
    expect(renders).toBe(rendersBeforeBurst);

    act(() => jest.advanceTimersByTime(16));
    expect(renders).toBe(rendersBeforeBurst + 1);
    expect(result.current.price).toBe(50_100);
  });

  it('reconnects with backoff after the socket closes', () => {
    const { result } = renderHook(() => useStockMarketStream('BTCUSDT'));
    act(() => latestSocket().onopen?.());

    act(() => latestSocket().onclose?.());
    expect(result.current.status).toBe('reconnecting');
    expect(FakeWebSocket.instances).toHaveLength(1);

    // The first retry waits between 0.5 s and 1 s.
    act(() => jest.advanceTimersByTime(1_000));
    expect(FakeWebSocket.instances).toHaveLength(2);
  });

  it('treats 15 s of silence as a dead socket and reconnects', () => {
    renderHook(() => useStockMarketStream('BTCUSDT'));
    const first = latestSocket();
    act(() => first.onopen?.());

    act(() => jest.advanceTimersByTime(15_000));
    expect(first.closed).toBe(true);

    act(() => jest.advanceTimersByTime(1_000));
    expect(FakeWebSocket.instances).toHaveLength(2);
  });

  it('closes the socket on unmount and stays closed', () => {
    const { unmount } = renderHook(() => useStockMarketStream('BTCUSDT'));

    unmount();
    act(() => jest.advanceTimersByTime(60_000));

    expect(FakeWebSocket.instances).toHaveLength(1);
    expect(latestSocket().closed).toBe(true);
  });
});

describe('useMarketTickerStream', () => {
  it('keeps one socket when the same symbols are passed in a different order', () => {
    const { rerender } = renderHook(({ symbols }: { symbols: string[] }) => useMarketTickerStream(symbols), {
      initialProps: { symbols: ['ETHUSDT', 'BTCUSDT'] },
    });

    rerender({ symbols: ['BTCUSDT', 'ETHUSDT'] });

    expect(FakeWebSocket.instances).toHaveLength(1);
    expect(latestSocket().url).toBe('wss://stream.binance.com:9443/stream?streams=btcusdt@ticker/ethusdt@ticker');
  });

  it('opens a new socket when the symbol set changes', () => {
    const { rerender } = renderHook(({ symbols }: { symbols: string[] }) => useMarketTickerStream(symbols), {
      initialProps: { symbols: ['BTCUSDT'] },
    });
    const first = latestSocket();

    rerender({ symbols: ['BTCUSDT', 'SOLUSDT'] });

    expect(first.closed).toBe(true);
    expect(FakeWebSocket.instances).toHaveLength(2);
  });
});
