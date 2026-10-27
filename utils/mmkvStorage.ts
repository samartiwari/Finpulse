import { AppState } from 'react-native';
import { MMKV } from 'react-native-mmkv';
import type { PersistStorage, StorageValue } from 'zustand/middleware';

export const mmkv = new MMKV({ id: 'finpulse' });

const WRITE_BEHIND_DELAY_MS = 250;

const pendingWrites = new Map<string, () => void>();
let flushTimer: ReturnType<typeof setTimeout> | null = null;

export function flushPendingWrites(): void {
  if (flushTimer !== null) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }
  const writes = Array.from(pendingWrites.values());
  pendingWrites.clear();
  writes.forEach((write) => write());
}

// The OS can kill a backgrounded app without warning, so nothing stays buffered past that point.
AppState.addEventListener('change', (state) => {
  if (state !== 'active') flushPendingWrites();
});

interface MMKVStorageOptions {
  /**
   * Defer serialization and the disk write until after the current frame,
   * collapsing bursts of updates into one write. Good for UI state like the
   * watchlist; leave it off for anything that must be durable the moment it
   * is accepted, such as an order the user was told is queued.
   */
  writeBehind?: boolean;
}

/**
 * zustand `PersistStorage` backed by MMKV. Reads are synchronous over JSI, so
 * stores hydrate during `create()` and the first render already has persisted state.
 */
export function createMMKVStorage<S>({ writeBehind = false }: MMKVStorageOptions = {}): PersistStorage<S> {
  // Values accepted but not yet on disk; reads check here first so they see their own writes.
  const unflushed = new Map<string, StorageValue<S>>();

  return {
    getItem: (name) => {
      const pending = unflushed.get(name);
      if (pending) return pending;

      const raw = mmkv.getString(name);
      if (raw === undefined) return null;
      try {
        return JSON.parse(raw) as StorageValue<S>;
      } catch {
        // A corrupt entry shouldn't brick the app; fall back to the store's initial state.
        return null;
      }
    },
    setItem: (name, value) => {
      if (!writeBehind) {
        mmkv.set(name, JSON.stringify(value));
        return;
      }
      unflushed.set(name, value);
      pendingWrites.set(name, () => {
        unflushed.delete(name);
        mmkv.set(name, JSON.stringify(value));
      });
      if (flushTimer === null) {
        flushTimer = setTimeout(flushPendingWrites, WRITE_BEHIND_DELAY_MS);
      }
    },
    removeItem: (name) => {
      unflushed.delete(name);
      pendingWrites.delete(name);
      mmkv.delete(name);
    },
  };
}
