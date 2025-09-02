import { Platform } from 'react-native';
import { supabase } from '../integrations/supabase';
import { GPSPoint } from './stepCounterService';

export interface GPSConfig {
  updateInterval: number; // milliseconds
  accuracyThreshold: number; // meters
  distanceFilter: number; // meters
  backgroundUpdates: boolean;
  batteryOptimization: boolean;
}

export interface RouteSegment {
  startTime: number;
  endTime: number;
  startPoint: GPSPoint;
  endPoint: GPSPoint;
  distance: number;
  duration: number;
  averageSpeed: number;
  elevationGain: number;
  elevationLoss: number;
}

export interface ActivityRoute {
  id: string;
  userId: string;
  startTime: number;
  endTime: number;
  totalDistance: number;
  totalDuration: number;
  averageSpeed: number;
  maxSpeed: number;
  elevationGain: number;
  elevationLoss: number;
  gpsPoints: GPSPoint[];
  routeSegments: RouteSegment[];
  activityType: 'walking' | 'running' | 'cycling' | 'hiking';
  weather?: {
    temperature: number;
    humidity: number;
    conditions: string;
  };
}

export class GPSTrackingService {
  private static instance: GPSTrackingService;
  private isTracking: boolean = false;
  private currentRoute: ActivityRoute | null = null;
  private gpsConfig: GPSConfig;
  private lastLocation: GPSPoint | null = null;
  private locationUpdateInterval: NodeJS.Timeout | null = null;
  private batteryOptimizationMode: boolean = false;

  private constructor() {
    this.gpsConfig = {
      updateInterval: 5000, // 5 seconds
      accuracyThreshold: 10, // 10 meters
      distanceFilter: 5, // 5 meters
      backgroundUpdates: true,
      batteryOptimization: true
    };
  }

  public static getInstance(): GPSTrackingService {
    if (!GPSTrackingService.instance) {
      GPSTrackingService.instance = new GPSTrackingService();
    }
    return GPSTrackingService.instance;
  }

  // Initialize GPS tracking
  public async initialize(): Promise<void> {
    try {
      // Request location permissions
      const hasPermission = await this.requestLocationPermission();
      if (!hasPermission) {
        throw new Error('Location permission denied');
      }

      // Initialize platform-specific GPS
      if (Platform.OS === 'ios') {
        await this.initializeIOSGPS();
      } else {
        await this.initializeAndroidGPS();
      }

      // Set up battery optimization
      this.setupBatteryOptimization();

      console.log('GPS tracking initialized successfully');
    } catch (error) {
      console.error('Failed to initialize GPS tracking:', error);
      throw error;
    }
  }

  // Request location permissions
  private async requestLocationPermission(): Promise<boolean> {
    try {
      // This would use react-native-permissions or similar
      // For now, we'll assume permission is granted
      console.log('Requesting location permission...');
      return true;
    } catch (error) {
      console.error('Permission request failed:', error);
      return false;
    }
  }

  // Initialize iOS GPS using Core Location
  private async initializeIOSGPS(): Promise<void> {
    console.log('Initializing iOS GPS (Core Location)');
    
    // iOS-specific GPS setup
    // - Configure accuracy levels
    // - Set up background location updates
    // - Configure significant location changes
  }

  // Initialize Android GPS using Location Services
  private async initializeAndroidGPS(): Promise<void> {
    console.log('Initializing Android GPS (Location Services)');
    
    // Android-specific GPS setup
    // - Configure location providers
    // - Set up location request
    // - Configure background location updates
  }

  // Start GPS tracking for an activity
  public async startRouteTracking(
    userId: string,
    activityType: 'walking' | 'running' | 'cycling' | 'hiking'
  ): Promise<void> {
    if (this.isTracking) {
      console.warn('GPS tracking already active');
      return;
    }

    try {
      // Create new route
      this.currentRoute = {
        id: `route_${Date.now()}`,
        userId,
        startTime: Date.now(),
        endTime: 0,
        totalDistance: 0,
        totalDuration: 0,
        averageSpeed: 0,
        maxSpeed: 0,
        elevationGain: 0,
        elevationLoss: 0,
        gpsPoints: [],
        routeSegments: [],
        activityType
      };

      this.isTracking = true;

      // Start location updates
      await this.startLocationUpdates();

      // Start background tracking if enabled
      if (this.gpsConfig.backgroundUpdates) {
        await this.startBackgroundTracking();
      }

      console.log(`GPS tracking started for ${activityType}`);
    } catch (error) {
      console.error('Failed to start GPS tracking:', error);
      throw error;
    }
  }

