import { notificationService, HealthNotification } from './notificationService';
import { PersonalizedDailyPlan } from './aiHealthAssistantService';

export interface NotificationSchedule {
  userId: string;
  planId: string;
  date: string;
  notifications: HealthNotification[];
}

export class HealthNotificationScheduler {
  /**
   * Schedule notifications for an entire daily health plan
   */
  static async schedulePlanNotifications(
    userId: string, 
    plan: PersonalizedDailyPlan
  ): Promise<NotificationSchedule> {
    try {
      const notifications: HealthNotification[] = [];
      const today = new Date();
      
      // Schedule notifications for each daily event
      for (const event of plan.dailySchedule) {
        const notification = await this.createEventNotification(userId, plan, event);
        if (notification) {
          notifications.push(notification);
        }
      }
      
      // Schedule medication reminders
      const medicationNotifications = await this.scheduleMedicationNotifications(userId, plan);
      notifications.push(...medicationNotifications);
      
      // Schedule hydration reminders
      const hydrationNotifications = await this.scheduleHydrationNotifications(userId, plan);
      notifications.push(...hydrationNotifications);
      
      // Schedule exercise reminders
      const exerciseNotifications = await this.scheduleExerciseNotifications(userId, plan);
      notifications.push(...exerciseNotifications);
      
      // Schedule meal reminders
      const mealNotifications = await this.scheduleMealNotifications(userId, plan);
      notifications.push(...mealNotifications);
      
      // Schedule lifestyle reminders
      const lifestyleNotifications = await this.scheduleLifestyleNotifications(userId, plan);
      notifications.push(...lifestyleNotifications);
      
      // Schedule all notifications
      for (const notification of notifications) {
        await notificationService.scheduleNotification(notification);
      }
      
      const schedule: NotificationSchedule = {
        userId,
        planId: plan.id || `plan-${Date.now()}`,
        date: today.toISOString().split('T')[0],
        notifications
      };
      
      console.log(`Scheduled ${notifications.length} notifications for user ${userId}`);
      return schedule;
      
    } catch (error) {
      console.error('Failed to schedule plan notifications:', error);
      throw error;
    }
  }

  /**
   * Create notification for a specific daily event
   */
  private static async createEventNotification(
    userId: string,
    plan: PersonalizedDailyPlan,
    event: any
  ): Promise<HealthNotification | null> {
    try {
      const eventTime = new Date(event.time);
      const now = new Date();
      
      // Skip events that have already passed today
      if (eventTime < now) {
        return null;
      }
      
      // Calculate advance notice based on event type
      const advanceNotice = this.getAdvanceNotice(event.type);
      const scheduledTime = new Date(eventTime.getTime() - (advanceNotice * 60 * 1000));
      
      // Skip if scheduled time has passed
      if (scheduledTime <= now) {
        return null;
      }
      
      const notification: Omit<HealthNotification, 'id' | 'status' | 'snoozeCount'> = {
        userId,
        type: this.mapEventTypeToNotificationType(event.type),
        title: this.generateNotificationTitle(event),
        message: this.generateNotificationMessage(event),
        scheduledTime,
        eventTime: event.time,
        category: event.category || event.type,
        priority: this.determinePriority(event),
        actionRequired: this.isActionRequired(event),
        maxSnoozes: 3,
        metadata: {
          planId: plan.id,
          eventId: event.id,
          instructions: event.instructions,
          duration: event.duration,
          calories: event.calories
        }
      };
      
      return notification;
      
    } catch (error) {
      console.error('Failed to create event notification:', error);
      return null;
    }
  }

  /**
   * Schedule medication notifications
   */
  private static async scheduleMedicationNotifications(
    userId: string,
    plan: PersonalizedDailyPlan
  ): Promise<HealthNotification[]> {
    const notifications: HealthNotification[] = [];
    
    try {
      if (!plan.medicationSchedule || plan.medicationSchedule.length === 0) {
        return notifications;
      }
      
      for (const medication of plan.medicationSchedule) {
        const medicationTime = new Date(medication.time);
        const now = new Date();
        
        // Skip if time has passed
        if (medicationTime <= now) continue;
        
        // Schedule 15 minutes before medication time
        const scheduledTime = new Date(medicationTime.getTime() - (15 * 60 * 1000));
        
        if (scheduledTime <= now) continue;
        
        const notification: Omit<HealthNotification, 'id' | 'status' | 'snoozeCount'> = {
          userId,
          type: 'medication',
          title: `Medication Reminder: ${medication.name}`,
          message: `Time to take ${medication.name} - ${medication.dosage}. ${medication.instructions || ''}`,
          scheduledTime,
          eventTime: medication.time,
          category: 'Medication',
          priority: 'high',
          actionRequired: true,
          maxSnoozes: 2,
          metadata: {
            planId: plan.id,
            medicationName: medication.name,
            dosage: medication.dosage,
            instructions: medication.instructions
          }
        };
        
        notifications.push(notification);
      }
      
    } catch (error) {
      console.error('Failed to schedule medication notifications:', error);
    }
    
    return notifications;
  }

