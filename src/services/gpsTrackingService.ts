// Web-compatible GPS tracking service for UrCare dashboard
import { supabase } from '../integrations/supabase/client';

export interface GPSConfig {
  enableTracking: boolean;
  updateInterval: number; // seconds
  accuracyThreshold: number; // meters
  batteryOptimization: boolean;
  backgroundTracking: boolean;
}

export interface RouteSegment {
  startTime: number;
  endTime: number;
  startLocation: GPSPoint;
  endLocation: GPSPoint;
  distance: number;
  duration: number;
  averageSpeed: number;
  activityType: 'walking' | 'running' | 'cycling' | 'hiking';
}

export interface ActivityRoute {
  id: string;
  userId: string;
  startTime: number;
  endTime?: number;
  activityType: 'walking' | 'running' | 'cycling' | 'hiking';
  totalDistance: number;
  totalDuration: number;
  averageSpeed: number;
  maxSpeed: number;
  elevationGain: number;
  routeSegments: RouteSegment[];
  gpsPoints: GPSPoint[];
  weather?: {
    temperature: number;
    humidity: number;
    conditions: string;
    windSpeed: number;
  };
}

export interface GPSPoint {
  latitude: number;
  longitude: number;
  timestamp: number;
  accuracy: number;
  altitude?: number;
  speed?: number;
  heading?: number;
}

export class GPSTrackingService {
  private static instance: GPSTrackingService;
  private config: GPSConfig;
  private isTracking: boolean = false;
  private currentRoute: ActivityRoute | null = null;
  private locationInterval: NodeJS.Timeout | null = null;
  private onLocationUpdate?: (location: GPSPoint) => void;
  private mockLocationIndex: number = 0;

  private constructor() {
    this.config = {
      enableTracking: true,
      updateInterval: 10, // 10 seconds
      accuracyThreshold: 10, // 10 meters
      batteryOptimization: true,
      backgroundTracking: true
    };
  }

  public static getInstance(): GPSTrackingService {
    if (!GPSTrackingService.instance) {
      GPSTrackingService.instance = new GPSTrackingService();
    }
    return GPSTrackingService.instance;
  }

  // Initialize the GPS service
  public async initialize(): Promise<void> {
    try {
      // Request location permission (web simulation)
      const hasPermission = await this.requestLocationPermission();
      
      if (hasPermission) {
        console.log('GPS service initialized for web');
      } else {
        console.log('GPS service initialized without location permission');
      }
    } catch (error) {
      console.error('Failed to initialize GPS service:', error);
      throw error;
    }
  }

  // Request location permission (web simulation)
  private async requestLocationPermission(): Promise<boolean> {
    // In a real web app, this would use the Geolocation API
    // For now, we'll simulate permission granted
    return true;
  }

  // Initialize iOS GPS (web simulation)
  private async initializeIOSGPS(): Promise<void> {
    console.log('iOS GPS initialized (web simulation)');
  }

  // Initialize Android GPS (web simulation)
  private async initializeAndroidGPS(): Promise<void> {
    console.log('Android GPS initialized (web simulation)');
  }

  // Start route tracking
  public async startRouteTracking(): Promise<void> {
    if (this.isTracking) return;
    
    this.isTracking = true;
    
    // Create new route
    this.currentRoute = {
      id: `route-${Date.now()}`,
      userId: await this.getCurrentUserId(),
      startTime: Date.now(),
      activityType: 'walking',
      totalDistance: 0,
      totalDuration: 0,
      averageSpeed: 0,
      maxSpeed: 0,
      elevationGain: 0,
      routeSegments: [],
      gpsPoints: []
    };
    
    // Start location updates
    this.startLocationUpdates();
    
    console.log('GPS route tracking started');
  }

