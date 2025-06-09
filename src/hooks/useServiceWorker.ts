
import { useState, useEffect } from 'react';

interface ServiceWorkerState {
  isSupported: boolean;
  isRegistered: boolean;
  isUpdating: boolean;
  registration: ServiceWorkerRegistration | null;
}

export const useServiceWorker = () => {
  const [state, setState] = useState<ServiceWorkerState>({
    isSupported: 'serviceWorker' in navigator,
    isRegistered: false,
    isUpdating: false,
    registration: null
  });

  useEffect(() => {
    if (!state.isSupported) {
      console.log('Service Worker not supported');
      return;
    }

    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        
        setState(prev => ({
          ...prev,
          isRegistered: true,
          registration
        }));

        // Check for updates
        registration.addEventListener('updatefound', () => {
          setState(prev => ({ ...prev, isUpdating: true }));
          
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed') {
                setState(prev => ({ ...prev, isUpdating: false }));
                
                if (navigator.serviceWorker.controller) {
                  // New version available
                  console.log('New version available');
                } else {
                  // First install
                  console.log('Service Worker installed for the first time');
                }
              }
            });
          }
        });

        console.log('Service Worker registered successfully');
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    };

    registerServiceWorker();
  }, [state.isSupported]);

  const updateServiceWorker = async () => {
    if (state.registration) {
      try {
        await state.registration.update();
        console.log('Service Worker update triggered');
      } catch (error) {
        console.error('Service Worker update failed:', error);
      }
    }
  };

  const unregisterServiceWorker = async () => {
    if (state.registration) {
      try {
        await state.registration.unregister();
        setState(prev => ({
          ...prev,
          isRegistered: false,
          registration: null
        }));
        console.log('Service Worker unregistered');
      } catch (error) {
        console.error('Service Worker unregister failed:', error);
      }
    }
  };

  return {
    ...state,
    updateServiceWorker,
    unregisterServiceWorker
  };
};
