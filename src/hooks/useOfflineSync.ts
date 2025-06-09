
import { useState, useEffect } from 'react';

interface OfflineData {
  id: string;
  type: string;
  data: any;
  timestamp: number;
  synced: boolean;
}

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSync, setPendingSync] = useState<OfflineData[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncPendingData();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Register for background sync if supported
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then(registration => {
        return registration.sync.register('background-sync');
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const addToOfflineQueue = (type: string, data: any) => {
    const offlineItem: OfflineData = {
      id: Date.now().toString(),
      type,
      data,
      timestamp: Date.now(),
      synced: false
    };

    setPendingSync(prev => [...prev, offlineItem]);
    
    // Store in IndexedDB for persistence
    storeOfflineData(offlineItem);
  };

  const syncPendingData = async () => {
    if (!isOnline || isSyncing || pendingSync.length === 0) {
      return;
    }

    setIsSyncing(true);

    try {
      for (const item of pendingSync.filter(item => !item.synced)) {
        await syncDataItem(item);
        
        setPendingSync(prev => 
          prev.map(p => 
            p.id === item.id ? { ...p, synced: true } : p
          )
        );
      }
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const syncDataItem = async (item: OfflineData): Promise<void> => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) { // 90% success rate
          resolve();
        } else {
          reject(new Error('Sync failed'));
        }
      }, 1000);
    });
  };

  const storeOfflineData = async (data: OfflineData) => {
    // Store in IndexedDB for persistence across sessions
    try {
      const db = await openDB();
      const transaction = db.transaction(['offlineData'], 'readwrite');
      const store = transaction.objectStore('offlineData');
      await store.add(data);
    } catch (error) {
      console.error('Failed to store offline data:', error);
    }
  };

  const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('UrCareOfflineDB', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('offlineData')) {
          db.createObjectStore('offlineData', { keyPath: 'id' });
        }
      };
    });
  };

  return {
    isOnline,
    pendingSync,
    isSyncing,
    addToOfflineQueue,
    syncPendingData
  };
};
