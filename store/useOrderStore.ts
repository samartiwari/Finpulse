import NetInfo from '@react-native-community/netinfo';
import { AppState } from 'react-native';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { submitOrder, type OrderExecution } from '@/services/orderApi';
import {
  applyFill,
  canCover,
  getProtectionPrice,
  holdPrices,
  projectLedger,
  roundAmount,
  type Ledger,
  type Order,
  type OrderSide,
} from '@/store/orderLedger';
import { createMMKVStorage } from '@/utils/mmkvStorage';
import { formatAssetPrice } from '@/utils/formatters';
import { showErrorToast, showSuccessToast } from '@/utils/toast';

const STARTING_CASH = 10_000;
const MAX_ORDER_HISTORY = 200;
const RETRY_DELAYS_MS = [2_000, 5_000, 15_000, 30_000, 60_000];

export interface PlaceOrderInput {
  symbol: string;
  side: OrderSide;
  quantity: number;
  /** Last traded price shown to the user. */
  price: number;
}

export type PlaceOrderResult = { ok: true; order: Order } | { ok: false; reason: string };

interface OrderState {
  /** Balances the broker has confirmed. */
  settled: Ledger;
  /** `settled` plus every queued order. What the UI shows; derived, never persisted. */
  optimistic: Ledger;
  /** Newest first. */
  orders: Order[];
  /** Ids waiting to be sent, oldest first. Orders are submitted strictly in this order. */
  queue: string[];
  isOnline: boolean;
  isSyncing: boolean;
  placeOrder: (input: PlaceOrderInput) => PlaceOrderResult;
  processQueue: () => Promise<void>;
  setOnline: (isOnline: boolean) => void;
}

type PersistedOrders = Pick<OrderState, 'settled' | 'orders' | 'queue'>;

