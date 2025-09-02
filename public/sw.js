// Service Worker for UrCare Health App
// Handles background notifications, offline support, and background sync

const CACHE_NAME = 'urcare-health-v1.0';
const STATIC_CACHE = 'urcare-static-v1.0';
const DYNAMIC_CACHE = 'urcare-dynamic-v1.0';

// Files to cache for offline use
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/urcare-logo.svg',
  '/favicon.ico',
  '/src/main.tsx',
  '/src/App.tsx'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Static files cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Failed to cache static files:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker activated successfully');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // Skip non-HTTP requests
  if (!request.url.startsWith('http')) return;
  
  // Handle API requests differently
  if (request.url.includes('/api/') || request.url.includes('supabase')) {
    event.respondWith(handleApiRequest(request));
    return;
  }
  
  // Handle static file requests
  event.respondWith(handleStaticRequest(request));
});

// Handle API requests with offline fallback
async function handleApiRequest(request) {
  try {
    // Try to fetch from network first
    const response = await fetch(request);
    
    // Cache successful responses
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('Network failed, trying cache:', error);
    
    // Try to serve from cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline fallback
    return new Response(
      JSON.stringify({ 
        error: 'Network unavailable',
        message: 'Please check your connection and try again'
      }), 
      { 
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Handle static file requests
async function handleStaticRequest(request) {
  try {
    // Try cache first for static files
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback to network
    const response = await fetch(request);
    
    // Cache successful responses
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('Failed to fetch static file:', error);
    
    // Return offline page
    if (request.destination === 'document') {
      return caches.match('/offline.html');
    }
    
    return new Response('Offline', { status: 503 });
  }
}

// Background sync for health notifications
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'health-notifications') {
    event.waitUntil(syncHealthNotifications());
  }
});

// Sync health notifications when back online
async function syncHealthNotifications() {
  try {
    console.log('Syncing health notifications...');
    
    // Get all pending notifications from IndexedDB
    const pendingNotifications = await getPendingNotificationsFromDB();
    
    if (pendingNotifications.length === 0) {
      console.log('No pending notifications to sync');
      return;
    }
    
    console.log(`Syncing ${pendingNotifications.length} notifications`);
    
    // Process each pending notification
    for (const notification of pendingNotifications) {
      try {
        await processNotification(notification);
      } catch (error) {
        console.error('Failed to process notification:', error);
      }
    }
    
    console.log('Health notifications synced successfully');
  } catch (error) {
    console.error('Failed to sync health notifications:', error);
  }
}

// Get pending notifications from IndexedDB
async function getPendingNotificationsFromDB() {
  // This would integrate with your IndexedDB implementation
  // For now, return empty array
  return [];
}

// Process a single notification
async function processNotification(notification) {
  try {
    // Check if notification time has passed
    const now = new Date();
    const scheduledTime = new Date(notification.scheduledTime);
    
    if (now >= scheduledTime) {
      // Show notification
      await showNotification(notification);
      
      // Mark as sent
      await markNotificationAsSent(notification.id);
    }
  } catch (error) {
    console.error('Failed to process notification:', error);
  }
}

// Show notification
async function showNotification(notification) {
  try {
    const options = {
      body: notification.message,
      icon: '/urcare-logo.svg',
      badge: '/urcare-logo.svg',
      tag: notification.id,
      requireInteraction: notification.actionRequired,
      silent: false,
      vibrate: [200, 100, 200],
      data: notification.metadata,
      actions: getNotificationActions(notification)
    };
    
    await self.registration.showNotification(notification.title, options);
    console.log('Notification shown:', notification.title);
  } catch (error) {
    console.error('Failed to show notification:', error);
  }
}

// Get notification actions
function getNotificationActions(notification) {
  const actions = [];
  
  // Add snooze action
  actions.push({
    action: 'snooze',
    title: 'Snooze',
    icon: '/icons/snooze.svg'
  });
  
  // Add type-specific actions
  switch (notification.type) {
    case 'medication':
      actions.push({
        action: 'taken',
        title: 'Taken',
        icon: '/icons/check.svg'
      });
      break;
    case 'exercise':
      actions.push({
        action: 'start',
        title: 'Start',
        icon: '/icons/play.svg'
      });
      break;
    case 'nutrition':
      actions.push({
        action: 'log',
        title: 'Log Meal',
        icon: '/icons/food.svg'
      });
      break;
  }
  
  return actions;
}

// Mark notification as sent
async function markNotificationAsSent(notificationId) {
  try {
    // This would update the database
    // For now, just log it
    console.log('Notification marked as sent:', notificationId);
  } catch (error) {
    console.error('Failed to mark notification as sent:', error);
  }
}

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event.notification.tag);
  
  event.notification.close();
  
  // Handle notification actions
  if (event.action) {
    handleNotificationAction(event.action, event.notification);
  } else {
    // Default click behavior - focus app
    focusApp();
  }
});

// Handle notification actions
function handleNotificationAction(action, notification) {
  console.log('Notification action:', action);
  
  switch (action) {
    case 'snooze':
      handleSnooze(notification);
      break;
    case 'taken':
      handleMedicationTaken(notification);
      break;
    case 'start':
      handleExerciseStart(notification);
      break;
    case 'log':
      handleMealLog(notification);
      break;
  }
}

