import type { MarketTick, TickMap } from '@/types/market';

const BINANCE_REST_BASE_URL = 'https://api.binance.com';
const INVALID_SYMBOL_CODE = -1121;

// Checked in order; the first matching suffix is treated as the quote asset.
const QUOTE_ASSETS = ['FDUSD', 'USDT', 'USDC', 'TUSD', 'BUSD', 'BTC', 'ETH', 'BNB', 'EUR', 'TRY', 'BRL'];

interface Binance24hrTicker {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  lastPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  closeTime: number;
}

export class BinanceApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: number,
  ) {
    super(message);
    this.name = 'BinanceApiError';
  }
}

export function isInvalidSymbolError(error: unknown): boolean {
  return error instanceof BinanceApiError && error.code === INVALID_SYMBOL_CODE;
}

async function request<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${BINANCE_REST_BASE_URL}${path}`, { signal });
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new BinanceApiError(body?.msg ?? `Request failed with status ${response.status}`, response.status, body?.code);
  }
  return body as T;
}

function toMarketTick(ticker: Binance24hrTicker): MarketTick {
  return {
    symbol: ticker.symbol,
    lastPrice: Number(ticker.lastPrice),
    priceChange: Number(ticker.priceChange),
    priceChangePercent: Number(ticker.priceChangePercent),
    highPrice: Number(ticker.highPrice),
    lowPrice: Number(ticker.lowPrice),
    volume: Number(ticker.volume),
    quoteVolume: Number(ticker.quoteVolume),
    eventTime: ticker.closeTime,
  };
}

/** 24h stats for several pairs in one request. Fails as a whole if any symbol is unknown. */
export async function fetchTickerSnapshots(symbols: readonly string[], signal?: AbortSignal): Promise<TickMap> {
  if (symbols.length === 0) return {};
  const param = encodeURIComponent(JSON.stringify(symbols.map((symbol) => symbol.toUpperCase())));
  const tickers = await request<Binance24hrTicker[]>(`/api/v3/ticker/24hr?symbols=${param}`, signal);
  return Object.fromEntries(tickers.map((ticker) => [ticker.symbol, toMarketTick(ticker)]));
}

export async function fetchLastPrice(symbol: string, signal?: AbortSignal): Promise<number> {
  const { price } = await request<{ symbol: string; price: string }>(
    `/api/v3/ticker/price?symbol=${encodeURIComponent(symbol.toUpperCase())}`,
    signal,
  );
  return Number(price);
}

export function splitSymbol(symbol: string): { baseAsset: string; quoteAsset: string } {
  const quoteAsset = QUOTE_ASSETS.find((quote) => symbol.length > quote.length && symbol.endsWith(quote));
  if (!quoteAsset) return { baseAsset: symbol, quoteAsset: '' };
  return { baseAsset: symbol.slice(0, -quoteAsset.length), quoteAsset };
}
