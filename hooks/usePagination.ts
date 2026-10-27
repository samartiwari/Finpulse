import { useState, useCallback } from 'react';

interface UsePaginationOptions {
  initialPage?: number;
  pageSize?: number;
}

interface PaginationState {
  page: number;
  pageSize: number;
  hasMore: boolean;
  loading: boolean;
}

export function usePagination<T>(
  fetchFunction: (page: number, pageSize: number) => Promise<T[]>,
  options: UsePaginationOptions = {}
) {
  const { initialPage = 1, pageSize = 20 } = options;
  
  const [state, setState] = useState<PaginationState>({
    page: initialPage,
    pageSize,
    hasMore: true,
    loading: false,
  });
  
  const [data, setData] = useState<T[]>([]);

  const loadPage = useCallback(async (page: number, reset = false) => {
    if (state.loading) return;
    
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const newData = await fetchFunction(page, state.pageSize);
      const hasMore = newData.length === state.pageSize;
      
      setData(prev => reset ? newData : [...prev, ...newData]);
      setState(prev => ({
        ...prev,
        page,
        hasMore,
        loading: false,
      }));
    } catch (error) {
      setState(prev => ({ ...prev, loading: false }));
      throw error;
    }
  }, [fetchFunction, state.pageSize, state.loading]);

  const loadMore = useCallback(() => {
    if (state.hasMore && !state.loading) {
      loadPage(state.page + 1);
    }
  }, [state.hasMore, state.loading, state.page, loadPage]);

  const refresh = useCallback(() => {
    loadPage(initialPage, true);
  }, [loadPage, initialPage]);

  const reset = useCallback(() => {
    setData([]);
    setState({
      page: initialPage,
      pageSize,
      hasMore: true,
      loading: false,
    });
  }, [initialPage, pageSize]);

  return {
    data,
    ...state,
    loadMore,
    refresh,
    reset,
  };
}