// Handle snooze action
async function handleSnooze(notification) {
  try {
    // Send message to main app to handle snooze
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'NOTIFICATION_ACTION',
        action: 'snooze',
        notificationId: notification.tag
      });
    });
  } catch (error) {
    console.error('Failed to handle snooze:', error);
  }
}

// Handle medication taken action
async function handleMedicationTaken(notification) {
  try {
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'NOTIFICATION_ACTION',
        action: 'medication_taken',
        notificationId: notification.tag
      });
    });
  } catch (error) {
    console.error('Failed to handle medication taken:', error);
  }
}

// Handle exercise start action
async function handleExerciseStart(notification) {
  try {
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'NOTIFICATION_ACTION',
        action: 'exercise_start',
        notificationId: notification.tag
      });
    });
  } catch (error) {
    console.error('Failed to handle exercise start:', error);
  }
}

// Handle meal log action
async function handleMealLog(notification) {
  try {
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'NOTIFICATION_ACTION',
        action: 'meal_log',
        notificationId: notification.tag
      });
    });
  } catch (error) {
    console.error('Failed to handle meal log:', error);
  }
}

// Focus the app
async function focusApp() {
  try {
    const clients = await self.clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    });
    
    // Find the main app window
    const mainClient = clients.find(client => 
      client.url.includes('/dashboard') || client.url === '/'
    );
    
    if (mainClient) {
      await mainClient.focus();
    } else if (clients.length > 0) {
      await clients[0].focus();
    } else {
      // Open new window if no clients exist
      await self.clients.openWindow('/');
    }
  } catch (error) {
    console.error('Failed to focus app:', error);
  }
}

// Handle push messages
self.addEventListener('push', (event) => {
  console.log('Push message received:', event);
  
  if (event.data) {
    try {
      const notification = event.data.json();
      event.waitUntil(showNotification(notification));
    } catch (error) {
      console.error('Failed to parse push data:', error);
    }
  }
});

// Handle message from main app
self.addEventListener('message', (event) => {
  console.log('Message received in service worker:', event.data);
  
  const { type, data } = event.data;
  
  switch (type) {
    case 'SCHEDULE_PUSH_NOTIFICATION':
      handleScheduleNotification(data);
      break;
    case 'CANCEL_NOTIFICATION':
      handleCancelNotification(data);
      break;
    case 'UPDATE_NOTIFICATION_SETTINGS':
      handleUpdateSettings(data);
      break;
    default:
      console.log('Unknown message type:', type);
  }
});

// Handle scheduling a notification
async function handleScheduleNotification(data) {
  try {
    const { notificationId, notification, scheduledTime } = data;
    
    // Calculate delay
    const now = new Date();
    const scheduled = new Date(scheduledTime);
    const delay = scheduled.getTime() - now.getTime();
    
    if (delay <= 0) {
      // Show immediately
      await showNotification(notification);
    } else {
      // Schedule for later
      setTimeout(async () => {
        await showNotification(notification);
      }, delay);
    }
    
    console.log('Notification scheduled:', notificationId);
  } catch (error) {
    console.error('Failed to schedule notification:', error);
  }
}

// Handle canceling a notification
async function handleCancelNotification(data) {
  try {
    const { notificationId } = data;
    
    // Cancel any pending notifications with this ID
    const notifications = await self.registration.getNotifications();
    notifications.forEach(notification => {
      if (notification.tag === notificationId) {
        notification.close();
      }
    });
    
    console.log('Notification cancelled:', notificationId);
  } catch (error) {
    console.error('Failed to cancel notification:', error);
  }
}

// Handle updating notification settings
async function handleUpdateSettings(data) {
  try {
    const { settings } = data;
    
    // Update notification behavior based on settings
    console.log('Notification settings updated:', settings);
    
    // This could include updating quiet hours, sound settings, etc.
  } catch (error) {
    console.error('Failed to update notification settings:', error);
  }
}

// Periodic background sync (if supported)
if ('periodicSync' in self.registration) {
  self.addEventListener('periodicsync', (event) => {
    console.log('Periodic sync triggered:', event.tag);
    
    if (event.tag === 'health-check') {
      event.waitUntil(performHealthCheck());
    }
  });
}

// Perform periodic health check
async function performHealthCheck() {
  try {
    console.log('Performing periodic health check...');
    
    // Check for missed notifications
    await checkMissedNotifications();
    
    // Sync with server if needed
    await syncWithServer();
    
    console.log('Periodic health check completed');
  } catch (error) {
    console.error('Periodic health check failed:', error);
  }
}

// Check for missed notifications
async function checkMissedNotifications() {
  try {
    // This would check for notifications that should have been sent
    // but were missed due to app being closed
    console.log('Checking for missed notifications...');
  } catch (error) {
    console.error('Failed to check missed notifications:', error);
  }
}

// Sync with server
async function syncWithServer() {
  try {
    // This would sync any local changes with the server
    console.log('Syncing with server...');
  } catch (error) {
    console.error('Failed to sync with server:', error);
  }
}

console.log('UrCare Health Service Worker loaded successfully');
