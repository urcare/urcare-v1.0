import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';

// Image optimization interface
interface ImageOptimizationOptions {
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  format?: 'webp' | 'jpeg' | 'png';
}

interface OptimizedImage {
  url: string;
  size: number;
  format: string;
  width: number;
  height: number;
}

// Lazy loading interface
interface LazyLoadOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

// Offline sync interface
interface SyncItem {
  id: string;
  data: any;
  action: 'create' | 'update' | 'delete';
  table: string;
  timestamp: number;
}

interface OfflineSyncState {
  isOnline: boolean;
  syncQueue: SyncItem[];
  isSyncing: boolean;
  lastSyncTime: number | null;
}

export const usePerformance = () => {
  // Image optimization state
  const [optimizedImages, setOptimizedImages] = useState<Map<string, OptimizedImage>>(new Map());
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Lazy loading state
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [loadedElements, setLoadedElements] = useState<Set<string>>(new Set());

  // Offline sync state
  const [offlineState, setOfflineState] = useState<OfflineSyncState>({
    isOnline: navigator.onLine,
    syncQueue: [],
    isSyncing: false,
    lastSyncTime: null
  });

  // Service worker state
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // Image optimization methods
  const optimizeImage = useCallback(async (
    file: File | string, 
    options: ImageOptimizationOptions = {}
  ): Promise<OptimizedImage | null> => {
    try {
      setIsOptimizing(true);
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      return new Promise((resolve, reject) => {
        img.onload = () => {
          const { quality = 0.8, maxWidth = 1920, maxHeight = 1080, format = 'webp' } = options;
          
          // Calculate new dimensions
          let { width, height } = img;
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width *= ratio;
            height *= ratio;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw and compress
          ctx?.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const optimized: OptimizedImage = {
                url,
                size: blob.size,
                format,
                width,
                height
              };
              
              setOptimizedImages(prev => new Map(prev).set(url, optimized));
              resolve(optimized);
            } else {
              reject(new Error('Failed to optimize image'));
            }
          }, `image/${format}`, quality);
        };
        
        img.onerror = () => reject(new Error('Failed to load image'));
        
        if (typeof file === 'string') {
          img.src = file;
        } else {
          img.src = URL.createObjectURL(file);
        }
      });
    } catch (error) {
      console.error('Image optimization error:', error);
      toast.error('Failed to optimize image');
      return null;
    } finally {
      setIsOptimizing(false);
    }
  }, []);

  // Lazy loading methods
  const useLazyLoad = useCallback((
    elementId: string,
    options: LazyLoadOptions = {}
  ) => {
    const { threshold = 0.1, rootMargin = '50px', triggerOnce = true } = options;
    
    useEffect(() => {
      const element = document.getElementById(elementId);
      if (!element) return;

      if (!observerRef.current) {
        observerRef.current = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const id = entry.target.id;
                setLoadedElements(prev => new Set([...prev, id]));
                
                if (triggerOnce) {
                  observerRef.current?.unobserve(entry.target);
                }
              }
            });
          },
          { threshold, rootMargin }
        );
      }

      observerRef.current.observe(element);

      return () => {
        if (observerRef.current && element) {
          observerRef.current.unobserve(element);
        }
      };
    }, [elementId, threshold, rootMargin, triggerOnce]);

    return loadedElements.has(elementId);
  }, [loadedElements]);

  // Offline sync methods
  const addToSyncQueue = useCallback((item: Omit<SyncItem, 'timestamp'>) => {
    const syncItem: SyncItem = {
      ...item,
      timestamp: Date.now()
    };
    
    setOfflineState(prev => ({
      ...prev,
      syncQueue: [...prev.syncQueue, syncItem]
    }));
    
    // Store in localStorage for persistence
    const stored = localStorage.getItem('offlineSyncQueue');
    const queue = stored ? JSON.parse(stored) : [];
    queue.push(syncItem);
    localStorage.setItem('offlineSyncQueue', JSON.stringify(queue));
  }, []);

  const syncOfflineData = useCallback(async () => {
    if (!offlineState.isOnline || offlineState.isSyncing || offlineState.syncQueue.length === 0) {
      return;
    }

    setOfflineState(prev => ({ ...prev, isSyncing: true }));

    try {
      // Process sync queue (implementation depends on your API)
      for (const item of offlineState.syncQueue) {
        console.log('Syncing item:', item);
        // Add your sync logic here
      }

      setOfflineState(prev => ({
        ...prev,
        syncQueue: [],
        lastSyncTime: Date.now(),
        isSyncing: false
      }));

      localStorage.removeItem('offlineSyncQueue');
      toast.success('Data synchronized successfully');
    } catch (error) {
      console.error('Sync error:', error);
      toast.error('Failed to synchronize data');
      setOfflineState(prev => ({ ...prev, isSyncing: false }));
    }
  }, [offlineState.isOnline, offlineState.isSyncing, offlineState.syncQueue]);

  // Service worker methods
  const registerServiceWorker = useCallback(async () => {
    if ('serviceWorker' in navigator) {
      try {
        setIsInstalling(true);
        const registration = await navigator.serviceWorker.register('/sw.js');
        setSwRegistration(registration);

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setUpdateAvailable(true);
              }
            });
          }
        });

        toast.success('App is ready for offline use');
      } catch (error) {
        console.error('Service worker registration failed:', error);
        toast.error('Failed to enable offline features');
      } finally {
        setIsInstalling(false);
      }
    }
  }, []);

  const updateServiceWorker = useCallback(() => {
    if (swRegistration?.waiting) {
      swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  }, [swRegistration]);

  // Initialize effects
  useEffect(() => {
    // Load sync queue from localStorage
    const stored = localStorage.getItem('offlineSyncQueue');
    if (stored) {
      try {
        const queue = JSON.parse(stored);
        setOfflineState(prev => ({ ...prev, syncQueue: queue }));
      } catch (error) {
        console.error('Failed to load sync queue:', error);
      }
    }

    // Online/offline event listeners
    const handleOnline = () => {
      setOfflineState(prev => ({ ...prev, isOnline: true }));
      toast.success('Connection restored');
    };

    const handleOffline = () => {
      setOfflineState(prev => ({ ...prev, isOnline: false }));
      toast.warning('Connection lost - working offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Auto-sync when online
    if (offlineState.isOnline) {
      syncOfflineData();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      // Cleanup intersection observer
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [offlineState.isOnline, syncOfflineData]);

  return {
    // Image optimization
    optimizeImage,
    optimizedImages: Array.from(optimizedImages.values()),
    isOptimizing,

    // Lazy loading
    useLazyLoad,
    loadedElements: Array.from(loadedElements),

    // Offline sync
    ...offlineState,
    addToSyncQueue,
    syncOfflineData,

    // Service worker
    swRegistration,
    updateAvailable,
    isInstalling,
    registerServiceWorker,
    updateServiceWorker
  };
}; 