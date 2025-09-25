# 🧠 Intelligent Health Planning System

A comprehensive, AI-powered health planning system that creates personalized, difficulty-based health plans with automatic daily progression and intelligent tracking.

## 🎯 Features

### ✨ Core Features

- **Three Difficulty Levels**: Easy, Moderate, Hard plans tailored to user fitness level
- **Unique Daily Plans**: No meal repetition across 7 days, varied exercises
- **Automatic Daily Progression**: Smart next-day schedule generation
- **Intelligent Health Tracking**: Comprehensive metrics and progress monitoring
- **Real-time Adaptation**: Difficulty adjustment based on completion rates
- **Detailed Plan Views**: Comprehensive plan details with instructions and tips

### 🔧 Technical Features

- **AI-Powered Generation**: Uses OpenAI GPT-4o for intelligent plan creation
- **Database Integration**: Supabase with RLS policies for data security
- **React Components**: Modern, responsive UI components
- **Comprehensive Testing**: Unit and integration tests
- **Error Handling**: Graceful fallbacks and error recovery
- **Performance Optimization**: Efficient database queries and caching

## 🏗️ System Architecture

### Database Schema

```
weekly_plans (main plan storage)
├── id, user_id, difficulty, start_date, end_date
├── days (JSONB array of daily schedules)
├── overall_goals, progress_tips, meal_variations
└── is_active, created_at, updated_at

daily_schedules (next day generation)
├── id, user_id, plan_id, date
├── schedule (JSONB daily schedule)
├── completion_rate
└── created_at, updated_at

activity_completions (tracking)
├── id, user_id, activity_id
├── completed, completed_at, notes
└── created_at, updated_at

health_metrics (health tracking)
├── id, user_id, date
├── weight, body_fat, muscle_mass
├── blood_pressure, heart_rate
├── sleep_hours, sleep_quality
├── energy_level, mood, stress_level
├── water_intake, steps, calories_burned
└── notes, created_at, updated_at
```

### Service Architecture

```
IntelligentHealthPlanningService
├── generateDifficultyOptions()
├── generateWeeklyPlan()
├── generateNextDaySchedule()
├── trackActivityCompletion()
├── getPlanDetails()
└── getUserHealthProgress()

AutomaticDailyScheduler
├── checkAndGenerateNextDay()
├── getDailyProgress()
├── adjustDifficulty()
├── getUserSchedule()
└── updateDailyCompletionRate()

HealthTrackingService
├── recordHealthMetrics()
├── getHealthMetrics()
├── getHealthTrends()
├── generateHealthInsights()
└── generateWeeklyReport()
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Supabase account
- OpenAI API key

### Installation

1. **Install Dependencies**

```bash
npm install
```

2. **Database Setup**

```bash
# Run migrations
supabase db push

# Or manually run SQL files
psql -f supabase/migrations/20250103000000_create_intelligent_health_planning.sql
psql -f supabase/migrations/20250103000001_create_health_metrics.sql
```

3. **Environment Variables**

```bash
# .env.local
OPENAI_API_KEY=your_openai_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Run Tests**

```bash
npm test
```

## 📱 Usage

### 1. Goal Input

```typescript
// User enters their health goal
const userGoal = "I want to lose 20 pounds and build muscle";
```

### 2. Difficulty Selection

```typescript
// Generate three difficulty options
const difficultyOptions =
  await IntelligentHealthPlanningService.generateDifficultyOptions(
    userProfile,
    userGoal
  );

// User selects: easy, moderate, or hard
const selectedDifficulty = "moderate";
```

### 3. Plan Generation

```typescript
// Generate personalized weekly plan
const weeklyPlan = await IntelligentHealthPlanningService.generateWeeklyPlan(
  userProfile,
  selectedDifficulty,
  userGoal
);
```

### 4. Daily Schedule

```typescript
// Get today's schedule
const todaySchedule = await IntelligentHealthPlanningService.getTodaySchedule(
  userId,
  new Date().toISOString().split("T")[0]
);

// Mark activity as completed
await IntelligentHealthPlanningService.markActivityCompleted(
  userId,
  activityId,
  true,
  "Completed successfully"
);
```

### 5. Health Tracking

```typescript
// Record health metrics
const metrics = {
  date: "2024-01-01",
  weight: 75,
  bodyFat: 15,
  sleepHours: 8,
  sleepQuality: 8,
  energyLevel: 7,
  mood: 8,
  stressLevel: 3,
};

await HealthTrackingService.recordHealthMetrics(userId, metrics);

// Get health insights
const insights = await HealthTrackingService.generateHealthInsights(userId);
```

## 🎨 React Components

### DifficultySelection

```tsx
<DifficultySelection
  profile={userProfile}
  userGoal={userGoal}
  onPlanSelected={handlePlanSelected}
  onBack={handleBack}
/>
```

### PlanDetailsPage

```tsx
<PlanDetailsPage
  plan={selectedPlan}
  onStartPlan={handleStartPlan}
  onBack={handleBack}
/>
```

### DailyScheduleView

```tsx
<DailyScheduleView
  userId={userId}
  date={date}
  onActivityComplete={handleActivityComplete}
/>
```

## 🔄 Automatic Daily Progression

### Next Day Generation

```typescript
// Automatically generate next day schedule
const nextDaySchedule = await AutomaticDailyScheduler.checkAndGenerateNextDay(
  userId,
  {
    autoGenerateNextDay: true,
    adjustDifficultyBasedOnCompletion: true,
    completionThresholdForIncrease: 85,
    completionThresholdForDecrease: 50,
  }
);
```

