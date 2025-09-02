import { Platform } from 'react-native';
import { StepCounterService, UserFitnessProfile, DailyStats } from './stepCounterService';
import { GPSTrackingService, ActivityRoute } from './gpsTrackingService';
import { supabase } from '../integrations/supabase';

export interface FitnessTrackingConfig {
  enableStepCounting: boolean;
  enableGPSTracking: boolean;
  autoStartTracking: boolean;
  backgroundTracking: boolean;
  batteryOptimization: boolean;
  dataSyncInterval: number; // minutes
  midnightReset: boolean;
}

export interface FitnessSession {
  id: string;
  userId: string;
  startTime: number;
  endTime?: number;
  duration: number;
  totalSteps: number;
  totalDistance: number;
  totalCalories: number;
  averagePace: number;
  maxPace: number;
  activityType: 'walking' | 'running' | 'cycling' | 'hiking' | 'mixed';
  gpsRoute?: ActivityRoute;
  stepData: {
    timestamp: number;
    steps: number;
    distance: number;
    calories: number;
  }[];
  weather?: {
    temperature: number;
    humidity: number;
    conditions: string;
  };
}

export interface WeeklyStats {
  weekStart: string;
  weekEnd: string;
  totalSteps: number;
  totalDistance: number;
  totalCalories: number;
  averageDailySteps: number;
  averageDailyDistance: number;
  averageDailyCalories: number;
  activeDays: number;
  longestSession: number;
  fastestPace: number;
}

export interface MonthlyStats {
  month: string;
  totalSteps: number;
  totalDistance: number;
  totalCalories: number;
  averageDailySteps: number;
  averageDailyDistance: number;
  averageDailyCalories: number;
  activeDays: number;
  totalSessions: number;
  averageSessionDuration: number;
  topActivities: Array<{
    type: string;
    count: number;
    totalDistance: number;
  }>;
}

export class FitnessTrackingService {
  private static instance: FitnessTrackingService;
  private stepCounter: StepCounterService;
  private gpsTracker: GPSTrackingService;
  private config: FitnessTrackingConfig;
  private currentSession: FitnessSession | null = null;
  private isTracking: boolean = false;
  private dataSyncInterval: NodeJS.Timeout | null = null;
  private midnightResetInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.stepCounter = StepCounterService.getInstance();
    this.gpsTracker = GPSTrackingService.getInstance();
    
