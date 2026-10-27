import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import type { MarketTick, StreamStatus, TickMap } from '@/types/market';

const BINANCE_STREAM_BASE_URL = 'wss://stream.binance.com:9443';

const RECONNECT_BASE_DELAY_MS = 1_000;
const RECONNECT_MAX_DELAY_MS = 30_000;
// @ticker pushes about once a second per symbol, so this much silence means the
// socket is half-open even if the OS hasn't reported it closed yet.
const STALE_STREAM_TIMEOUT_MS = 15_000;

interface BinanceTickerEvent {
  e: '24hrTicker';
  E: number;
  s: string;
  p: string;
  P: string;
  c: string;
  h: string;
  l: string;
  v: string;
  q: string;
}

export interface MarketStreamOptions {
  /** Set to false to keep the socket closed, e.g. while the screen is blurred. */
  enabled?: boolean;
}

export interface MarketStreamConnection {
  status: StreamStatus;
  isConnecting: boolean;
  isConnected: boolean;
  error: string | null;
  /** Tears the socket down and reconnects now, skipping any pending backoff. */
  reconnect: () => void;
}

export interface MarketTickerStream extends MarketStreamConnection {
  ticks: TickMap;
}

export interface StockMarketStream extends MarketStreamConnection {
  tick: MarketTick | null;
  price: number | null;
  priceChangePercent: number | null;
}

export function normalizeSymbols(symbols: readonly string[]): string[] {
  const unique = new Set(symbols.map((symbol) => symbol.trim().toLowerCase()).filter(Boolean));
  return Array.from(unique).sort();
}

export function buildStreamUrl(streams: readonly string[]): string {
  if (streams.length === 1) {
    return `${BINANCE_STREAM_BASE_URL}/ws/${streams[0]}@ticker`;
  }
  const streamNames = streams.map((symbol) => `${symbol}@ticker`).join('/');
  return `${BINANCE_STREAM_BASE_URL}/stream?streams=${streamNames}`;
}

function isTickerEvent(value: unknown): value is BinanceTickerEvent {
  return typeof value === 'object' && value !== null && (value as { e?: unknown }).e === '24hrTicker';
}

export function parseTickerMessage(raw: unknown): MarketTick | null {
  if (typeof raw !== 'string') return null;

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return null;
  }

  // Combined streams wrap every event as { stream, data }; single streams don't.
  const event =
    typeof payload === 'object' && payload !== null && 'data' in payload
      ? (payload as { data: unknown }).data
      : payload;
  if (!isTickerEvent(event)) return null;

  const lastPrice = Number(event.c);
  if (!Number.isFinite(lastPrice)) return null;

  return {
    symbol: event.s,
    lastPrice,
    priceChange: Number(event.p),
    priceChangePercent: Number(event.P),
    highPrice: Number(event.h),
    lowPrice: Number(event.l),
    volume: Number(event.v),
    quoteVolume: Number(event.q),
    eventTime: event.E,
  };
}

function pickTicks(ticks: TickMap, symbols: ReadonlySet<string>): TickMap {
  const kept: TickMap = {};
  for (const symbol of Object.keys(ticks)) {
    if (symbols.has(symbol)) kept[symbol] = ticks[symbol];
  }
  return Object.keys(kept).length === Object.keys(ticks).length ? ticks : kept;
}

/**
 * Streams 24h ticker updates for any number of symbols over a single socket.
 *
 * Incoming ticks are written to a ref and only flushed into React state once per
 * animation frame, so a burst of messages costs one render, not one per message.
 */
