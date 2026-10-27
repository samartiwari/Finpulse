import { useCallback, useEffect, useRef, useState } from 'react';

interface RefreshControlOptions {
  /**
   * Keep the spinner up at least this long. A spinner that appears and vanishes
   * within a few frames reads as a glitch rather than as feedback.
   */
  minDurationMs?: number;
}

/**
 * Pull-to-refresh state that is deliberately decoupled from any query's
 * `isFetching`, so background refetches never spin the indicator and the list
 * keeps rendering its current data while the refresh runs.
 */
export function useRefreshControl(
  refresh: () => Promise<unknown>,
  { minDurationMs = 600 }: RefreshControlOptions = {},
) {
  const [refreshing, setRefreshing] = useState(false);
  const inFlightRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const onRefresh = useCallback(async () => {
    // A second pull while one is running would otherwise stack duplicate requests.
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setRefreshing(true);

    const startedAt = Date.now();
    try {
      await refresh();
    } catch (error) {
      // Callers surface failures through their own state (e.g. a query's `error`).
      console.warn('Refresh failed:', error);
    } finally {
      const remaining = minDurationMs - (Date.now() - startedAt);
      if (remaining > 0) {
        await new Promise((resolve) => setTimeout(resolve, remaining));
      }
      inFlightRef.current = false;
      if (mountedRef.current) setRefreshing(false);
    }
  }, [refresh, minDurationMs]);

  return { refreshing, onRefresh };
}