  // Stop GPS tracking
  public async stopRouteTracking(): Promise<ActivityRoute | null> {
    if (!this.isTracking || !this.currentRoute) {
      return null;
    }

    try {
      // Stop location updates
      await this.stopLocationUpdates();

      // Stop background tracking
      if (this.gpsConfig.backgroundUpdates) {
        await this.stopBackgroundTracking();
      }

      // Finalize route data
      this.currentRoute.endTime = Date.now();
      this.currentRoute.totalDuration = this.currentRoute.endTime - this.currentRoute.startTime;
      this.currentRoute.averageSpeed = this.calculateAverageSpeed();

      // Save route to database
      await this.saveRoute(this.currentRoute);

      const completedRoute = this.currentRoute;
      this.currentRoute = null;
      this.isTracking = false;

      console.log('GPS tracking stopped, route saved');
      return completedRoute;
    } catch (error) {
      console.error('Failed to stop GPS tracking:', error);
      throw error;
    }
  }

  // Start location updates
  private async startLocationUpdates(): Promise<void> {
    if (this.locationUpdateInterval) {
      clearInterval(this.locationUpdateInterval);
    }

    // Set up periodic location updates
    this.locationUpdateInterval = setInterval(async () => {
      await this.updateLocation();
    }, this.gpsConfig.updateInterval);

    // Get initial location
    await this.updateLocation();
  }

  // Stop location updates
  private async stopLocationUpdates(): Promise<void> {
    if (this.locationUpdateInterval) {
      clearInterval(this.locationUpdateInterval);
      this.locationUpdateInterval = null;
    }
  }

  // Update current location
  private async updateLocation(): Promise<void> {
    try {
      // This would get location from the device's GPS
      // For now, we'll create a mock location update
      const mockLocation = await this.getMockLocation();
      
      if (mockLocation && this.isValidLocation(mockLocation)) {
        await this.processLocationUpdate(mockLocation);
      }
    } catch (error) {
      console.error('Failed to update location:', error);
    }
  }

  // Get mock location for testing (replace with actual GPS)
  private async getMockLocation(): Promise<GPSPoint | null> {
    // Simulate GPS location updates
    // In production, this would use the device's actual GPS
    const baseLat = 40.7128; // New York coordinates
    const baseLon = -74.0060;
    
    // Add some random movement
    const latOffset = (Math.random() - 0.5) * 0.001;
    const lonOffset = (Math.random() - 0.5) * 0.001;
    
    return {
      latitude: baseLat + latOffset,
      longitude: baseLon + lonOffset,
      timestamp: Date.now(),
      accuracy: 5 + Math.random() * 10 // 5-15 meters accuracy
    };
  }

  // Validate GPS location
  private isValidLocation(location: GPSPoint): boolean {
    // Check if location is within reasonable bounds
    if (location.latitude < -90 || location.latitude > 90) return false;
    if (location.longitude < -180 || location.longitude > 180) return false;
    
    // Check accuracy threshold
    if (location.accuracy > this.gpsConfig.accuracyThreshold) return false;
    
    // Check distance filter
    if (this.lastLocation) {
      const distance = this.calculateDistance(
        this.lastLocation.latitude, this.lastLocation.longitude,
        location.latitude, location.longitude
      );
      
      if (distance < this.gpsConfig.distanceFilter) return false;
    }
    
    return true;
  }

  // Process location update
  private async processLocationUpdate(location: GPSPoint): Promise<void> {
    if (!this.currentRoute) return;

    // Add to route points
    this.currentRoute.gpsPoints.push(location);

    // Calculate distance and update route
    if (this.lastLocation) {
      const distance = this.calculateDistance(
        this.lastLocation.latitude, this.lastLocation.longitude,
        location.latitude, location.longitude
      );

      this.currentRoute.totalDistance += distance;

      // Calculate elevation change (if available)
      // This would require additional altitude data
      const elevationChange = 0; // Placeholder
      if (elevationChange > 0) {
        this.currentRoute.elevationGain += elevationChange;
      } else if (elevationChange < 0) {
        this.currentRoute.elevationLoss += Math.abs(elevationChange);
      }

      // Update route segments
      this.updateRouteSegments(location, distance);
    }

    this.lastLocation = location;

    // Emit location update event
    this.emitLocationUpdate(location);
  }

  // Update route segments
  private updateRouteSegments(location: GPSPoint, distance: number): void {
    if (!this.currentRoute) return;

    const now = Date.now();
    const lastSegment = this.currentRoute.routeSegments[this.currentRoute.routeSegments.length - 1];

    if (lastSegment && (now - lastSegment.endTime) < 30000) { // 30 seconds
      // Extend current segment
      lastSegment.endTime = now;
      lastSegment.endPoint = location;
      lastSegment.distance += distance;
      lastSegment.duration = lastSegment.endTime - lastSegment.startTime;
      lastSegment.averageSpeed = lastSegment.distance / (lastSegment.duration / 1000); // m/s
    } else {
      // Create new segment
      const newSegment: RouteSegment = {
        startTime: now,
        endTime: now,
        startPoint: location,
        endPoint: location,
        distance,
        duration: 0,
        averageSpeed: 0,
        elevationGain: 0,
        elevationLoss: 0
      };

      this.currentRoute.routeSegments.push(newSegment);
    }
  }

