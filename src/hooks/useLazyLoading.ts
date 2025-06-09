
import { useState, useEffect, useRef, useCallback } from 'react';

interface LazyLoadingOptions {
  threshold?: number;
  root?: Element | null;
  rootMargin?: string;
  triggerOnce?: boolean;
}

interface LazyLoadingHook {
  ref: React.RefObject<Element>;
  isVisible: boolean;
  hasBeenVisible: boolean;
}

export const useLazyLoading = (options: LazyLoadingOptions = {}): LazyLoadingHook => {
  const {
    threshold = 0.1,
    root = null,
    rootMargin = '50px',
    triggerOnce = true
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const ref = useRef<Element>(null);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    
    if (entry.isIntersecting) {
      setIsVisible(true);
      setHasBeenVisible(true);
      
      if (triggerOnce && ref.current) {
        // Stop observing after first intersection if triggerOnce is true
        observer.current?.unobserve(ref.current);
      }
    } else {
      setIsVisible(false);
    }
  }, [triggerOnce]);

  const observer = useRef<IntersectionObserver>();

  useEffect(() => {
    const element = ref.current;
    
    if (!element) return;

    observer.current = new IntersectionObserver(handleIntersection, {
      threshold,
      root,
      rootMargin
    });

    observer.current.observe(element);

    return () => {
      if (observer.current && element) {
        observer.current.unobserve(element);
      }
    };
  }, [handleIntersection, threshold, root, rootMargin]);

  return { ref, isVisible, hasBeenVisible };
};

// Hook for preloading content based on user behavior
export const usePredictiveLoading = () => {
  const [prefetchQueue, setPrefetchQueue] = useState<string[]>([]);
  const [isPreloading, setIsPreloading] = useState(false);

  const addToPrefetchQueue = useCallback((url: string) => {
    setPrefetchQueue(prev => {
      if (!prev.includes(url)) {
        return [...prev, url];
      }
      return prev;
    });
  }, []);

  const prefetchResource = useCallback(async (url: string) => {
    if (typeof window === 'undefined') return;

    try {
      setIsPreloading(true);
      
      // Create a link element for prefetching
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      document.head.appendChild(link);
      
      // Remove from queue after successful prefetch
      setPrefetchQueue(prev => prev.filter(item => item !== url));
    } catch (error) {
      console.error('Prefetch failed:', error);
    } finally {
      setIsPreloading(false);
    }
  }, []);

  const processPrefetchQueue = useCallback(async () => {
    if (prefetchQueue.length === 0 || isPreloading) return;

    const nextUrl = prefetchQueue[0];
    await prefetchResource(nextUrl);
  }, [prefetchQueue, isPreloading, prefetchResource]);

  useEffect(() => {
    processPrefetchQueue();
  }, [processPrefetchQueue]);

  return {
    addToPrefetchQueue,
    prefetchQueue,
    isPreloading
  };
};
