# Custom Step Counter & Distance Tracker Engine

## 🎯 Overview

Custom-built fitness tracking system for UrCare app that works independently of platform-specific health APIs (Apple HealthKit, Google Fit, Samsung Health).

## 🏗️ Architecture

### Core Services
- **StepCounterService**: Accelerometer + gyroscope step detection
- **GPSTrackingService**: GPS route tracking and distance calculation
- **FitnessTrackingService**: Orchestrates both services and manages sessions

### Platform Implementation
- **Android**: Foreground Service + WorkManager + SensorManager
- **iOS**: Core Motion + Core Location + Background App Refresh

## 🔍 Step Detection Algorithm

### Multi-Criteria Peak Detection
```typescript
function detectStep(sensorData: SensorBuffer): boolean {
    // 1. Time-based filtering (300ms minimum interval)
    if (timeSinceLastStep < minStepInterval) return false;
    
    // 2. Multi-sensor analysis with weighted confidence
    const accelConfidence = analyzeAcceleration(sensorData.acceleration) * 0.4;
    const gyroConfidence = analyzeGyroscope(sensorData.gyroscope) * 0.3;
    const patternConfidence = analyzePattern(sensorData) * 0.3;
    
    const totalConfidence = accelConfidence + gyroConfidence + patternConfidence;
    return totalConfidence >= 0.7; // 70% confidence threshold
}
```

### Sensor Processing
- **Accelerometer**: Peak detection (1.5 m/s² threshold)
- **Gyroscope**: Rotation pattern recognition (0.3 rad/s threshold)
- **Pattern Analysis**: Consistency checking and false positive filtering

## 📍 Distance Calculation

### GPS-Based (Outdoor)
- Haversine formula for accurate coordinate-based distance
- 5-10 second update intervals when moving
- Automatic pause when stationary

### Step-Based (Indoor)
- Formula: `Distance = Steps × Step Length`
- Step length calculated from height and gender
- Customizable step length override

## 🔥 Calorie Estimation

### MET Formula
```typescript
Calories = MET × Weight(kg) × Duration(hr) × 1.05

const metValues = {
    'idle': 1.0,
    'walking': 3.5,
    'running': 8.0,
    'cycling': 6.0,
    'hiking': 5.0
};
```

## 🚀 Background Service

### Android
- Foreground Service with persistent notification
- WorkManager for reliable background execution
- Sensor batching for battery optimization

### iOS
- Core Motion for continuous sensor monitoring
- Background App Refresh capabilities
- Significant location changes for efficiency

## 🗄️ Database Schema

### Core Tables
```sql
-- Daily fitness statistics
CREATE TABLE daily_fitness_stats (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    date DATE NOT NULL,
    total_steps INTEGER DEFAULT 0,
    total_distance DECIMAL(10,2) DEFAULT 0.0,
    total_calories DECIMAL(8,2) DEFAULT 0.0,
    gps_route JSONB,
    step_history JSONB,
    UNIQUE(user_id, date)
);

-- Fitness sessions
CREATE TABLE fitness_sessions (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    start_time BIGINT NOT NULL,
    total_steps INTEGER DEFAULT 0,
    total_distance DECIMAL(10,2) DEFAULT 0.0,
    activity_type VARCHAR(20) NOT NULL,
    gps_route_id UUID REFERENCES activity_routes(id)
);
```

## 🎨 UI Components

### Main Interface
- **FitnessTracker**: Real-time tracking controls
- **RouteMap**: GPS route visualization
- **FitnessAnalytics**: Charts and statistics
- **GoalTracker**: Fitness goals and achievements

