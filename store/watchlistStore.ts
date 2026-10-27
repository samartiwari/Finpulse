import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockStocks } from '@/mocks/stocks';
import { Stock } from '@/types/stock';

interface WatchlistState {
  stocks: Stock[];
  addToWatchlist: (stock: Stock) => void;
  removeFromWatchlist: (stockId: string) => void;
  isInWatchlist: (stockId: string) => boolean;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      stocks: Array.isArray(mockStocks) ? mockStocks.slice(0, 5) : [], // Use first 5 stocks as default watchlist

      addToWatchlist: (stock: Stock) =>
        set((state) => ({
          stocks: [...(state.stocks || []), stock],
        })),

      removeFromWatchlist: (stockId: string) =>
        set((state) => ({
          stocks: (state.stocks || []).filter(s => s.id !== stockId),
        })),

      isInWatchlist: (stockId: string): boolean => {
        const state = get();
        return (state.stocks || []).some((stock: Stock) => stock.id === stockId);
      },
    }),
    {
      name: 'watchlist-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);