const createOrderId = () => `ord_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;

function project({ settled, orders, queue }: PersistedOrders): Ledger {
  const byId = new Map(orders.map((order) => [order.id, order]));
  const pending = queue.map((id) => byId.get(id)).filter((order): order is Order => order !== undefined);
  return projectLedger(settled, pending);
}

function trimHistory(orders: Order[], queue: string[]): Order[] {
  if (orders.length <= MAX_ORDER_HISTORY) return orders;
  const queued = new Set(queue);
  return orders.filter((order, index) => index < MAX_ORDER_HISTORY || queued.has(order.id));
}

function describeFill(order: Order, executedPrice: number): string {
  const verb = order.side === 'BUY' ? 'Bought' : 'Sold';
  const summary = `${verb} ${order.quantity} ${order.symbol} at ${formatAssetPrice(executedPrice)}`;
  return executedPrice === order.requestedPrice
    ? summary
    : `${summary} (placed at ${formatAssetPrice(order.requestedPrice)})`;
}

// Module scope so overlapping triggers (NetInfo, AppState, retry timer, a new order) share one drain.
let activeSync: Promise<void> | null = null;
let retryTimer: ReturnType<typeof setTimeout> | null = null;

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => {
      const patchOrder = (id: string, patch: Partial<Order>) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === id ? { ...order, ...patch, updatedAt: Date.now() } : order,
          ),
        }));

      const finalizeOrder = (id: string, patch: Partial<Order>, settled?: Ledger) =>
        set((state) => {
          const queue = state.queue.filter((queuedId) => queuedId !== id);
          const orders = trimHistory(
            state.orders.map((order) => (order.id === id ? { ...order, ...patch, updatedAt: Date.now() } : order)),
            queue,
          );
          const next = { settled: settled ?? state.settled, orders, queue };
          return { ...next, optimistic: project(next) };
        });

      const rejectOrder = (order: Order, reason: string) => {
        finalizeOrder(order.id, { status: 'REJECTED', rejectionReason: reason });
        showErrorToast('Order rejected', `${order.side} ${order.quantity} ${order.symbol}: ${reason}`);
      };

      const scheduleRetry = (attempt: number) => {
        if (retryTimer !== null) clearTimeout(retryTimer);
        const delay = RETRY_DELAYS_MS[Math.min(attempt, RETRY_DELAYS_MS.length) - 1];
        retryTimer = setTimeout(() => {
          retryTimer = null;
          void get().processQueue();
        }, delay);
      };

      const drainQueue = async () => {
        if (retryTimer !== null) {
          clearTimeout(retryTimer);
          retryTimer = null;
        }
        set({ isSyncing: true });
        try {
          for (;;) {
            const { isOnline, queue, orders, settled } = get();
            if (!isOnline || queue.length === 0) return;

            const order = orders.find((candidate) => candidate.id === queue[0]);
            if (!order) {
              set((state) => ({ queue: state.queue.slice(1) }));
              continue;
            }

            // Re-check against confirmed balances: an order ahead of this one may have been
            // rejected or filled at a worse price since this one was accepted on the device.
            if (!canCover(settled, order, holdPrices(order))) {
              rejectOrder(order, order.side === 'BUY' ? 'Insufficient funds' : 'Insufficient holdings');
              continue;
            }

            const attempts = order.attempts + 1;
            patchOrder(order.id, { status: 'SYNCING', attempts });

            let execution: OrderExecution;
            try {
              execution = await submitOrder({
                clientOrderId: order.id,
                symbol: order.symbol,
                side: order.side,
                quantity: order.quantity,
                protectionPrice: order.protectionPrice,
              });
            } catch {
              // Transport failure: leave it at the head of the queue so later orders can't jump it.
              patchOrder(order.id, { status: 'PENDING_SYNC' });
              scheduleRetry(attempts);
              return;
            }

            if (execution.status === 'REJECTED') {
              rejectOrder(order, execution.reason);
              continue;
            }

            // The broker is the source of truth for the fill price; settle at what it reports.
            const fill = { cash: execution.executedPrice, cost: execution.executedPrice };
            finalizeOrder(
              order.id,
              { status: 'EXECUTED', executedPrice: execution.executedPrice },
              applyFill(get().settled, order, fill),
            );
            showSuccessToast('Order executed', describeFill(order, execution.executedPrice));
          }
        } finally {
          set({ isSyncing: false });
        }
      };

      return {
        settled: { cashBalance: STARTING_CASH, positions: {} },
        optimistic: { cashBalance: STARTING_CASH, positions: {} },
        orders: [],
        queue: [],
        // Unknown until NetInfo reports; the first "online" event then drains anything persisted.
        isOnline: false,
        isSyncing: false,

        placeOrder: ({ symbol, side, quantity, price }) => {
          if (!(quantity > 0)) return { ok: false, reason: 'Enter a quantity greater than zero' };
          if (!(price > 0)) return { ok: false, reason: 'Waiting for a live price' };

          const now = Date.now();
          const order: Order = {
            id: createOrderId(),
            symbol: symbol.toUpperCase(),
            side,
            quantity: roundAmount(quantity),
            requestedPrice: price,
            protectionPrice: getProtectionPrice(side, price),
            executedPrice: null,
            status: 'PENDING_SYNC',
            rejectionReason: null,
            placedOffline: !get().isOnline,
            attempts: 0,
            createdAt: now,
            updatedAt: now,
          };

          const { optimistic } = get();
          const prices = holdPrices(order);
          if (!canCover(optimistic, order, prices)) {
            return {
              ok: false,
              reason: side === 'BUY' ? 'Insufficient funds, including the 2% price buffer' : 'Insufficient holdings',
            };
          }

          // Optimistic: balances and positions move now; the broker confirms when the queue drains.
          set((state) => ({
            orders: [order, ...state.orders],
            queue: [...state.queue, order.id],
            optimistic: applyFill(optimistic, order, prices),
          }));

          if (get().isOnline) void get().processQueue();
          return { ok: true, order };
        },

        processQueue: () => {
          if (!activeSync) {
            activeSync = drainQueue().finally(() => {
              activeSync = null;
            });
          }
          return activeSync;
        },

        setOnline: (isOnline) => {
          if (get().isOnline === isOnline) return;
          set({ isOnline });
          if (isOnline) void get().processQueue();
        },
      };
    },
    {
      name: 'orders',
      version: 1,
      // Write-through, not write-behind: an order the user was told is queued must already be on disk.
      storage: createMMKVStorage<PersistedOrders>(),
      partialize: ({ settled, orders, queue }) => ({ settled, orders, queue }),
      merge: (persisted, current) => {
        const saved = persisted as PersistedOrders | undefined;
        if (!saved) return current;
        // An order that was mid-flight when the app died goes back to pending. Its id makes
        // the resubmit idempotent, so a fill the broker already made is returned, not repeated.
        const orders = saved.orders.map((order) =>
          order.status === 'SYNCING' ? { ...order, status: 'PENDING_SYNC' as const } : order,
        );
        const next = { settled: saved.settled, orders, queue: saved.queue };
        return { ...current, ...next, optimistic: project(next) };
      },
    },
  ),
);

/** Wires the queue to connectivity and app foregrounding. Call once at app start; returns a cleanup. */
export function startOrderSync(): () => void {
  const unsubscribeNetInfo = NetInfo.addEventListener((state) => {
    // isInternetReachable is null until the first probe finishes; only an explicit false means offline.
    const isOnline = state.isConnected === true && state.isInternetReachable !== false;
    useOrderStore.getState().setOnline(isOnline);
  });

  const appStateSubscription = AppState.addEventListener('change', (state) => {
    if (state === 'active') void useOrderStore.getState().processQueue();
  });

  return () => {
    unsubscribeNetInfo();
    appStateSubscription.remove();
  };
}