### Real-Time Display
```typescript
const RealTimeStats = () => {
    const [stats, setStats] = useState<FitnessStats | null>(null);
    
    useEffect(() => {
        const interval = setInterval(() => {
            const currentStats = fitnessService.getCurrentStats();
            setStats(currentStats);
        }, 1000);
        
        return () => clearInterval(interval);
    }, []);
    
    return (
        <div className="grid grid-cols-4 gap-4">
            <StatCard value={stats?.steps || 0} label="Steps" />
            <StatCard value={formatDistance(stats?.distance || 0)} label="Distance" />
            <StatCard value={Math.round(stats?.calories || 0)} label="Calories" />
            <StatCard value={formatDuration(stats?.duration || 0)} label="Duration" />
        </div>
    );
};
```

## 🔧 Sensor Noise Handling

### Noise Reduction
1. **Moving Average Filtering**: Smooths sensor data over time windows
2. **Kalman Filtering**: Advanced noise reduction algorithm
3. **Threshold-Based Filtering**: Removes values below noise threshold

### Calibration
- Initial calibration with known distance
- Dynamic calibration using GPS comparison
- Device-specific calibration profiles

### False Positive Filtering
- Time-based interval validation (300ms - 2s)
- Pattern consistency checking
- Multi-sensor validation (2 out of 3 sensors must agree)

## 🔋 Battery Optimization

### Strategies
- **Sensor Batching**: Process multiple readings together
- **Adaptive GPS**: Reduce frequency when stationary
- **Low-Power Mode**: Automatic activation at 20% battery
- **Background Optimization**: Use significant location changes

### Configuration
```typescript
const BatteryConfig = {
    enableOptimization: true,
    lowBatteryThreshold: 0.2,
    sensorBatchSize: 10,
    gpsUpdateInterval: {
        moving: 5000,      // 5s when moving
        stationary: 15000,  // 15s when stationary
        lowBattery: 30000  // 30s when battery low
    }
};
```

## 📱 Cross-Platform Development

### React Native
- Native modules for sensor access
- Platform-specific service implementations
- Unified JavaScript interface

### Flutter
- Platform channels for native communication
- Dart-based business logic
- Native performance with cross-platform UI

## 🧪 Testing & Validation

### Test Types
1. **Unit Tests**: Algorithm validation
2. **Integration Tests**: Service coordination
3. **Performance Tests**: Processing speed validation
4. **Accuracy Tests**: Step count validation

### Validation Methods
- Known distance walking tests
- Comparison with professional pedometers
- GPS accuracy verification
- Battery consumption testing

## 🚀 Deployment

### Permissions Required
- **Android**: ACTIVITY_RECOGNITION, ACCESS_FINE_LOCATION, FOREGROUND_SERVICE
- **iOS**: NSLocationWhenInUseUsageDescription, UIBackgroundModes

### Configuration
```typescript
export const FitnessConfig = {
    // Sensor settings
    accelerometerThreshold: 1.5,
    gyroscopeThreshold: 0.3,
    minStepInterval: 300,
    confidenceThreshold: 0.7,
    
    // GPS settings
    gpsUpdateInterval: 5000,
    accuracyThreshold: 10,
    distanceFilter: 5,
    
    // Battery optimization
    enableBatteryOptimization: true,
    backgroundMode: 'balanced'
};
```

## 📊 Features

### Core Functionality
- ✅ Real-time step counting
- ✅ GPS route tracking
- ✅ Distance calculation
- ✅ Calorie estimation
- ✅ Background monitoring
- ✅ Cross-platform support

### Advanced Features
- 📈 Daily/weekly/monthly analytics
- 🎯 Goal setting and tracking
- 🏆 Achievement system
- 🗺️ Route visualization
- 📱 Offline data storage
- 🔄 Automatic data sync

## 🔒 Privacy & Security

- Local data storage with encryption
- User-controlled data sharing
- GDPR compliance features
- Anonymous analytics options

## 🎯 Future Enhancements

- Machine learning insights
- Wearable device integration
- AI-powered coaching
- Social fitness challenges
- Advanced health analytics

---

This system provides accurate, battery-efficient, and privacy-focused health monitoring without platform dependencies.