export function useMarketTickerStream(
  symbols: readonly string[],
  { enabled = true }: MarketStreamOptions = {},
): MarketTickerStream {
  // Key on the sorted set so reordering or re-creating the array doesn't reconnect.
  const streamKey = normalizeSymbols(symbols).join('/');

  const [ticks, setTicks] = useState<TickMap>({});
  const [status, setStatus] = useState<StreamStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [connectionNonce, setConnectionNonce] = useState(0);

  const pendingTicksRef = useRef<TickMap>({});
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || streamKey === '') {
      setStatus('idle');
      return;
    }

    const streams = streamKey.split('/');
    const tracked = new Set(streams.map((stream) => stream.toUpperCase()));
    setTicks((prev) => pickTicks(prev, tracked));

    let socket: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
    let staleTimer: ReturnType<typeof setTimeout> | undefined;
    let attempt = 0;
    let disposed = false;
    let suspended = false;

    const flushTicks = () => {
      frameRef.current = null;
      const batch = pendingTicksRef.current;
      pendingTicksRef.current = {};
      setTicks((prev) => ({ ...prev, ...batch }));
    };

    const enqueueTick = (tick: MarketTick) => {
      // Latest tick per symbol wins; intermediate ticks within a frame are never rendered.
      pendingTicksRef.current[tick.symbol] = tick;
      if (frameRef.current === null) {
        frameRef.current = requestAnimationFrame(flushTicks);
      }
    };

    const closeSocket = () => {
      clearTimeout(reconnectTimer);
      clearTimeout(staleTimer);
      if (!socket) return;
      socket.onopen = null;
      socket.onmessage = null;
      socket.onerror = null;
      socket.onclose = null;
      socket.close();
      socket = null;
    };

    const scheduleReconnect = () => {
      closeSocket();
      if (disposed || suspended) return;
      // Equal jitter: spread reconnects out after an exchange-wide drop without ever retrying instantly.
      const ceiling = Math.min(RECONNECT_MAX_DELAY_MS, RECONNECT_BASE_DELAY_MS * 2 ** attempt);
      const delay = ceiling / 2 + Math.random() * (ceiling / 2);
      attempt += 1;
      setStatus('reconnecting');
      reconnectTimer = setTimeout(connect, delay);
    };

    const armStaleTimer = () => {
      clearTimeout(staleTimer);
      staleTimer = setTimeout(() => {
        setError('Market stream stopped responding');
        scheduleReconnect();
      }, STALE_STREAM_TIMEOUT_MS);
    };

    function connect() {
      closeSocket();
      setStatus(attempt === 0 ? 'connecting' : 'reconnecting');

      const ws = new WebSocket(buildStreamUrl(streams));
      socket = ws;

      ws.onopen = () => {
        attempt = 0;
        setStatus('open');
        setError(null);
        armStaleTimer();
      };
      ws.onmessage = (event) => {
        armStaleTimer();
        const tick = parseTickerMessage(event.data);
        if (tick) enqueueTick(tick);
      };
      ws.onerror = (event) => {
        // React Native puts the native failure reason on `message`; browsers don't.
        const message = (event as Event & { message?: string }).message;
        setError(message || 'Market stream connection error');
      };
      ws.onclose = scheduleReconnect;
    }

    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (nextState === 'active' && suspended) {
        suspended = false;
        attempt = 0;
        connect();
      } else if (nextState === 'background') {
        // JS is frozen in the background; close cleanly rather than wake up to a dead socket.
        suspended = true;
        closeSocket();
        setStatus('idle');
      }
    };
    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

    connect();

    return () => {
      disposed = true;
      appStateSubscription.remove();
      closeSocket();
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      pendingTicksRef.current = {};
    };
  }, [streamKey, enabled, connectionNonce]);

  const reconnect = useCallback(() => setConnectionNonce((nonce) => nonce + 1), []);

  return {
    ticks,
    status,
    isConnecting: status === 'connecting' || status === 'reconnecting',
    isConnected: status === 'open',
    error,
    reconnect,
  };
}

/** Live price for a single Binance pair, e.g. `useStockMarketStream('BTCUSDT')`. */
export function useStockMarketStream(symbol: string, options?: MarketStreamOptions): StockMarketStream {
  const { ticks, ...connection } = useMarketTickerStream([symbol], options);
  const tick = ticks[symbol.trim().toUpperCase()] ?? null;

  return {
    ...connection,
    tick,
    price: tick?.lastPrice ?? null,
    priceChangePercent: tick?.priceChangePercent ?? null,
  };
}
