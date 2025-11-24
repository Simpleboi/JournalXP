import { useState, useEffect, useCallback, useRef } from "react";

interface UseLazyLoadOptions<T> {
  items: T[];
  pageSize?: number;
  threshold?: number;
}

/**
 * Hook for lazy loading items with infinite scroll
 */
export function useLazyLoad<T>({ items, pageSize = 10, threshold = 0.8 }: UseLazyLoadOptions<T>) {
  const [displayedItems, setDisplayedItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Calculate total pages
  const totalPages = Math.ceil(items.length / pageSize);

  // Load initial page
  useEffect(() => {
    const initialItems = items.slice(0, pageSize);
    setDisplayedItems(initialItems);
    setPage(1);
    setHasMore(items.length > pageSize);
  }, [items, pageSize]);

  // Load more items
  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    // Simulate async loading with a small delay for smooth UX
    setTimeout(() => {
      const nextPage = page + 1;
      const startIndex = 0;
      const endIndex = nextPage * pageSize;
      const newItems = items.slice(startIndex, endIndex);

      setDisplayedItems(newItems);
      setPage(nextPage);
      setHasMore(endIndex < items.length);
      setIsLoading(false);
    }, 300);
  }, [items, page, pageSize, hasMore, isLoading]);

  // Reset when items change
  useEffect(() => {
    const initialItems = items.slice(0, pageSize);
    setDisplayedItems(initialItems);
    setPage(1);
    setHasMore(items.length > pageSize);
  }, [items.length, pageSize]);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current) return;

    const options = {
      root: null,
      rootMargin: "0px",
      threshold,
    };

    const callback: IntersectionObserverCallback = (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !isLoading) {
        loadMore();
      }
    };

    observerRef.current = new IntersectionObserver(callback, options);

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoading, loadMore, threshold]);

  // Manual load more (for button click)
  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      loadMore();
    }
  }, [loadMore, isLoading, hasMore]);

  // Reset to first page
  const reset = useCallback(() => {
    const initialItems = items.slice(0, pageSize);
    setDisplayedItems(initialItems);
    setPage(1);
    setHasMore(items.length > pageSize);
  }, [items, pageSize]);

  return {
    displayedItems,
    isLoading,
    hasMore,
    page,
    totalPages,
    loadMore: handleLoadMore,
    reset,
    loadMoreRef,
  };
}