  // Stop route tracking
  public async stopRouteTracking(): Promise<ActivityRoute | null> {
    if (!this.isTracking) return null;
    
    this.isTracking = false;
    
    // Stop location updates
    this.stopLocationUpdates();
    
    // Complete route
    if (this.currentRoute) {
      this.currentRoute.endTime = Date.now();
      this.currentRoute.totalDuration = this.currentRoute.endTime - this.currentRoute.startTime;
      
      // Calculate final stats
      this.calculateRouteStats();
      
      // Save route
      await this.saveRoute(this.currentRoute);
      
      const completedRoute = this.currentRoute;
      this.currentRoute = null;
      
      console.log('GPS route tracking stopped');
      return completedRoute;
    }
    
    return null;
  }

  // Start location updates
  private startLocationUpdates(): void {
    if (this.locationInterval) {
      clearInterval(this.locationInterval);
    }
    
    // Simulate GPS location updates for web
    this.locationInterval = setInterval(() => {
      if (this.isTracking && this.currentRoute) {
        const mockLocation = this.getMockLocation();
        this.updateLocation(mockLocation);
      }
    }, this.config.updateInterval * 1000);
  }

  // Stop location updates
  private stopLocationUpdates(): void {
    if (this.locationInterval) {
      clearInterval(this.locationInterval);
      this.locationInterval = null;
    }
  }

  // Update location
  private updateLocation(location: GPSPoint): void {
    if (!this.currentRoute) return;
    
    // Add to route points
    this.currentRoute.gpsPoints.push(location);
    
    // Update route segments
    this.updateRouteSegments(location);
    
    // Notify listeners
    if (this.onLocationUpdate) {
      this.onLocationUpdate(location);
    }
  }

  // Get mock location for web simulation
  private getMockLocation(): GPSPoint {
    // Simulate walking in a park (circular route)
    const centerLat = 40.7589; // New York Central Park
    const centerLng = -73.9851;
    const radius = 0.001; // Small radius for demo
    
    const angle = (this.mockLocationIndex * 0.1) % (2 * Math.PI);
    const lat = centerLat + radius * Math.cos(angle);
    const lng = centerLng + radius * Math.sin(angle);
    
    this.mockLocationIndex++;
    
    return {
      latitude: lat,
      longitude: lng,
      timestamp: Date.now(),
      accuracy: 5 + Math.random() * 10, // 5-15 meters accuracy
      altitude: 10 + Math.random() * 5, // 10-15 meters altitude
      speed: 1.2 + Math.random() * 0.8, // 1.2-2.0 m/s (walking speed)
      heading: (angle * 180 / Math.PI + 360) % 360
    };
  }

  // Validate location data
  private isValidLocation(location: GPSPoint): boolean {
    return (
      location.latitude >= -90 && location.latitude <= 90 &&
      location.longitude >= -180 && location.longitude <= 180 &&
      location.accuracy > 0 && location.accuracy < 100 &&
      location.timestamp > 0
    );
  }

  // Process location update
  private processLocationUpdate(location: GPSPoint): void {
    if (!this.isValidLocation(location)) {
      console.warn('Invalid location data received:', location);
      return;
    }
    
    // Update route with new location
    this.updateLocation(location);
  }

  // Update route segments
  private updateRouteSegments(location: GPSPoint): void {
    if (!this.currentRoute || this.currentRoute.gpsPoints.length < 2) return;
    
    const currentPoint = location;
    const previousPoint = this.currentRoute.gpsPoints[this.currentRoute.gpsPoints.length - 2];
    
    // Calculate segment stats
    const distance = this.calculateDistance(previousPoint, currentPoint);
    const duration = currentPoint.timestamp - previousPoint.timestamp;
    const speed = duration > 0 ? distance / (duration / 1000) : 0;
    
    // Create new segment
    const segment: RouteSegment = {
      startTime: previousPoint.timestamp,
      endTime: currentPoint.timestamp,
      startLocation: previousPoint,
      endLocation: currentPoint,
      distance,
      duration,
      averageSpeed: speed,
      activityType: this.determineActivityType(speed)
    };
    
    // Add to route segments
    this.currentRoute.routeSegments.push(segment);
    
    // Update route totals
    this.currentRoute.totalDistance += distance;
    this.currentRoute.totalDuration = currentPoint.timestamp - this.currentRoute.startTime;
    this.currentRoute.averageSpeed = this.currentRoute.totalDistance / (this.currentRoute.totalDuration / 1000);
    
    // Update max speed
    if (speed > this.currentRoute.maxSpeed) {
      this.currentRoute.maxSpeed = speed;
    }
  }

