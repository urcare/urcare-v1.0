import { supabase } from '@/integrations/supabase/client';

export interface HealthNotification {
  id: string;
  userId: string;
  type: 'nutrition' | 'exercise' | 'medication' | 'detox' | 'lifestyle' | 'reminder';
  title: string;
  message: string;
  scheduledTime: Date;
  eventTime: string; // e.g., "7:00 AM"
  category: string; // e.g., "Breakfast", "Morning Exercise"
  priority: 'low' | 'medium' | 'high' | 'critical';
  actionRequired: boolean;
  snoozeCount: number;
  maxSnoozes: number;
  status: 'pending' | 'sent' | 'acknowledged' | 'snoozed' | 'missed';
  metadata?: {
    planId?: string;
    eventId?: string;
    instructions?: string;
    duration?: number;
    calories?: number;
    medicationName?: string;
    dosage?: string;
  };
}

export interface NotificationSettings {
  userId: string;
  pushEnabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  quietHours: {
    enabled: boolean;
    start: string; // "22:00"
    end: string;   // "08:00"
  };
  categories: {
    nutrition: boolean;
    exercise: boolean;
    medication: boolean;
    detox: boolean;
    lifestyle: boolean;
    reminders: boolean;
  };
  advanceNotice: {
    nutrition: number; // minutes before event
    exercise: number;
    medication: number;
    detox: number;
    lifestyle: number;
    reminders: number;
  };
  snoozeOptions: number[]; // minutes, e.g., [5, 15, 30, 60]
}

