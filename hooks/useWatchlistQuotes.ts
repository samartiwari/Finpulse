import { useMemo } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useMarketTickerStream } from '@/hooks/useStockMarketStream';
import { fetchTickerSnapshots, splitSymbol } from '@/services/binance';
import type { WatchlistEntry } from '@/store/useWatchlistStore';
import type { MarketTick } from '@/types/market';

const SNAPSHOT_STALE_TIME_MS = 30_000;

export interface WatchlistRowData {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  alertEnabled: boolean;
  lastPrice: number | null;
  priceChangePercent: number | null;
}

function newestTick(live: MarketTick | undefined, snapshot: MarketTick | undefined): MarketTick | undefined {
  if (!live) return snapshot;
  if (!snapshot) return live;
  // A refetch can resolve after fresher socket ticks have landed; never let it roll the price back.
  return live.eventTime >= snapshot.eventTime ? live : snapshot;
}

/**
 * Joins watchlist entries with prices: a REST snapshot for first paint and
 * pull-to-refresh, overlaid with live socket ticks as they arrive.
 */
export function useWatchlistQuotes(entries: readonly WatchlistEntry[]) {
  const symbols = useMemo(() => entries.map((entry) => entry.symbol), [entries]);
  const stream = useMarketTickerStream(symbols);

  // Sorted so reordering the watchlist doesn't refetch.
  const snapshotKey = useMemo(() => [...symbols].sort().join(','), [symbols]);
  const snapshot = useQuery({
    queryKey: ['ticker-snapshots', snapshotKey],
    queryFn: ({ signal }) => fetchTickerSnapshots(snapshotKey.split(','), signal),
    enabled: snapshotKey !== '',
    staleTime: SNAPSHOT_STALE_TIME_MS,
    // Keep the old prices on screen while a new symbol set loads instead of blanking the list.
    placeholderData: keepPreviousData,
  });

  const rows = useMemo<WatchlistRowData[]>(
    () =>
      entries.map((entry) => {
        const tick = newestTick(stream.ticks[entry.symbol], snapshot.data?.[entry.symbol]);
        return {
          symbol: entry.symbol,
          ...splitSymbol(entry.symbol),
          alertEnabled: entry.alertEnabled,
          lastPrice: tick?.lastPrice ?? null,
          priceChangePercent: tick?.priceChangePercent ?? null,
        };
      }),
    [entries, stream.ticks, snapshot.data],
  );

  return { rows, stream, snapshot };
}