  /**
   * Schedule hydration reminders
   */
  private static async scheduleHydrationNotifications(
    userId: string,
    plan: PersonalizedDailyPlan
  ): Promise<HealthNotification[]> {
    const notifications: HealthNotification[] = [];
    
    try {
      const hydrationTarget = plan.detoxSummary?.hydrationTarget || 2000; // ml
      const remindersPerDay = Math.ceil(hydrationTarget / 500); // Remind every 500ml
      
      const startTime = new Date();
      startTime.setHours(8, 0, 0, 0); // Start at 8 AM
      
      const endTime = new Date();
      endTime.setHours(20, 0, 0, 0); // End at 8 PM
      
      const interval = (endTime.getTime() - startTime.getTime()) / remindersPerDay;
      
      for (let i = 0; i < remindersPerDay; i++) {
        const reminderTime = new Date(startTime.getTime() + (interval * i));
        const now = new Date();
        
        if (reminderTime <= now) continue;
        
        const notification: Omit<HealthNotification, 'id' | 'status' | 'snoozeCount'> = {
          userId,
          type: 'detox',
          title: 'Hydration Reminder',
          message: `Time to hydrate! Aim for ${Math.round(hydrationTarget / remindersPerDay)}ml of water.`,
          scheduledTime: reminderTime,
          eventTime: reminderTime.toLocaleTimeString(),
          category: 'Hydration',
          priority: 'medium',
          actionRequired: false,
          maxSnoozes: 2,
          metadata: {
            planId: plan.id,
            instructions: 'Drink water to stay hydrated'
          }
        };
        
        notifications.push(notification);
      }
      
    } catch (error) {
      console.error('Failed to schedule hydration notifications:', error);
    }
    
    return notifications;
  }

  /**
   * Schedule exercise reminders
   */
  private static async scheduleExerciseNotifications(
    userId: string,
    plan: PersonalizedDailyPlan
  ): Promise<HealthNotification[]> {
    const notifications: HealthNotification[] = [];
    
    try {
      if (!plan.exerciseSchedule || plan.exerciseSchedule.length === 0) {
        return notifications;
      }
      
      for (const exercise of plan.exerciseSchedule) {
        const exerciseTime = new Date(exercise.time);
        const now = new Date();
        
        // Skip if time has passed
        if (exerciseTime <= now) continue;
        
        // Schedule 30 minutes before exercise
        const scheduledTime = new Date(exerciseTime.getTime() - (30 * 60 * 1000));
        
        if (scheduledTime <= now) continue;
        
        const notification: Omit<HealthNotification, 'id' | 'status' | 'snoozeCount'> = {
          userId,
          type: 'exercise',
          title: `Exercise Reminder: ${exercise.type}`,
          message: `Get ready for ${exercise.type}! Duration: ${exercise.duration} minutes. ${exercise.instructions || ''}`,
          scheduledTime,
          eventTime: exercise.time,
          category: 'Exercise',
          priority: 'medium',
          actionRequired: true,
          maxSnoozes: 2,
          metadata: {
            planId: plan.id,
            duration: exercise.duration,
            instructions: exercise.instructions
          }
        };
        
        notifications.push(notification);
      }
      
    } catch (error) {
      console.error('Failed to schedule exercise notifications:', error);
    }
    
    return notifications;
  }