    this.config = {
      enableStepCounting: true,
      enableGPSTracking: true,
      autoStartTracking: false,
      backgroundTracking: true,
      batteryOptimization: true,
      dataSyncInterval: 15, // 15 minutes
      midnightReset: true
    };
  }

  public static getInstance(): FitnessTrackingService {
    if (!FitnessTrackingService.instance) {
      FitnessTrackingService.instance = new FitnessTrackingService();
    }
    return FitnessTrackingService.instance;
  }

  // Initialize the fitness tracking system
  public async initialize(userProfile: UserFitnessProfile): Promise<void> {
    try {
      // Initialize step counter
      if (this.config.enableStepCounting) {
        await this.stepCounter.initialize(userProfile);
        
        // Set up step update callback
        this.stepCounter.onStepUpdate = (stats) => {
          this.onStepUpdate(stats);
        };
      }

      // Initialize GPS tracker
      if (this.config.enableGPSTracking) {
        await this.gpsTracker.initialize();
        
        // Set up location update callback
        this.gpsTracker.onLocationUpdate = (location) => {
          this.onLocationUpdate(location);
        };
      }

      // Set up data synchronization
      this.setupDataSync();

      // Set up midnight reset
      if (this.config.midnightReset) {
        this.setupMidnightReset();
      }

      // Auto-start tracking if enabled
      if (this.config.autoStartTracking) {
        await this.startTracking();
      }

      console.log('Fitness tracking system initialized successfully');
    } catch (error) {
      console.error('Failed to initialize fitness tracking system:', error);
      throw error;
    }
  }

  // Start fitness tracking
  public async startTracking(activityType: 'walking' | 'running' | 'cycling' | 'hiking' = 'walking'): Promise<void> {
    if (this.isTracking) {
      console.warn('Fitness tracking already active');
      return;
    }

    try {
      // Create new session
      this.currentSession = {
        id: `session_${Date.now()}`,
        userId: await this.getCurrentUserId(),
        startTime: Date.now(),
        duration: 0,
        totalSteps: 0,
        totalDistance: 0,
        totalCalories: 0,
        averagePace: 0,
        maxPace: 0,
        activityType,
        stepData: []
      };

      // Start step counting
      if (this.config.enableStepCounting) {
        await this.stepCounter.startTracking();
      }

      // Start GPS tracking
      if (this.config.enableGPSTracking) {
        await this.gpsTracker.startRouteTracking(
          this.currentSession.userId,
          activityType
        );
      }

      this.isTracking = true;
      console.log(`Fitness tracking started for ${activityType}`);
    } catch (error) {
      console.error('Failed to start fitness tracking:', error);
      throw error;
    }
  }

  // Stop fitness tracking
  public async stopTracking(): Promise<FitnessSession | null> {
    if (!this.isTracking || !this.currentSession) {
      return null;
    }

    try {
      // Stop step counting
      if (this.config.enableStepCounting) {
        await this.stepCounter.stopTracking();
      }

      // Stop GPS tracking
      if (this.config.enableGPSTracking) {
        const gpsRoute = await this.gpsTracker.stopRouteTracking();
        if (gpsRoute) {
          this.currentSession.gpsRoute = gpsRoute;
        }
      }

      // Finalize session
      this.currentSession.endTime = Date.now();
      this.currentSession.duration = this.currentSession.endTime - this.currentSession.startTime;
      
      // Calculate final statistics
      this.calculateSessionStats();

      // Save session
      await this.saveSession(this.currentSession);

      const completedSession = this.currentSession;
      this.currentSession = null;
      this.isTracking = false;

      console.log('Fitness tracking stopped, session saved');
      return completedSession;
    } catch (error) {
      console.error('Failed to stop fitness tracking:', error);
      throw error;
    }
  }

  // Pause tracking temporarily
  public async pauseTracking(): Promise<void> {
    if (!this.isTracking) return;

    try {
      if (this.config.enableStepCounting) {
        // Note: Step counter doesn't have pause functionality
        // We'll just mark the session as paused
        console.log('Step counting paused (will continue in background)');
      }

      if (this.config.enableGPSTracking) {
        await this.gpsTracker.pauseTracking();
      }

      console.log('Fitness tracking paused');
    } catch (error) {
      console.error('Failed to pause fitness tracking:', error);
    }
  }

  // Resume tracking
  public async resumeTracking(): Promise<void> {
    if (!this.isTracking) return;

    try {
      if (this.config.enableGPSTracking) {
        await this.gpsTracker.resumeTracking();
      }

      console.log('Fitness tracking resumed');
    } catch (error) {
      console.error('Failed to resume fitness tracking:', error);
    }
  }

  // Handle step updates
  private onStepUpdate(stats: { steps: number; distance: number; calories: number }): void {
    if (!this.currentSession) return;

    // Update session data
    this.currentSession.totalSteps = stats.steps;
    this.currentSession.totalDistance = stats.distance;
    this.currentSession.totalCalories = stats.calories;

    // Add to step data history
    this.currentSession.stepData.push({
      timestamp: Date.now(),
      steps: stats.steps,
      distance: stats.distance,
      calories: stats.calories
    });

    // Emit session update event
    this.emitSessionUpdate();
  }

  // Handle location updates
  private onLocationUpdate(location: any): void {
    if (!this.currentSession) return;

    // GPS updates are handled by the GPS tracker
    // We just need to sync the route data
    const routeStats = this.gpsTracker.getRouteStats();
    if (routeStats) {
      this.currentSession.totalDistance = routeStats.distance;
      this.currentSession.averagePace = routeStats.averageSpeed;
    }

    // Emit session update event
    this.emitSessionUpdate();
  }

  // Calculate final session statistics
  private calculateSessionStats(): void {
    if (!this.currentSession) return;

    // Calculate average pace
    if (this.currentSession.duration > 0) {
      this.currentSession.averagePace = 
        this.currentSession.totalDistance / (this.currentSession.duration / 1000);
    }

    // Calculate max pace from step data
    if (this.currentSession.stepData.length > 1) {
      let maxPace = 0;
      for (let i = 1; i < this.currentSession.stepData.length; i++) {
        const timeDiff = this.currentSession.stepData[i].timestamp - 
                        this.currentSession.stepData[i - 1].timestamp;
        const distanceDiff = this.currentSession.stepData[i].distance - 
                           this.currentSession.stepData[i - 1].distance;
        
        if (timeDiff > 0) {
          const pace = distanceDiff / (timeDiff / 1000);
          maxPace = Math.max(maxPace, pace);
        }
      }
      this.currentSession.maxPace = maxPace;
    }
  }

  // Get current session
  public getCurrentSession(): FitnessSession | null {
    return this.currentSession;
  }

  // Check if tracking is active
  public isActive(): boolean {
    return this.isTracking;
  }

  // Get current statistics
  public getCurrentStats(): {
    steps: number;
    distance: number;
    calories: number;
    duration: number;
    pace: number;
  } | null {
    if (!this.currentSession) return null;

    const currentTime = Date.now();
    const duration = currentTime - this.currentSession.startTime;

    return {
      steps: this.currentSession.totalSteps,
      distance: this.currentSession.totalDistance,
      calories: this.currentSession.totalCalories,
      duration,
      pace: duration > 0 ? this.currentSession.totalDistance / (duration / 1000) : 0
    };
  }

  // Get daily statistics
  public async getDailyStats(date?: string): Promise<DailyStats | null> {
    if (this.config.enableStepCounting) {
      return this.stepCounter.getCurrentStats();
    }
    return null;
  }

  // Get weekly statistics
  public async getWeeklyStats(weekStart?: string): Promise<WeeklyStats | null> {
    try {
      const startDate = weekStart || this.getWeekStartDate();
      const endDate = this.getWeekEndDate(startDate);

      const { data, error } = await supabase
        .from('fitness_sessions')
        .select('*')
        .gte('startTime', new Date(startDate).getTime())
        .lte('startTime', new Date(endDate).getTime());

      if (error) {
        console.error('Error fetching weekly stats:', error);
        return null;
      }

      return this.calculateWeeklyStats(data || [], startDate, endDate);
    } catch (error) {
      console.error('Failed to get weekly stats:', error);
      return null;
    }
  }

  // Get monthly statistics
  public async getMonthlyStats(month?: string): Promise<MonthlyStats | null> {
    try {
      const monthStr = month || this.getCurrentMonth();
      const startDate = new Date(monthStr + '-01');
      const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

      const { data, error } = await supabase
        .from('fitness_sessions')
        .select('*')
        .gte('startTime', startDate.getTime())
        .lte('startTime', endDate.getTime());

      if (error) {
        console.error('Error fetching monthly stats:', error);
        return null;
      }

      return this.calculateMonthlyStats(data || [], monthStr);
    } catch (error) {
      console.error('Failed to get monthly stats:', error);
      return null;
    }
  }

  // Calculate weekly statistics
  private calculateWeeklyStats(
    sessions: any[],
    weekStart: string,
    weekEnd: string
  ): WeeklyStats {
    let totalSteps = 0;
    let totalDistance = 0;
    let totalCalories = 0;
    let activeDays = new Set<string>();
    let longestSession = 0;
    let fastestPace = 0;

    sessions.forEach(session => {
      totalSteps += session.totalSteps || 0;
      totalDistance += session.totalDistance || 0;
      totalCalories += session.totalCalories || 0;
      
      const sessionDate = new Date(session.startTime).toISOString().split('T')[0];
      activeDays.add(sessionDate);
      
      if (session.duration > longestSession) {
        longestSession = session.duration;
      }
      
      if (session.averagePace > fastestPace) {
        fastestPace = session.averagePace;
      }
    });

    const daysInWeek = 7;
    const activeDaysCount = activeDays.size;

    return {
      weekStart,
      weekEnd,
      totalSteps,
      totalDistance,
      totalCalories,
      averageDailySteps: activeDaysCount > 0 ? totalSteps / activeDaysCount : 0,
      averageDailyDistance: activeDaysCount > 0 ? totalDistance / activeDaysCount : 0,
      averageDailyCalories: activeDaysCount > 0 ? totalCalories / activeDaysCount : 0,
      activeDays: activeDaysCount,
      longestSession,
      fastestPace
    };
  }

  // Calculate monthly statistics
  private calculateMonthlyStats(sessions: any[], month: string): MonthlyStats {
    let totalSteps = 0;
    let totalDistance = 0;
    let totalCalories = 0;
    let activeDays = new Set<string>();
    let totalSessions = sessions.length;
    let totalDuration = 0;
    let activityCounts: { [key: string]: { count: number; distance: number } } = {};

    sessions.forEach(session => {
      totalSteps += session.totalSteps || 0;
      totalDistance += session.totalDistance || 0;
      totalCalories += session.totalCalories || 0;
      totalDuration += session.duration || 0;
      
      const sessionDate = new Date(session.startTime).toISOString().split('T')[0];
      activeDays.add(sessionDate);
      
      const activityType = session.activityType || 'unknown';
      if (!activityCounts[activityType]) {
        activityCounts[activityType] = { count: 0, distance: 0 };
      }
      activityCounts[activityType].count++;
      activityCounts[activityType].distance += session.totalDistance || 0;
    });

    const activeDaysCount = activeDays.size;
    const daysInMonth = new Date(month + '-01').getMonth() === 11 ? 31 : 30;

    // Convert activity counts to top activities array
    const topActivities = Object.entries(activityCounts)
      .map(([type, data]) => ({
        type,
        count: data.count,
        totalDistance: data.distance
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      month,
      totalSteps,
      totalDistance,
      totalCalories,
      averageDailySteps: activeDaysCount > 0 ? totalSteps / activeDaysCount : 0,
      averageDailyDistance: activeDaysCount > 0 ? totalDistance / activeDaysCount : 0,
      averageDailyCalories: activeDaysCount > 0 ? totalCalories / activeDaysCount : 0,
      activeDays: activeDaysCount,
      totalSessions,
      averageSessionDuration: totalSessions > 0 ? totalDuration / totalSessions : 0,
      topActivities
    };
  }

  // Update configuration
  public updateConfig(config: Partial<FitnessTrackingConfig>): void {
    this.config = { ...this.config, ...config };
    
    // Apply new configuration
    this.applyNewConfig();
  }

  // Apply new configuration
  private applyNewConfig(): void {
    // Update data sync interval
    if (this.dataSyncInterval) {
      clearInterval(this.dataSyncInterval);
      this.setupDataSync();
    }

    // Update midnight reset
    if (this.midnightResetInterval) {
      clearInterval(this.midnightResetInterval);
      if (this.config.midnightReset) {
        this.setupMidnightReset();
      }
    }
  }

  // Get configuration
  public getConfig(): FitnessTrackingConfig {
    return { ...this.config };
  }

  // Setup data synchronization
  private setupDataSync(): void {
    if (this.dataSyncInterval) {
      clearInterval(this.dataSyncInterval);
    }

    this.dataSyncInterval = setInterval(async () => {
      await this.syncData();
    }, this.config.dataSyncInterval * 60 * 1000);
  }

  // Setup midnight reset
  private setupMidnightReset(): void {
    if (this.midnightResetInterval) {
      clearInterval(this.midnightResetInterval);
    }

    // Calculate time until next midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();

    // Set timeout for midnight reset
    setTimeout(async () => {
      await this.resetDailyCounters();
      
      // Set up daily reset
      this.midnightResetInterval = setInterval(async () => {
        await this.resetDailyCounters();
      }, 24 * 60 * 60 * 1000); // 24 hours
    }, timeUntilMidnight);
  }

  // Reset daily counters
  private async resetDailyCounters(): Promise<void> {
    try {
      if (this.config.enableStepCounting) {
        await this.stepCounter.resetDailyCounter();
      }

      console.log('Daily counters reset at midnight');
    } catch (error) {
      console.error('Failed to reset daily counters:', error);
    }
  }

  // Synchronize data with backend
  private async syncData(): Promise<void> {
    try {
      // Sync step counter data
      if (this.config.enableStepCounting) {
        // Data is already synced in real-time
        console.log('Step counter data synced');
      }

      // Sync GPS tracking data
      if (this.config.enableGPSTracking) {
        // Data is already synced in real-time
        console.log('GPS tracking data synced');
      }

      console.log('Fitness data synchronized successfully');
    } catch (error) {
      console.error('Failed to sync fitness data:', error);
    }
  }

  // Save session to database
  private async saveSession(session: FitnessSession): Promise<void> {
    try {
      const { error } = await supabase
        .from('fitness_sessions')
        .insert(session);

      if (error) {
        console.error('Error saving fitness session:', error);
      }
    } catch (error) {
      console.error('Failed to save fitness session:', error);
    }
  }

  // Get current user ID
  private async getCurrentUserId(): Promise<string> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user?.id || 'anonymous';
    } catch (error) {
      console.error('Failed to get current user ID:', error);
      return 'anonymous';
    }
  }

  // Utility functions for date calculations
  private getWeekStartDate(): string {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Monday is 1, Sunday is 0
    
    const monday = new Date(now);
    monday.setDate(now.getDate() - daysToSubtract);
    monday.setHours(0, 0, 0, 0);
    
    return monday.toISOString().split('T')[0];
  }

  private getWeekEndDate(weekStart: string): string {
    const startDate = new Date(weekStart);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);
    
    return endDate.toISOString().split('T')[0];
  }

  private getCurrentMonth(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  // Emit session update event
  private emitSessionUpdate(): void {
    // This would use an event emitter or callback system
    if (this.onSessionUpdate) {
      this.onSessionUpdate(this.currentSession);
    }
  }

  // Callback for session updates
  public onSessionUpdate?: (session: FitnessSession | null) => void;

  // Cleanup resources
  public async cleanup(): Promise<void> {
    if (this.isTracking) {
      await this.stopTracking();
    }

    if (this.dataSyncInterval) {
      clearInterval(this.dataSyncInterval);
    }

    if (this.midnightResetInterval) {
      clearInterval(this.midnightResetInterval);
    }

    await this.stepCounter.cleanup();
    await this.gpsTracker.cleanup();

    this.currentSession = null;
    this.isTracking = false;
  }
}
