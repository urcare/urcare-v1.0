// Web-compatible step counter service for UrCare dashboard
import { supabase } from '../integrations/supabase/client';

// Core interfaces for step tracking
export interface StepData {
  timestamp: number;
  steps: number;
  distance: number;
  calories: number;
  gpsRoute?: GPSPoint[];
  activityType: 'walking' | 'running' | 'idle';
  confidence: number;
}

export interface GPSPoint {
  latitude: number;
  longitude: number;
  timestamp: number;
  accuracy: number;
}

export interface DailyStats {
  date: string;
  totalSteps: number;
  totalDistance: number;
  totalCalories: number;
  averagePace: number;
  activeTime: number;
  gpsRoute: GPSPoint[];
  stepHistory: StepData[];
}

export interface UserFitnessProfile {
  weight: number; // kg
  height: number; // cm
  age: number;
  gender: 'male' | 'female';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  customStepLength?: number; // cm, optional custom override
}

export interface StepDetectionConfig {
  accelerationThreshold: number; // m/s²
  gyroscopeThreshold: number; // rad/s
  peakDetectionWindow: number; // ms
  minStepInterval: number; // ms
  confidenceThreshold: number; // 0-1
  noiseFilterStrength: number; // 0-1
}

export class StepCounterService {
  private static instance: StepCounterService;
  private isTracking: boolean = false;
  private currentSteps: number = 0;
  private dailyStats: DailyStats | null = null;
  private userProfile: UserFitnessProfile | null = null;
  private stepLength: number = 0.7; // Default 70cm
  private trackingInterval: NodeJS.Timeout | null = null;
  private onStepUpdate?: (steps: number) => void;

  private constructor() {}

  public static getInstance(): StepCounterService {
    if (!StepCounterService.instance) {
      StepCounterService.instance = new StepCounterService();
    }
    return StepCounterService.instance;
  }

  // Initialize the service with user profile
  public async initialize(userProfile: UserFitnessProfile): Promise<void> {
    this.userProfile = userProfile;
    this.calculateStepLength();
    await this.loadTodayStats();
    console.log('Step counter service initialized for web');
  }

  // Calculate step length based on user height and gender
  private calculateStepLength(): void {
    if (!this.userProfile) return;

    if (this.userProfile.customStepLength) {
      this.stepLength = this.userProfile.customStepLength / 100; // Convert cm to m
      return;
    }

    // Use standard formula based on height and gender
    const heightInMeters = this.userProfile.height / 100;
    if (this.userProfile.gender === 'male') {
      this.stepLength = heightInMeters * 0.415;
    } else {
      this.stepLength = heightInMeters * 0.413;
    }
  }

  // Web-compatible sensor initialization (mock)
  private async initializeSensors(): Promise<void> {
    // In web environment, we'll simulate sensor data
    console.log('Sensors initialized (web simulation mode)');
  }

  // Start tracking steps (web simulation)
  public async startTracking(): Promise<void> {
    if (this.isTracking) return;
    
    this.isTracking = true;
    console.log('Step tracking started (web simulation)');
    
    // Simulate step counting for web
    this.trackingInterval = setInterval(() => {
      if (this.isTracking) {
        // Simulate steps based on time and activity level
        const stepsToAdd = this.simulateSteps();
        this.currentSteps += stepsToAdd;
        
        if (this.onStepUpdate) {
          this.onStepUpdate(this.currentSteps);
        }
        
        // Update daily stats
        this.updateDailyStats();
      }
    }, 5000); // Update every 5 seconds
  }

  // Stop tracking
  public async stopTracking(): Promise<void> {
    this.isTracking = false;
    if (this.trackingInterval) {
      clearInterval(this.trackingInterval);
      this.trackingInterval = null;
    }
    console.log('Step tracking stopped');
  }

  // Simulate steps for web environment
  private simulateSteps(): number {
    if (!this.userProfile) return 0;
    
    // Simulate steps based on activity level
    const baseSteps = 2; // Base steps per 5 seconds
    const activityMultiplier = {
      'sedentary': 0.5,
      'light': 1.0,
      'moderate': 1.5,
      'active': 2.0,
      'very_active': 2.5
    }[this.userProfile.activityLevel] || 1.0;
    
    // Add some randomness
    const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
    
    return Math.floor(baseSteps * activityMultiplier * randomFactor);
  }

  // Update daily stats
  private updateDailyStats(): void {
    if (!this.dailyStats) return;
    
    this.dailyStats.totalSteps = this.currentSteps;
    this.dailyStats.totalDistance = this.currentSteps * this.stepLength;
    this.dailyStats.totalCalories = this.calculateCalories(this.currentSteps);
    this.dailyStats.averagePace = this.calculateAveragePace();
  }

  // Calculate calories burned
  private calculateCalories(steps: number): number {
    if (!this.userProfile) return 0;
    
    // Simple calorie calculation: 0.04 calories per step
    // In a real app, this would be more sophisticated
    return Math.round(steps * 0.04);
  }

  // Calculate average pace
  private calculateAveragePace(): number {
    if (this.currentSteps === 0) return 0;
    
    // Mock pace calculation (steps per minute)
    return Math.round(this.currentSteps / 10); // Assuming 10 minutes of activity
  }

  // Get current stats
  public getCurrentStats(): {
    steps: number;
    distance: number;
    calories: number;
    duration: number;
    pace: number;
  } | null {
    if (!this.dailyStats) return null;
    
    return {
      steps: this.currentSteps,
      distance: this.currentSteps * this.stepLength,
      calories: this.calculateCalories(this.currentSteps),
      duration: Date.now() - (this.dailyStats.date ? new Date(this.dailyStats.date).getTime() : Date.now()),
      pace: this.calculateAveragePace()
    };
  }

  // Load today's stats
  public async loadTodayStats(): Promise<DailyStats> {
    const today = new Date().toISOString().split('T')[0];
    
    // For web, create mock daily stats
    this.dailyStats = {
      date: today,
      totalSteps: this.currentSteps,
      totalDistance: this.currentSteps * this.stepLength,
      totalCalories: this.calculateCalories(this.currentSteps),
      averagePace: this.calculateAveragePace(),
      activeTime: 0,
      gpsRoute: [],
      stepHistory: []
    };
    
    return this.dailyStats;
  }

  // Get daily stats
  public getDailyStats(): DailyStats | null {
    return this.dailyStats;
  }

  // Set step update callback
  public setStepUpdateCallback(callback: (steps: number) => void): void {
    this.onStepUpdate = callback;
  }

  // Reset daily counter
  public resetDailyCounter(): void {
    this.currentSteps = 0;
    this.updateDailyStats();
  }

  // Get step length
  public getStepLength(): number {
    return this.stepLength;
  }

  // Update step length
  public updateStepLength(newLength: number): void {
    this.stepLength = newLength / 100; // Convert cm to m
  }
}
