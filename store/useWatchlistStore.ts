import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchLastPrice, isInvalidSymbolError } from '@/services/binance';
import { createMMKVStorage } from '@/utils/mmkvStorage';

export interface WatchlistEntry {
  /** Binance pair in upper case, e.g. BTCUSDT. */
  symbol: string;
  alertEnabled: boolean;
  addedAt: number;
}

export type AddSymbolResult = 'added' | 'duplicate' | 'invalid';

interface WatchlistState {
  entries: WatchlistEntry[];
  addSymbol: (symbol: string) => Promise<AddSymbolResult>;
  removeSymbol: (symbol: string) => void;
  toggleAlert: (symbol: string) => void;
  reorderWatchlist: (fromIndex: number, toIndex: number) => void;
}

type PersistedWatchlist = Pick<WatchlistState, 'entries'>;

const DEFAULT_SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT', 'DOGEUSDT', 'ADAUSDT', 'LTCUSDT'];
const SYMBOL_PATTERN = /^[A-Z0-9]{5,20}$/;

const createEntry = (symbol: string): WatchlistEntry => ({ symbol, alertEnabled: false, addedAt: Date.now() });

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      entries: DEFAULT_SYMBOLS.map(createEntry),

      addSymbol: async (rawSymbol) => {
        const symbol = rawSymbol.trim().toUpperCase();
        if (!SYMBOL_PATTERN.test(symbol)) return 'invalid';
        if (get().entries.some((entry) => entry.symbol === symbol)) return 'duplicate';

        // Optimistic: the row shows up right away and validation catches up behind it.
        const entry = createEntry(symbol);
        set((state) => ({ entries: [...state.entries, entry] }));

        try {
          await fetchLastPrice(symbol);
        } catch (error) {
          if (isInvalidSymbolError(error)) {
            // Match on addedAt so we only roll back this add, not a later re-add of the same symbol.
            set((state) => ({
              entries: state.entries.filter((e) => !(e.symbol === symbol && e.addedAt === entry.addedAt)),
            }));
            return 'invalid';
          }
          // Binance unreachable: keep the symbol; the stream fills in its price once we're back online.
        }
        return 'added';
      },

      removeSymbol: (symbol) =>
        set((state) => ({ entries: state.entries.filter((entry) => entry.symbol !== symbol) })),

      toggleAlert: (symbol) =>
        set((state) => ({
          entries: state.entries.map((entry) =>
            entry.symbol === symbol ? { ...entry, alertEnabled: !entry.alertEnabled } : entry,
          ),
        })),

      reorderWatchlist: (fromIndex, toIndex) =>
        set((state) => {
          const { entries } = state;
          const inRange = (index: number) => index >= 0 && index < entries.length;
          if (fromIndex === toIndex || !inRange(fromIndex) || !inRange(toIndex)) return state;

          const next = entries.slice();
          const [moved] = next.splice(fromIndex, 1);
          next.splice(toIndex, 0, moved);
          return { entries: next };
        }),
    }),
    {
      name: 'watchlist',
      version: 1,
      // Watchlist edits are cheap to lose in a crash, so writes are batched off the interaction frame.
      storage: createMMKVStorage<PersistedWatchlist>({ writeBehind: true }),
      partialize: (state) => ({ entries: state.entries }),
    },
  ),
);

export const useIsWatchlisted = (symbol: string) =>
  useWatchlistStore((state) => state.entries.some((entry) => entry.symbol === symbol));