### Difficulty Adjustment

```typescript
// Adjust difficulty based on completion rate
const adjustedDifficulty = AutomaticDailyScheduler.adjustDifficulty(
  currentDifficulty,
  completionRate,
  config
);
```

## 📊 Health Tracking

### Metrics Recording

```typescript
const healthMetrics = {
  date: "2024-01-01",
  weight: 75,
  bodyFat: 15,
  muscleMass: 60,
  sleepHours: 8,
  sleepQuality: 8,
  energyLevel: 7,
  mood: 8,
  stressLevel: 3,
  waterIntake: 2500,
  steps: 10000,
  caloriesBurned: 2000,
};

await HealthTrackingService.recordHealthMetrics(userId, healthMetrics);
```

### Health Insights

```typescript
const insights = await HealthTrackingService.generateHealthInsights(userId);
// Returns: overallHealthScore, improvementAreas, strengths, recommendations, etc.
```

### Weekly Reports

```typescript
const weeklyReport = await HealthTrackingService.generateWeeklyReport(
  userId,
  "2024-01-01"
);
// Returns: completion rates, health changes, insights, recommendations
```

## 🧪 Testing

### Unit Tests

```bash
npm test src/tests/intelligentHealthPlanning.test.ts
```

### Integration Tests

```bash
npm test src/tests/integration.test.ts
```

### Test Coverage

```bash
npm run test:coverage
```

## 🔒 Security

### Row Level Security (RLS)

- All tables have RLS enabled
- Users can only access their own data
- Policies enforce data isolation

### API Security

- OpenAI API key stored securely
- Supabase authentication required
- Input validation and sanitization

## 📈 Performance

### Optimization Features

- Database indexing for fast queries
- Efficient JSONB storage
- Caching for frequently accessed data
- Parallel processing where possible

### Monitoring

- Health score tracking
- Completion rate monitoring
- Performance metrics
- Error logging

## 🚨 Error Handling

### Graceful Degradation

- Fallback plans when AI fails
- Local storage backup
- Error recovery mechanisms
- User-friendly error messages

### Error Types

- Network errors
- API failures
- Database errors
- Validation errors

## 🔧 Configuration

### AI Model Selection

```typescript
const modelSelection = {
  easy: "gpt-3.5-turbo",
  moderate: "gpt-4",
  hard: "gpt-4o",
};
```

### Difficulty Adjustment

```typescript
const difficultyConfig = {
  autoGenerateNextDay: true,
  adjustDifficultyBasedOnCompletion: true,
  maxDifficultyAdjustment: 0.3,
  completionThresholdForIncrease: 85,
  completionThresholdForDecrease: 50,
};
```

## 📚 API Reference

### IntelligentHealthPlanningService

- `generateDifficultyOptions(profile, userGoal)`
- `generateWeeklyPlan(profile, difficulty, userGoal)`
- `generateNextDaySchedule(userId, date, completion)`
- `trackActivityCompletion(userId, activityId, completed, notes)`
- `getPlanDetails(planId)`
- `getUserHealthProgress(userId)`

### AutomaticDailyScheduler

- `checkAndGenerateNextDay(userId, config)`
- `getDailyProgress(userId, date)`
- `adjustDifficulty(currentDifficulty, completion, config)`
- `getUserSchedule(userId, date)`
- `updateDailyCompletionRate(userId, date)`

### HealthTrackingService

- `recordHealthMetrics(userId, metrics)`
- `getHealthMetrics(userId, startDate, endDate)`
- `getHealthTrends(userId, period)`
- `generateHealthInsights(userId)`
- `generateWeeklyReport(userId, weekStart)`

## 🎯 Key Benefits

### For Users

- **Personalized Plans**: Tailored to individual goals and fitness level
- **Unique Daily Content**: No repetitive meals or exercises
- **Automatic Progression**: Smart daily schedule generation
- **Comprehensive Tracking**: Detailed health metrics and insights
- **Adaptive Difficulty**: Plans adjust based on performance

### For Developers

- **Modular Architecture**: Easy to extend and maintain
- **Comprehensive Testing**: High test coverage
- **Error Handling**: Robust error recovery
- **Performance Optimized**: Efficient database operations
- **Well Documented**: Clear API documentation

## 🔮 Future Enhancements

### Planned Features

- **Social Features**: Share progress with friends
- **Wearable Integration**: Connect fitness trackers
- **Nutrition Database**: Comprehensive food database
- **Workout Videos**: Video instructions for exercises
- **Community Challenges**: Group fitness challenges

### Technical Improvements

- **Machine Learning**: Personalized recommendations
- **Real-time Sync**: Live progress updates
- **Offline Support**: Work without internet
- **Advanced Analytics**: Detailed health insights
- **Multi-language**: International support

## 📞 Support

### Documentation

- [API Documentation](./docs/api.md)
- [Component Guide](./docs/components.md)
- [Database Schema](./docs/database.md)

### Issues

- [GitHub Issues](https://github.com/your-repo/issues)
- [Discord Community](https://discord.gg/your-community)

### Contributing

- [Contributing Guide](./CONTRIBUTING.md)
- [Code of Conduct](./CODE_OF_CONDUCT.md)

---

**Built with ❤️ for better health and wellness**