  // Calculate distance between two GPS points using Haversine formula
  private calculateDistance(point1: GPSPoint, point2: GPSPoint): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = point1.latitude * Math.PI / 180;
    const φ2 = point2.latitude * Math.PI / 180;
    const Δφ = (point2.latitude - point1.latitude) * Math.PI / 180;
    const Δλ = (point2.longitude - point1.longitude) * Math.PI / 180;
    
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c;
  }

  // Calculate average speed
  private calculateAverageSpeed(): number {
    if (!this.currentRoute || this.currentRoute.routeSegments.length === 0) return 0;
    
    const totalSpeed = this.currentRoute.routeSegments.reduce((sum, segment) => sum + segment.averageSpeed, 0);
    return totalSpeed / this.currentRoute.routeSegments.length;
  }

  // Determine activity type based on speed
  private determineActivityType(speed: number): 'walking' | 'running' | 'cycling' | 'hiking' {
    if (speed < 0.5) return 'hiking';
    if (speed < 1.5) return 'walking';
    if (speed < 3.0) return 'running';
    return 'cycling';
  }

  // Start background tracking
  public async startBackgroundTracking(): Promise<void> {
    // For web, background tracking is simulated
    console.log('Background GPS tracking started (web simulation)');
  }

  // Stop background tracking
  public async stopBackgroundTracking(): Promise<void> {
    console.log('Background GPS tracking stopped');
  }

  // Setup battery optimization
  private setupBatteryOptimization(): void {
    // For web, this is not applicable
    console.log('Battery optimization not applicable for web');
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

  // Update configuration
  public updateConfig(newConfig: Partial<GPSConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // Apply new configuration
  public async applyNewConfig(): Promise<void> {
    // Apply configuration changes
    if (this.isTracking) {
      // Restart location updates with new interval
      this.stopLocationUpdates();
      this.startLocationUpdates();
    }
  }

  // Pause tracking
  public async pauseTracking(): Promise<void> {
    this.stopLocationUpdates();
    console.log('GPS tracking paused');
  }

  // Resume tracking
  public async resumeTracking(): Promise<void> {
    if (this.isTracking) {
      this.startLocationUpdates();
      console.log('GPS tracking resumed');
    }
  }

  // Get route statistics
  public getRouteStats(): {
    distance: number;
    duration: number;
    averageSpeed: number;
    maxSpeed: number;
    points: number;
  } | null {
    if (!this.currentRoute) return null;
    
    return {
      distance: this.currentRoute.totalDistance,
      duration: this.currentRoute.totalDuration,
      averageSpeed: this.currentRoute.averageSpeed,
      maxSpeed: this.currentRoute.maxSpeed,
      points: this.currentRoute.gpsPoints.length
    };
  }

  // Calculate route statistics
  private calculateRouteStats(): void {
    if (!this.currentRoute) return;
    
    // Calculate final stats
    this.currentRoute.averageSpeed = this.calculateAverageSpeed();
    
    // Calculate elevation gain (simulated)
    this.currentRoute.elevationGain = this.currentRoute.gpsPoints.length * 0.5; // 0.5m per point
  }

  // Get current user ID
  private async getCurrentUserId(): Promise<string> {
    // For web, return a mock user ID
    return 'web-user-123';
  }

  // Cleanup resources
  public async cleanup(): Promise<void> {
    this.stopLocationUpdates();
    this.isTracking = false;
    this.currentRoute = null;
  }
}