class NotificationService {
  private static instance: NotificationService;
  private notificationWorker: ServiceWorker | null = null;
  private isInitialized = false;
  private backgroundSyncRegistered = false;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Initialize notification service with service worker
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Check if service worker is supported
      if ('serviceWorker' in navigator) {
        // Service worker disabled for now
        // const registration = await navigator.serviceWorker.register('/sw.js');
        this.notificationWorker = registration.active;
        
        // Register background sync for offline support
        if ('sync' in registration) {
          await this.registerBackgroundSync(registration);
        }

        // Request notification permission
        if (Notification.permission === 'default') {
          const permission = await Notification.requestPermission();
          if (permission !== 'granted') {
            console.warn('Notification permission denied');
          }
        }

        this.isInitialized = true;
        console.log('Notification service initialized successfully');
      }
    } catch (error) {
      console.error('Failed to initialize notification service:', error);
    }
  }

  /**
   * Register background sync for offline notification delivery
   */
  private async registerBackgroundSync(registration: ServiceWorkerRegistration): Promise<void> {
    if (this.backgroundSyncRegistered) return;

    try {
      // Register background sync for health notifications
      await registration.sync.register('health-notifications');
      this.backgroundSyncRegistered = true;
      console.log('Background sync registered for health notifications');
    } catch (error) {
      console.warn('Background sync not supported:', error);
    }
  }

  /**
   * Schedule a health notification
   */
  async scheduleNotification(notification: Omit<HealthNotification, 'id' | 'status' | 'snoozeCount'>): Promise<string> {
    try {
      // Save to database
      const { data, error } = await supabase
        .from('health_notifications')
        .insert([{
          ...notification,
          status: 'pending',
          snoozeCount: 0
        }])
        .select()
        .single();

      if (error) throw error;

      const notificationId = data.id;

      // Schedule local notification
      await this.scheduleLocalNotification(notificationId, notification);

      // Schedule push notification if enabled
      if (await this.shouldSendPushNotification(notification.userId)) {
        await this.schedulePushNotification(notificationId, notification);
      }

      return notificationId;
    } catch (error) {
      console.error('Failed to schedule notification:', error);
      throw error;
    }
  }

  /**
   * Schedule local notification using browser APIs
   */
  private async scheduleLocalNotification(notificationId: string, notification: Omit<HealthNotification, 'id' | 'status' | 'snoozeCount'>): Promise<void> {
    try {
      // Calculate delay until notification time
      const now = new Date();
      const scheduledTime = new Date(notification.scheduledTime);
      const delay = scheduledTime.getTime() - now.getTime();

      if (delay <= 0) {
        // Send immediately if time has passed
        this.showLocalNotification(notification);
        return;
      }

      // Schedule for future
      setTimeout(() => {
        this.showLocalNotification(notification);
      }, delay);

    } catch (error) {
      console.error('Failed to schedule local notification:', error);
    }
  }

  /**
   * Schedule push notification through service worker
   */
  private async schedulePushNotification(notificationId: string, notification: Omit<HealthNotification, 'id' | 'status' | 'snoozes'>): Promise<void> {
    if (!this.notificationWorker) return;

    try {
      // Send message to service worker to schedule push notification
      this.notificationWorker.postMessage({
        type: 'SCHEDULE_PUSH_NOTIFICATION',
        notificationId,
        notification,
        scheduledTime: notification.scheduledTime
      });
    } catch (error) {
      console.error('Failed to schedule push notification:', error);
    }
  }

  /**
   * Show local notification immediately
   */
  private showLocalNotification(notification: Omit<HealthNotification, 'id' | 'status' | 'snoozes'>): void {
    try {
      // Check if we can show notifications
      if (Notification.permission !== 'granted') return;

      // Create notification
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/urcare-logo.svg',
        badge: '/urcare-logo.svg',
        tag: notification.id,
        requireInteraction: notification.actionRequired,
        silent: false,
        vibrate: [200, 100, 200], // Vibration pattern
        data: notification.metadata,
        actions: this.getNotificationActions(notification)
      });

      // Handle notification events
      browserNotification.onclick = () => this.handleNotificationClick(notification);
      browserNotification.onclose = () => this.handleNotificationClose(notification);
      browserNotification.onaction = (event) => this.handleNotificationAction(event, notification);

      // Auto-close after 10 seconds unless action required
      if (!notification.actionRequired) {
        setTimeout(() => {
          browserNotification.close();
        }, 10000);
      }

    } catch (error) {
      console.error('Failed to show local notification:', error);
    }
  }

  /**
   * Get notification actions based on type
   */
  private getNotificationActions(notification: Omit<HealthNotification, 'id' | 'status' | 'snoozes'>): NotificationAction[] {
    const actions: NotificationAction[] = [];

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

  /**
   * Handle notification click
   */
  private handleNotificationClick(notification: Omit<HealthNotification, 'id' | 'status' | 'snoozes'>): void {
    try {
      // Focus the app window
      window.focus();
      
      // Navigate to relevant section based on notification type
      this.navigateToRelevantSection(notification);
      
      // Mark as acknowledged
      this.markNotificationAcknowledged(notification.id || '');
      
    } catch (error) {
      console.error('Failed to handle notification click:', error);
    }
  }

  /**
   * Handle notification close
   */
  private handleNotificationClose(notification: Omit<HealthNotification, 'id' | 'status' | 'snoozes'>): void {
    try {
      // Mark as missed if action was required
      if (notification.actionRequired) {
        this.markNotificationMissed(notification.id || '');
      }
    } catch (error) {
      console.error('Failed to handle notification close:', error);
    }
  }

  /**
   * Handle notification action (button clicks)
   */
  private handleNotificationAction(event: NotificationActionEvent, notification: Omit<HealthNotification, 'id' | 'status' | 'snoozes'>): void {
    try {
      const action = event.action;
      
      switch (action) {
        case 'snooze':
          this.snoozeNotification(notification.id || '');
          break;
        case 'taken':
          this.markMedicationTaken(notification.id || '');
          break;
        case 'start':
          this.startExerciseSession(notification.id || '');
          break;
        case 'log':
          this.openMealLogging(notification.id || '');
          break;
      }
      
      // Close the notification
      event.notification.close();
      
    } catch (error) {
      console.error('Failed to handle notification action:', error);
    }
  }

  /**
   * Navigate to relevant section based on notification type
   */
  private navigateToRelevantSection(notification: Omit<HealthNotification, 'id' | 'status' | 'snoozes'>): void {
    // This would integrate with your routing system
    // For now, we'll use a simple approach
    const sectionMap: Record<string, string> = {
      nutrition: '/dashboard?tab=nutrition',
      exercise: '/dashboard?tab=exercise',
      medication: '/dashboard?tab=medication',
      detox: '/dashboard?tab=detox',
      lifestyle: '/dashboard?tab=lifestyle',
      reminder: '/dashboard?tab=overview'
    };

    const targetSection = sectionMap[notification.type] || '/dashboard';
    
    // Navigate to section (you'll need to implement this based on your routing)
    if (window.location.pathname !== targetSection) {
      window.location.href = targetSection;
    }
  }

  /**
   * Snooze a notification
   */
  async snoozeNotification(notificationId: string): Promise<void> {
    try {
      // Get notification details
      const { data: notification } = await supabase
        .from('health_notifications')
        .select('*')
        .eq('id', notificationId)
        .single();

      if (!notification) return;

      // Check if max snoozes reached
      if (notification.snoozeCount >= notification.maxSnoozes) {
        await this.markNotificationMissed(notificationId);
        return;
      }

      // Update snooze count
      await supabase
        .from('health_notifications')
        .update({ 
          snoozeCount: notification.snoozeCount + 1,
          status: 'snoozed'
        })
        .eq('id', notificationId);

      // Reschedule for later (default 15 minutes)
      const snoozeTime = new Date();
      snoozeTime.setMinutes(snoozeTime.getMinutes() + 15);

      const snoozedNotification = {
        ...notification,
        scheduledTime: snoozeTime,
        status: 'pending'
      };

      await this.scheduleNotification(snoozedNotification);

    } catch (error) {
      console.error('Failed to snooze notification:', error);
    }
  }

  /**
   * Mark notification as acknowledged
   */
  async markNotificationAcknowledged(notificationId: string): Promise<void> {
    try {
      await supabase
        .from('health_notifications')
        .update({ status: 'acknowledged' })
        .eq('id', notificationId);
    } catch (error) {
      console.error('Failed to mark notification acknowledged:', error);
    }
  }

  /**
   * Mark notification as missed
   */
  async markNotificationMissed(notificationId: string): Promise<void> {
    try {
      await supabase
        .from('health_notifications')
        .update({ status: 'missed' })
        .eq('id', notificationId);
    } catch (error) {
      console.error('Failed to mark notification missed:', error);
    }
  }

  /**
   * Mark medication as taken
   */
  async markMedicationTaken(notificationId: string): Promise<void> {
    try {
      // Mark notification as acknowledged
      await this.markNotificationAcknowledged(notificationId);
      
      // Log medication taken (you can extend this based on your needs)
      console.log('Medication marked as taken for notification:', notificationId);
      
    } catch (error) {
      console.error('Failed to mark medication taken:', error);
    }
  }

  /**
   * Start exercise session
   */
  async startExerciseSession(notificationId: string): Promise<void> {
    try {
      // Mark notification as acknowledged
      await this.markNotificationAcknowledged(notificationId);
      
      // Start exercise tracking (you can extend this based on your needs)
      console.log('Exercise session started for notification:', notificationId);
      
    } catch (error) {
      console.error('Failed to start exercise session:', error);
    }
  }

  /**
   * Open meal logging
   */
  async openMealLogging(notificationId: string): Promise<void> {
    try {
      // Mark notification as acknowledged
      await this.markNotificationAcknowledged(notificationId);
      
      // Open meal logging interface (you can extend this based on your needs)
      console.log('Meal logging opened for notification:', notificationId);
      
    } catch (error) {
      console.error('Failed to open meal logging:', error);
    }
  }

  /**
   * Check if push notifications should be sent
   */
  private async shouldSendPushNotification(userId: string): Promise<boolean> {
    try {
      const { data: settings } = await supabase
        .from('notification_settings')
        .select('push_enabled, quiet_hours')
        .eq('user_id', userId)
        .single();

      if (!settings?.push_enabled) return false;

      // Check quiet hours
      if (settings.quiet_hours?.enabled) {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTime = currentHour * 60 + currentMinute;

        const [startHour, startMinute] = settings.quiet_hours.start.split(':').map(Number);
        const [endHour, endMinute] = settings.quiet_hours.end.split(':').map(Number);
        const startTime = startHour * 60 + startMinute;
        const endTime = endHour * 60 + endMinute;

        if (startTime <= endTime) {
          // Same day quiet hours
          if (currentTime >= startTime && currentTime <= endTime) return false;
        } else {
          // Overnight quiet hours
          if (currentTime >= startTime || currentTime <= endTime) return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Failed to check push notification settings:', error);
      return false;
    }
  }

  /**
   * Get user's notification settings
   */
  async getNotificationSettings(userId: string): Promise<NotificationSettings | null> {
    try {
      const { data, error } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to get notification settings:', error);
      return null;
    }
  }

  /**
   * Update user's notification settings
   */
  async updateNotificationSettings(userId: string, settings: Partial<NotificationSettings>): Promise<void> {
    try {
      const { error } = await supabase
        .from('notification_settings')
        .upsert([{ user_id: userId, ...settings }]);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to update notification settings:', error);
      throw error;
    }
  }

  /**
   * Get pending notifications for a user
   */
  async getPendingNotifications(userId: string): Promise<HealthNotification[]> {
    try {
      const { data, error } = await supabase
        .from('health_notifications')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'pending')
        .gte('scheduled_time', new Date().toISOString())
        .order('scheduled_time', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to get pending notifications:', error);
      return [];
    }
  }

  /**
   * Cancel a scheduled notification
   */
  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await supabase
        .from('health_notifications')
        .update({ status: 'cancelled' })
        .eq('id', notificationId);
    } catch (error) {
      console.error('Failed to cancel notification:', error);
    }
  }

  /**
   * Clear all notifications for a user
   */
  async clearAllNotifications(userId: string): Promise<void> {
    try {
      await supabase
        .from('health_notifications')
        .update({ status: 'cleared' })
        .eq('user_id', userId);
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  }

  /**
   * Test notification (for development/testing)
   */
  async testNotification(userId: string): Promise<void> {
    const testNotification: Omit<HealthNotification, 'id' | 'status' | 'snoozeCount'> = {
      userId,
      type: 'reminder',
      title: 'Test Notification',
      message: 'This is a test notification from UrCare',
      scheduledTime: new Date(),
      eventTime: new Date().toLocaleTimeString(),
      category: 'Test',
      priority: 'medium',
      actionRequired: false,
      maxSnoozes: 3
    };

    await this.scheduleNotification(testNotification);
  }
}

export const notificationService = NotificationService.getInstance();
export default NotificationService;