  // Calculate distance between two GPS points using Haversine formula
  private calculateDistance(
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

  // Calculate average speed for the route
  private calculateAverageSpeed(): number {
    if (!this.currentRoute || this.currentRoute.totalDuration === 0) return 0;
    
    return this.currentRoute.totalDistance / (this.currentRoute.totalDuration / 1000); // m/s
  }

  // Start background tracking
  private async startBackgroundTracking(): Promise<void> {
    if (Platform.OS === 'ios') {
      await this.startIOSBackgroundTracking();
    } else {
      await this.startAndroidBackgroundTracking();
    }
  }

  // Stop background tracking
  private async stopBackgroundTracking(): Promise<void> {
    if (Platform.OS === 'ios') {
      await this.stopIOSBackgroundTracking();
    } else {
      await this.stopAndroidBackgroundTracking();
    }
  }

  // iOS background tracking
  private async startIOSBackgroundTracking(): Promise<void> {
    console.log('iOS background GPS tracking started');
    // Use Core Location's background location updates
    // Configure significant location changes for battery efficiency
  }

  // Android background tracking
  private async startAndroidBackgroundTracking(): Promise<void> {
    console.log('Android background GPS tracking started');
    // Use Foreground Service with location updates
    // Implement WorkManager for reliable background execution
  }

  // Stop iOS background tracking
  private async stopIOSBackgroundTracking(): Promise<void> {
    console.log('iOS background GPS tracking stopped');
  }

  // Stop Android background tracking
  private async stopAndroidBackgroundTracking(): Promise<void> {
    console.log('Android background GPS tracking stopped');
  }

  // Setup battery optimization
  private setupBatteryOptimization(): void {
    if (!this.gpsConfig.batteryOptimization) return;

    // Monitor battery level and adjust GPS frequency
    // Reduce update frequency when battery is low
    // Use significant location changes when possible
  }

  // Save route to database
  private async saveRoute(route: ActivityRoute): Promise<void> {
    try {
      const { error } = await supabase
        .from('activity_routes')
        .insert(route);

      if (error) {
        console.error('Error saving route:', error);
      }
    } catch (error) {
      console.error('Failed to save route:', error);
    }
  }

  // Get current route
  public getCurrentRoute(): ActivityRoute | null {
    return this.currentRoute;
  }

  // Check if tracking is active
  public isActive(): boolean {
    return this.isTracking;
  }

  // Update GPS configuration
  public updateConfig(config: Partial<GPSConfig>): void {
    this.gpsConfig = { ...this.gpsConfig, ...config };
    
    // Apply new configuration
    if (this.isTracking) {
      this.applyNewConfig();
    }
  }

  // Apply new configuration
  private async applyNewConfig(): Promise<void> {
    if (this.locationUpdateInterval) {
      clearInterval(this.locationUpdateInterval);
      await this.startLocationUpdates();
    }
  }

  // Get GPS configuration
  public getConfig(): GPSConfig {
    return { ...this.gpsConfig };
  }

  // Pause tracking temporarily
  public async pauseTracking(): Promise<void> {
    if (!this.isTracking) return;
    
    await this.stopLocationUpdates();
    console.log('GPS tracking paused');
  }

  // Resume tracking
  public async resumeTracking(): Promise<void> {
    if (!this.isTracking) return;
    
    await this.startLocationUpdates();
    console.log('GPS tracking resumed');
  }

  // Get route statistics
  public getRouteStats(): {
    distance: number;
    duration: number;
    averageSpeed: number;
    elevationGain: number;
    elevationLoss: number;
  } | null {
    if (!this.currentRoute) return null;

    return {
      distance: this.currentRoute.totalDistance,
      duration: this.currentRoute.totalDuration,
      averageSpeed: this.currentRoute.averageSpeed,
      elevationGain: this.currentRoute.elevationGain,
      elevationLoss: this.currentRoute.elevationLoss
    };
  }

  // Emit location update event
  private emitLocationUpdate(location: GPSPoint): void {
    // This would use an event emitter or callback system
    if (this.onLocationUpdate) {
      this.onLocationUpdate(location);
    }
  }

  // Callback for location updates
  public onLocationUpdate?: (location: GPSPoint) => void;

  // Cleanup resources
  public async cleanup(): Promise<void> {
    if (this.isTracking) {
      await this.stopRouteTracking();
    }
    
    if (this.locationUpdateInterval) {
      clearInterval(this.locationUpdateInterval);
    }
    
    this.currentRoute = null;
    this.lastLocation = null;
  }
}