  /**
   * Schedule meal reminders
   */
  private static async scheduleMealNotifications(
    userId: string,
    plan: PersonalizedDailyPlan
  ): Promise<HealthNotification[]> {
    const notifications: HealthNotification[] = [];
    
    try {
      if (!plan.nutritionSchedule || plan.nutritionSchedule.length === 0) {
        return notifications;
      }
      
      for (const meal of plan.nutritionSchedule) {
        const mealTime = new Date(meal.time);
        const now = new Date();
        
        // Skip if time has passed
        if (mealTime <= now) continue;
        
        // Schedule 15 minutes before meal
        const scheduledTime = new Date(mealTime.getTime() - (15 * 60 * 1000));
        
        if (scheduledTime <= now) continue;
        
        const notification: Omit<HealthNotification, 'id' | 'status' | 'snoozeCount'> = {
          userId,
          type: 'nutrition',
          title: `Meal Reminder: ${meal.type}`,
          message: `Time for ${meal.type}! Target: ${meal.targetCalories} calories. ${meal.instructions || ''}`,
          scheduledTime,
          eventTime: meal.time,
          category: meal.type,
          priority: 'medium',
          actionRequired: false,
          maxSnoozes: 2,
          metadata: {
            planId: plan.id,
            calories: meal.targetCalories,
            instructions: meal.instructions
          }
        };
        
        notifications.push(notification);
      }
      
    } catch (error) {
      console.error('Failed to schedule meal notifications:', error);
    }
    
    return notifications;
  }

  /**
   * Schedule lifestyle reminders
   */
  private static async scheduleLifestyleNotifications(
    userId: string,
    plan: PersonalizedDailyPlan
  ): Promise<HealthNotification[]> {
    const notifications: HealthNotification[] = [];
    
    try {
      if (!plan.lifestyleSchedule || plan.lifestyleSchedule.length === 0) {
        return notifications;
      }
      
      for (const activity of plan.lifestyleSchedule) {
        const activityTime = new Date(activity.time);
        const now = new Date();
        
        // Skip if time has passed
        if (activityTime <= now) continue;
        
        // Schedule 10 minutes before activity
        const scheduledTime = new Date(activityTime.getTime() - (10 * 60 * 1000));
        
        if (scheduledTime <= now) continue;
        
        const notification: Omit<HealthNotification, 'id' | 'status' | 'snoozeCount'> = {
          userId,
          type: 'lifestyle',
          title: `Lifestyle Reminder: ${activity.type}`,
          message: `Time for ${activity.type}! ${activity.instructions || ''}`,
          scheduledTime,
          eventTime: activity.time,
          category: activity.type,
          priority: 'low',
          actionRequired: false,
          maxSnoozes: 2,
          metadata: {
            planId: plan.id,
            instructions: activity.instructions
          }
        };
        
        notifications.push(notification);
      }
      
    } catch (error) {
      console.error('Failed to schedule lifestyle notifications:', error);
    }
    
    return notifications;
  }

  /**
   * Map event type to notification type
   */
  private static mapEventTypeToNotificationType(eventType: string): HealthNotification['type'] {
    const typeMap: Record<string, HealthNotification['type']> = {
      'breakfast': 'nutrition',
      'lunch': 'nutrition',
      'dinner': 'nutrition',
      'snack': 'nutrition',
      'cardio': 'exercise',
      'strength': 'exercise',
      'yoga': 'exercise',
      'stretching': 'exercise',
      'meditation': 'lifestyle',
      'deep-breathing': 'lifestyle',
      'journaling': 'lifestyle',
      'sleep': 'lifestyle',
      'hydration': 'detox',
      'detox-tea': 'detox',
      'fasting': 'detox'
    };
    
    return typeMap[eventType.toLowerCase()] || 'reminder';
  }

  /**
   * Generate notification title
   */
  private static generateNotificationTitle(event: any): string {
    const eventType = event.type || 'event';
    const category = event.category || eventType;
    
    switch (event.type) {
      case 'breakfast':
      case 'lunch':
      case 'dinner':
      case 'snack':
        return `Meal Time: ${category}`;
      case 'cardio':
      case 'strength':
      case 'yoga':
      case 'stretching':
        return `Exercise: ${category}`;
      case 'meditation':
      case 'deep-breathing':
      case 'journaling':
        return `Wellness: ${category}`;
      case 'hydration':
      case 'detox-tea':
        return `Hydration: ${category}`;
      default:
        return `${category} Reminder`;
    }
  }

  /**
   * Generate notification message
   */
  private static generateNotificationMessage(event: any): string {
    const instructions = event.instructions || '';
    const duration = event.duration ? `Duration: ${event.duration} minutes. ` : '';
    const calories = event.calories ? `Target: ${event.calories} calories. ` : '';
    
    let baseMessage = '';
    
    switch (event.type) {
      case 'breakfast':
      case 'lunch':
      case 'dinner':
      case 'snack':
        baseMessage = `Time for ${event.type}! ${calories}${instructions}`;
        break;
      case 'cardio':
      case 'strength':
      case 'yoga':
      case 'stretching':
        baseMessage = `Time for ${event.type} workout! ${duration}${instructions}`;
        break;
      case 'meditation':
      case 'deep-breathing':
      case 'journaling':
        baseMessage = `Time for ${event.type}! ${duration}${instructions}`;
        break;
      case 'hydration':
      case 'detox-tea':
        baseMessage = `Time to hydrate! ${instructions}`;
        break;
      default:
        baseMessage = `${event.category || event.type} reminder. ${instructions}`;
    }
    
    return baseMessage.trim();
  }

