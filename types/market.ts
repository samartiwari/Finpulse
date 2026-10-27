export interface MarketTick {
  symbol: string;
  lastPrice: number;
  priceChange: number;
  priceChangePercent: number;
  highPrice: number;
  lowPrice: number;
  volume: number;
  quoteVolume: number;
  /** Exchange timestamp (ms). Used to keep an older snapshot from overwriting a newer tick. */
  eventTime: number;
}

export type TickMap = Record<string, MarketTick>;

export type StreamStatus = 'idle' | 'connecting' | 'open' | 'reconnecting';
