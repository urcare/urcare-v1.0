import { Platform } from 'react-native';
import { supabase } from '../integrations/supabase';

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
  private stepDetectionConfig: StepDetectionConfig;
  private sensorDataBuffer: Array<{
    timestamp: number;
    acceleration: number;
    gyroscope: number;
    gps?: GPSPoint;
  }> = [];
  private lastStepTime: number = 0;
  private stepLength: number = 0.7; // Default 70cm

  private constructor() {
    this.stepDetectionConfig = {
      accelerationThreshold: 1.5, // m/s²
      gyroscopeThreshold: 0.3, // rad/s
      peakDetectionWindow: 500, // ms
      minStepInterval: 300, // ms
      confidenceThreshold: 0.7,
      noiseFilterStrength: 0.8
    };
  }

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
    await this.initializeSensors();
  }

  // Calculate step length based on user height and gender
  private calculateStepLength(): void {
    if (!this.userProfile) return;

    if (this.userProfile.customStepLength) {
      this.stepLength = this.userProfile.customStepLength / 100; // Convert cm to m
      return;
    }

    // Use standard formula: step length ≈ height × 0.415
    const baseStepLength = this.userProfile.height * 0.415;
    
    // Adjust for gender (males typically have longer strides)
    const genderMultiplier = this.userProfile.gender === 'male' ? 1.05 : 0.95;
    
    this.stepLength = (baseStepLength * genderMultiplier) / 100; // Convert cm to m
  }

  // Initialize sensor access
  private async initializeSensors(): Promise<void> {
    try {
      if (Platform.OS === 'ios') {
        await this.initializeIOSSensors();
      } else {
        await this.initializeAndroidSensors();
      }
    } catch (error) {
      console.error('Failed to initialize sensors:', error);
      throw new Error('Sensor initialization failed');
    }
  }

  // iOS-specific sensor initialization using Core Motion
  private async initializeIOSSensors(): Promise<void> {
    // This would use react-native-motion-manager or similar
    // For now, we'll create a mock implementation
    console.log('Initializing iOS sensors (Core Motion)');
  }

  // Android-specific sensor initialization using Foreground Service
  private async initializeAndroidSensors(): Promise<void> {
    // This would use react-native-background-actions or similar
    // For now, we'll create a mock implementation
    console.log('Initializing Android sensors (Foreground Service)');
  }

  // Start continuous tracking
  public async startTracking(): Promise<void> {
    if (this.isTracking) return;
    
    this.isTracking = true;
    this.currentSteps = 0;
    
    // Start background service
    if (Platform.OS === 'ios') {
      await this.startIOSBackgroundTracking();
    } else {
      await this.startAndroidBackgroundTracking();
    }
    
    console.log('Step tracking started');
  }

  // Stop tracking
  public async stopTracking(): Promise<void> {
    if (!this.isTracking) return;
    
    this.isTracking = false;
    
    // Stop background service
    if (Platform.OS === 'ios') {
      await this.stopIOSBackgroundTracking();
    } else {
      await this.stopAndroidBackgroundTracking();
    }
    
    // Save final stats
    await this.saveDailyStats();
    
    console.log('Step tracking stopped');
  }

  // iOS background tracking using Core Motion
  private async startIOSBackgroundTracking(): Promise<void> {
    // Implementation would use Core Motion's CMPedometer
    // and Background App Refresh capabilities
    console.log('iOS background tracking started');
  }

  // Android background tracking using Foreground Service
  private async startAndroidBackgroundTracking(): Promise<void> {
    // Implementation would use Foreground Service with notification
    // and WorkManager for reliable background execution
    console.log('Android background tracking started');
  }

  // Stop iOS background tracking
  private async stopIOSBackgroundTracking(): Promise<void> {
    console.log('iOS background tracking stopped');
  }

  // Stop Android background tracking
  private async stopAndroidBackgroundTracking(): Promise<void> {
    console.log('Android background tracking stopped');
  }

  // Process incoming sensor data
  public processSensorData(
    acceleration: number,
    gyroscope: number,
    gps?: GPSPoint
  ): void {
    if (!this.isTracking) return;

    const timestamp = Date.now();
    
    // Add to buffer
    this.sensorDataBuffer.push({
      timestamp,
      acceleration,
      gyroscope,
      gps
    });

    // Keep only recent data (last 2 seconds)
    const cutoffTime = timestamp - 2000;
    this.sensorDataBuffer = this.sensorDataBuffer.filter(
      data => data.timestamp > cutoffTime
    );

    // Process for step detection
    this.detectSteps();
  }

  // Advanced step detection algorithm
  private detectSteps(): void {
    if (this.sensorDataBuffer.length < 10) return;

    const now = Date.now();
    
    // Check if enough time has passed since last step
    if (now - this.lastStepTime < this.stepDetectionConfig.minStepInterval) {
      return;
    }

    // Calculate moving averages and variances
    const accelerationData = this.sensorDataBuffer.map(d => d.acceleration);
    const gyroscopeData = this.sensorDataBuffer.map(d => d.gyroscope);
    
    const avgAcceleration = this.calculateAverage(accelerationData);
    const avgGyroscope = this.calculateAverage(gyroscopeData);
    
    const accelVariance = this.calculateVariance(accelerationData, avgAcceleration);
    const gyroVariance = this.calculateVariance(gyroscopeData, avgGyroscope);

    // Peak detection algorithm
    const isStep = this.detectStepPeak(
      accelerationData,
      gyroscopeData,
      avgAcceleration,
      avgGyroscope,
      accelVariance,
      gyroVariance
    );

    if (isStep) {
      this.recordStep(now);
    }
  }

  // Peak detection using multiple criteria
  private detectStepPeak(
    acceleration: number[],
    gyroscope: number[],
    avgAccel: number,
    avgGyro: number,
    accelVar: number,
    gyroVar: number
  ): boolean {
    const recentAccel = acceleration.slice(-5); // Last 5 readings
    const recentGyro = gyroscope.slice(-5);
    
    // Check for acceleration peak
    const maxAccel = Math.max(...recentAccel);
    const minAccel = Math.min(...recentAccel);
    const accelRange = maxAccel - minAccel;
    
    // Check for gyroscope peak
    const maxGyro = Math.max(...recentGyro);
    const minGyro = Math.min(...recentGyro);
    const gyroRange = maxGyro - minGyro;
    
    // Calculate confidence score
    let confidence = 0;
    
    // Acceleration confidence (40% weight)
    if (accelRange > this.stepDetectionConfig.accelerationThreshold) {
      confidence += 0.4;
    }
    
    // Gyroscope confidence (30% weight)
    if (gyroRange > this.stepDetectionConfig.gyroscopeThreshold) {
      confidence += 0.3;
    }
    
    // Variance confidence (20% weight)
    if (accelVar > 0.5 && gyroVar > 0.1) {
      confidence += 0.2;
    }
    
    // Pattern consistency (10% weight)
    if (this.isConsistentPattern(recentAccel, recentGyro)) {
      confidence += 0.1;
    }
    
    return confidence >= this.stepDetectionConfig.confidenceThreshold;
  }

  // Check for consistent step pattern
  private isConsistentPattern(acceleration: number[], gyroscope: number[]): boolean {
    // Simple pattern check - more sophisticated algorithms could be implemented
    const accelChanges = acceleration.slice(1).map((val, i) => 
      Math.abs(val - acceleration[i])
    );
    
    const avgChange = this.calculateAverage(accelChanges);
    const changeVariance = this.calculateVariance(accelChanges, avgChange);
    
    // Low variance indicates consistent pattern
    return changeVariance < 0.3;
  }

  // Record a detected step
  private recordStep(timestamp: number): void {
    this.currentSteps++;
    this.lastStepTime = timestamp;
    
    // Update daily stats
    if (this.dailyStats) {
      this.dailyStats.totalSteps = this.currentSteps;
      this.dailyStats.totalDistance = this.calculateDistance();
      this.dailyStats.totalCalories = this.calculateCalories();
      
      // Add to step history
      this.dailyStats.stepHistory.push({
        timestamp,
        steps: this.currentSteps,
        distance: this.dailyStats.totalDistance,
        calories: this.dailyStats.totalCalories,
        activityType: this.determineActivityType(),
        confidence: 0.9,
        gpsRoute: this.getRecentGPSRoute()
      });
    }
    
    // Emit step event for UI updates
    this.emitStepEvent();
  }

  // Calculate distance based on steps and GPS
  private calculateDistance(): number {
    if (!this.dailyStats) return 0;
    
    // If we have GPS data, use it for more accurate distance
    if (this.dailyStats.gpsRoute.length > 1) {
      return this.calculateGPSDistance(this.dailyStats.gpsRoute);
    }
    
    // Otherwise, estimate using step count and step length
    return this.currentSteps * this.stepLength;
  }

  // Calculate distance from GPS coordinates
  private calculateGPSDistance(gpsRoute: GPSPoint[]): number {
    let totalDistance = 0;
    
    for (let i = 1; i < gpsRoute.length; i++) {
      const prev = gpsRoute[i - 1];
      const curr = gpsRoute[i];
      
      // Use Haversine formula for accurate distance calculation
      const distance = this.haversineDistance(
        prev.latitude, prev.longitude,
        curr.latitude, curr.longitude
      );
      
      totalDistance += distance;
    }
    
    return totalDistance;
  }

  // Haversine formula for calculating distance between two GPS points
  private haversineDistance(
    lat1: number, lon1: number,
    lat2: number, lon2: number
  ): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c;
  }

  // Calculate calories burned using MET formula
  private calculateCalories(): number {
    if (!this.userProfile || !this.dailyStats) return 0;
    
    const weight = this.userProfile.weight; // kg
    const duration = this.dailyStats.activeTime / 3600; // Convert to hours
    const activityType = this.determineActivityType();
    
    // MET values for different activities
    const metValues = {
      'idle': 1.0,
      'walking': 3.5,
      'running': 8.0
    };
    
    const met = metValues[activityType];
    
    // Calories = MET × Weight(kg) × Duration(hr) × 1.05
    return met * weight * duration * 1.05;
  }

  // Determine current activity type based on step frequency
  private determineActivityType(): 'walking' | 'running' | 'idle' {
    if (this.currentSteps === 0) return 'idle';
    
    // Calculate steps per minute from recent history
    const recentSteps = this.dailyStats?.stepHistory.slice(-10) || [];
    if (recentSteps.length < 2) return 'walking';
    
    const timeSpan = (recentSteps[recentSteps.length - 1].timestamp - 
                     recentSteps[0].timestamp) / 60000; // minutes
    
    if (timeSpan === 0) return 'walking';
    
    const stepsPerMinute = recentSteps.length / timeSpan;
    
    if (stepsPerMinute > 120) return 'running';
    if (stepsPerMinute > 60) return 'walking';
    return 'idle';
  }

  // Get recent GPS route for current activity
  private getRecentGPSRoute(): GPSPoint[] {
    if (!this.dailyStats) return [];
    
    const now = Date.now();
    const recentTime = now - 300000; // Last 5 minutes
    
    return this.dailyStats.gpsRoute.filter(
      point => point.timestamp > recentTime
    );
  }

  // Load today's statistics
  private async loadTodayStats(): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    
    try {
      const { data, error } = await supabase
        .from('daily_fitness_stats')
        .select('*')
        .eq('date', today)
        .single();
      
      if (error && error.code !== 'PGRST116') { // Not found error
        console.error('Error loading daily stats:', error);
      }
      
      if (data) {
        this.dailyStats = data;
        this.currentSteps = data.totalSteps;
      } else {
        // Create new daily stats
        this.dailyStats = {
          date: today,
          totalSteps: 0,
          totalDistance: 0,
          totalCalories: 0,
          averagePace: 0,
          activeTime: 0,
          gpsRoute: [],
          stepHistory: []
        };
      }
    } catch (error) {
      console.error('Failed to load daily stats:', error);
      // Create default stats
      this.dailyStats = {
        date: today,
        totalSteps: 0,
        totalDistance: 0,
        totalCalories: 0,
        averagePace: 0,
        activeTime: 0,
        gpsRoute: [],
        stepHistory: []
      };
    }
  }

  // Save daily statistics
  private async saveDailyStats(): Promise<void> {
    if (!this.dailyStats) return;
    
    try {
      const { error } = await supabase
        .from('daily_fitness_stats')
        .upsert(this.dailyStats, { onConflict: 'date' });
      
      if (error) {
        console.error('Error saving daily stats:', error);
      }
    } catch (error) {
      console.error('Failed to save daily stats:', error);
    }
  }

  // Get current statistics
  public getCurrentStats(): DailyStats | null {
    return this.dailyStats;
  }

  // Get step count
  public getStepCount(): number {
    return this.currentSteps;
  }

  // Get distance
  public getDistance(): number {
    return this.dailyStats?.totalDistance || 0;
  }

  // Get calories
  public getCalories(): number {
    return this.dailyStats?.totalCalories || 0;
  }

  // Check if tracking is active
  public isActive(): boolean {
    return this.isTracking;
  }

  // Update user profile
  public async updateUserProfile(profile: UserFitnessProfile): Promise<void> {
    this.userProfile = profile;
    this.calculateStepLength();
    
    // Recalculate calories with new profile
    if (this.dailyStats) {
      this.dailyStats.totalCalories = this.calculateCalories();
      await this.saveDailyStats();
    }
  }

  // Update step detection configuration
  public updateStepDetectionConfig(config: Partial<StepDetectionConfig>): void {
    this.stepDetectionConfig = { ...this.stepDetectionConfig, ...config };
  }

  // Reset daily counter (called at midnight)
  public async resetDailyCounter(): Promise<void> {
    await this.saveDailyStats();
    
    // Archive current day's data
    if (this.dailyStats) {
      await this.archiveDailyStats(this.dailyStats);
    }
    
    // Start fresh day
    const today = new Date().toISOString().split('T')[0];
    this.dailyStats = {
      date: today,
      totalSteps: 0,
      totalDistance: 0,
      totalCalories: 0,
      averagePace: 0,
      activeTime: 0,
      gpsRoute: [],
      stepHistory: []
    };
    
    this.currentSteps = 0;
    this.lastStepTime = 0;
  }

  // Archive daily statistics
  private async archiveDailyStats(stats: DailyStats): Promise<void> {
    try {
      const { error } = await supabase
        .from('fitness_history')
        .insert({
          ...stats,
          archived_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('Error archiving daily stats:', error);
      }
    } catch (error) {
      console.error('Failed to archive daily stats:', error);
    }
  }

  // Utility functions
  private calculateAverage(values: number[]): number {
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  private calculateVariance(values: number[], mean: number): number {
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    return this.calculateAverage(squaredDiffs);
  }

  // Emit step event for UI updates
  private emitStepEvent(): void {
    // This would use an event emitter or callback system
    // For now, we'll use a simple callback approach
    if (this.onStepUpdate) {
      this.onStepUpdate({
        steps: this.currentSteps,
        distance: this.getDistance(),
        calories: this.getCalories()
      });
    }
  }

  // Callback for step updates
  public onStepUpdate?: (stats: { steps: number; distance: number; calories: number }) => void;

  // Cleanup resources
  public async cleanup(): Promise<void> {
    await this.stopTracking();
    this.sensorDataBuffer = [];
    this.currentSteps = 0;
    this.dailyStats = null;
  }
}