  /**
   * Determine notification priority
   */
  private static determinePriority(event: any): HealthNotification['priority'] {
    // High priority for critical events
    if (event.type === 'medication' || event.type === 'critical-exercise') {
      return 'high';
    }
    
    // Medium priority for important events
    if (['breakfast', 'lunch', 'dinner', 'cardio', 'strength'].includes(event.type)) {
      return 'medium';
    }
    
    // Low priority for optional activities
    return 'low';
  }

  /**
   * Check if event requires action
   */
  private static isActionRequired(event: any): boolean {
    // Medication always requires action
    if (event.type === 'medication') return true;
    
    // Exercise sessions require action
    if (['cardio', 'strength', 'yoga'].includes(event.type)) return true;
    
    // Meals don't require action (just reminders)
    if (['breakfast', 'lunch', 'dinner', 'snack'].includes(event.type)) return false;
    
    // Lifestyle activities are optional
    return false;
  }

  /**
   * Get advance notice time in minutes
   */
  private static getAdvanceNotice(eventType: string): number {
    const noticeMap: Record<string, number> = {
      'medication': 15,      // 15 minutes before
      'breakfast': 15,       // 15 minutes before
      'lunch': 15,          // 15 minutes before
      'dinner': 15,         // 15 minutes before
      'snack': 10,          // 10 minutes before
      'cardio': 30,         // 30 minutes before
      'strength': 30,       // 30 minutes before
      'yoga': 20,           // 20 minutes before
      'stretching': 15,     // 15 minutes before
      'meditation': 10,     // 10 minutes before
      'deep-breathing': 5,  // 5 minutes before
      'journaling': 10,     // 10 minutes before
      'hydration': 0,       // On time
      'detox-tea': 5,       // 5 minutes before
      'sleep': 30           // 30 minutes before
    };
    
    return noticeMap[eventType.toLowerCase()] || 15;
  }

  /**
   * Cancel all notifications for a plan
   */
  static async cancelPlanNotifications(userId: string, planId: string): Promise<void> {
    try {
      // Get all notifications for the plan
      const notifications = await notificationService.getPendingNotifications(userId);
      
      // Cancel notifications that match the plan
      for (const notification of notifications) {
        if (notification.metadata?.planId === planId) {
          await notificationService.cancelNotification(notification.id);
        }
      }
      
      console.log(`Cancelled notifications for plan ${planId}`);
    } catch (error) {
      console.error('Failed to cancel plan notifications:', error);
    }
  }

  /**
   * Update notification schedule for a plan
   */
  static async updatePlanNotifications(
    userId: string,
    oldPlan: PersonalizedDailyPlan,
    newPlan: PersonalizedDailyPlan
  ): Promise<void> {
    try {
      // Cancel old notifications
      await this.cancelPlanNotifications(userId, oldPlan.id || '');
      
      // Schedule new notifications
      await this.schedulePlanNotifications(userId, newPlan);
      
      console.log(`Updated notifications for plan ${newPlan.id}`);
    } catch (error) {
      console.error('Failed to update plan notifications:', error);
    }
  }

  /**
   * Get notification summary for a plan
   */
  static async getPlanNotificationSummary(
    userId: string,
    planId: string
  ): Promise<{
    total: number;
    pending: number;
    acknowledged: number;
    missed: number;
    nextNotification?: HealthNotification;
  }> {
    try {
      const notifications = await notificationService.getPendingNotifications(userId);
      const planNotifications = notifications.filter(n => n.metadata?.planId === planId);
      
      const summary = {
        total: planNotifications.length,
        pending: planNotifications.filter(n => n.status === 'pending').length,
        acknowledged: planNotifications.filter(n => n.status === 'acknowledged').length,
        missed: planNotifications.filter(n => n.status === 'missed').length,
        nextNotification: planNotifications
          .filter(n => n.status === 'pending')
          .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime())[0]
      };
      
      return summary;
    } catch (error) {
      console.error('Failed to get plan notification summary:', error);
      return { total: 0, pending: 0, acknowledged: 0, missed: 0 };
    }
  }
}

export default HealthNotificationScheduler;
