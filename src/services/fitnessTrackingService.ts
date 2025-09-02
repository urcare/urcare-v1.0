// Web-compatible fitness tracking service for UrCare dashboard
import { StepCounterService, UserFitnessProfile, DailyStats } from './stepCounterService';
import { GPSTrackingService, ActivityRoute } from './gpsTrackingService';
import { supabase } from '../integrations/supabase/client';

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
  private onSessionUpdate?: (session: FitnessSession | null) => void;

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

  // Initialize the service
  public async initialize(userProfile: UserFitnessProfile): Promise<void> {
    try {
      await this.stepCounter.initialize(userProfile);
      await this.gpsTracker.initialize();
      
      // Set up callbacks
      this.stepCounter.setStepUpdateCallback((steps) => {
        this.onStepUpdate(steps);
      });
      
      // Set up midnight reset
      if (this.config.midnightReset) {
        this.setupMidnightReset();
      }
      
      console.log('Fitness tracking service initialized for web');
    } catch (error) {
      console.error('Failed to initialize fitness tracking service:', error);
      throw error;
    }
  }

  // Start tracking fitness activity
  public async startTracking(activityType: 'walking' | 'running' | 'cycling' | 'hiking'): Promise<void> {
    if (this.isTracking) return;
    
    this.isTracking = true;
    
    // Create new session
    this.currentSession = {
      id: `session-${Date.now()}`,
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
    
    // Start GPS tracking if enabled
    if (this.config.enableGPSTracking) {
      await this.gpsTracker.startRouteTracking();
    }
    
    console.log(`Started tracking ${activityType} activity`);
  }

  // Stop tracking
  public async stopTracking(): Promise<FitnessSession | null> {
    if (!this.isTracking) return null;
    
    this.isTracking = false;
    
    // Stop step counting
    if (this.config.enableStepCounting) {
      await this.stepCounter.stopTracking();
    }
    
    // Stop GPS tracking
    if (this.config.enableGPSTracking) {
      await this.gpsTracker.stopRouteTracking();
    }
    
    // Complete session
    if (this.currentSession) {
      this.currentSession.endTime = Date.now();
      this.currentSession.duration = this.currentSession.endTime - this.currentSession.startTime;
      
      // Get final stats
      const currentStats = this.stepCounter.getCurrentStats();
      if (currentStats) {
        this.currentSession.totalSteps = currentStats.steps;
        this.currentSession.totalDistance = currentStats.distance;
        this.currentSession.totalCalories = currentStats.calories;
        this.currentSession.averagePace = currentStats.pace;
      }
      
      // Get GPS route
      const route = this.gpsTracker.getCurrentRoute();
      if (route) {
        this.currentSession.gpsRoute = route;
      }
      
      // Save session
      await this.saveSession(this.currentSession);
      
      const completedSession = this.currentSession;
      this.currentSession = null;
      
      console.log('Fitness tracking stopped');
      return completedSession;
    }
    
    return null;
  }

  // Pause tracking
  public async pauseTracking(): Promise<void> {
    if (!this.isTracking) return;
    
    // Pause step counting
    if (this.config.enableStepCounting) {
      await this.stepCounter.stopTracking();
    }
    
    console.log('Fitness tracking paused');
  }

  // Resume tracking
  public async resumeTracking(): Promise<void> {
    if (!this.isTracking) return;
    
    // Resume step counting
    if (this.config.enableStepCounting) {
      await this.stepCounter.startTracking();
    }
    
    console.log('Fitness tracking resumed');
  }

  // Handle step updates
  private onStepUpdate(steps: number): void {
    if (this.currentSession) {
      this.currentSession.totalSteps = steps;
      
      // Update session data
      this.currentSession.stepData.push({
        timestamp: Date.now(),
        steps,
        distance: steps * 0.7, // Approximate step length
        calories: steps * 0.04 // Approximate calories per step
      });
      
      // Notify UI
      if (this.onSessionUpdate) {
        this.onSessionUpdate(this.currentSession);
      }
    }
  }

  // Handle location updates
  private onLocationUpdate(location: any): void {
    // Handle GPS location updates
    console.log('Location update received:', location);
  }

  // Calculate session statistics
  private calculateSessionStats(session: FitnessSession): void {
    if (session.stepData.length === 0) return;
    
    const totalSteps = session.stepData[session.stepData.length - 1].steps;
    const totalDistance = session.stepData[session.stepData.length - 1].distance;
    const totalCalories = session.stepData[session.stepData.length - 1].calories;
    
    session.totalSteps = totalSteps;
    session.totalDistance = totalDistance;
    session.totalCalories = totalCalories;
    
    // Calculate average pace
    if (session.duration > 0) {
      const durationInMinutes = session.duration / 60000;
      session.averagePace = totalSteps / durationInMinutes;
    }
  }

  // Get current session
  public getCurrentSession(): FitnessSession | null {
    return this.currentSession;
  }

  // Get current stats
  public getCurrentStats(): {
    steps: number;
    distance: number;
    calories: number;
    duration: number;
    pace: number;
  } | null {
    return this.stepCounter.getCurrentStats();
  }

  // Get daily stats
  public async getDailyStats(): Promise<DailyStats | null> {
    return this.stepCounter.getDailyStats();
  }

  // Get weekly stats
  public async getWeeklyStats(): Promise<WeeklyStats | null> {
    // For web, return mock weekly stats
    const today = new Date();
    const weekStart = new Date(today.getTime() - (today.getDay() * 24 * 60 * 60 * 1000));
    
    return {
      weekStart: weekStart.toISOString().split('T')[0],
      weekEnd: today.toISOString().split('T')[0],
      totalSteps: 45000,
      totalDistance: 32.5,
      totalCalories: 1800,
      averageDailySteps: 6428,
      averageDailyDistance: 4.6,
      averageDailyCalories: 257,
      activeDays: 7,
      longestSession: 45,
      fastestPace: 120
    };
  }

  // Get monthly stats
  public async getMonthlyStats(): Promise<MonthlyStats | null> {
    // For web, return mock monthly stats
    const today = new Date();
    const month = today.toISOString().slice(0, 7); // YYYY-MM format
    
    return {
      month,
      totalSteps: 180000,
      totalDistance: 130.0,
      totalCalories: 7200,
      averageDailySteps: 6000,
      averageDailyDistance: 4.3,
      averageDailyCalories: 240,
      activeDays: 25,
      totalSessions: 30,
      averageSessionDuration: 35,
      topActivities: [
        { type: 'walking', count: 20, totalDistance: 80.0 },
        { type: 'running', count: 8, totalDistance: 40.0 },
        { type: 'cycling', count: 2, totalDistance: 10.0 }
      ]
    };
  }

  // Update configuration
  public updateConfig(newConfig: Partial<FitnessTrackingConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // Apply new configuration
  public async applyNewConfig(): Promise<void> {
    // Apply configuration changes
    if (this.config.enableStepCounting && !this.isTracking) {
      // Reinitialize step counter if needed
    }
    
    if (this.config.enableGPSTracking && !this.isTracking) {
      // Reinitialize GPS tracker if needed
    }
  }

  // Set up data synchronization
  private setupDataSync(): void {
    if (this.dataSyncInterval) {
      clearInterval(this.dataSyncInterval);
    }
    
    this.dataSyncInterval = setInterval(async () => {
      await this.syncData();
    }, this.config.dataSyncInterval * 60 * 1000);
  }

  // Set up midnight reset
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
    setTimeout(() => {
      this.resetDailyCounters();
      this.setupMidnightReset(); // Set up for next day
    }, timeUntilMidnight);
  }

  // Reset daily counters
  private async resetDailyCounters(): Promise<void> {
    await this.stepCounter.resetDailyCounter();
    console.log('Daily counters reset at midnight');
  }

  // Sync data with backend
  private async syncData(): Promise<void> {
    try {
      // Sync daily stats
      const dailyStats = await this.stepCounter.getDailyStats();
      if (dailyStats) {
        // Save to Supabase
        const { error } = await supabase
          .from('daily_fitness_stats')
          .upsert(dailyStats, { onConflict: 'date' });
        
        if (error) {
          console.error('Error syncing daily stats:', error);
        }
      }
      
      console.log('Data synced with backend');
    } catch (error) {
      console.error('Failed to sync data:', error);
    }
  }

  // Save fitness session
  private async saveSession(session: FitnessSession): Promise<void> {
    try {
      const { error } = await supabase
        .from('fitness_sessions')
        .insert(session);
      
      if (error) {
        console.error('Error saving session:', error);
      }
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  }

  // Get current user ID
  private async getCurrentUserId(): Promise<string> {
    // For web, return a mock user ID
    // In a real app, this would come from authentication context
    return 'web-user-123';
  }

  // Cleanup resources
  public async cleanup(): Promise<void> {
    if (this.dataSyncInterval) {
      clearInterval(this.dataSyncInterval);
    }
    
    if (this.midnightResetInterval) {
      clearInterval(this.midnightResetInterval);
    }
    
    await this.stopTracking();
  }
}
