import { useState, useCallback } from 'react';

export interface PaginationResult<T> {
  data: T[];
  hasMore: boolean;
}

type FetchFunction<T> = (page: number) => Promise<PaginationResult<T>>;

export function usePagination<T>(fetchFn: FetchFunction<T>) {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const result = await fetchFn(page);
      setData((prev) => [...prev, ...result.data]);
      setHasMore(result.hasMore);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchFn, page, loading, hasMore]);

  return { data, fetchData, loading, hasMore };
}
