# AI Health Assistant for UrCare App

## 🎯 Overview

The AI Health Assistant is a sophisticated system that generates personalized daily health plans based on user inputs across five key customization dimensions. It provides hour-by-hour daily schedules that integrate nutrition, exercise, detoxification, medication optimization, and lifestyle factors.

## ✨ Key Features

### 1. **Personalized Nutrition Planning**

- Tailors diet plans according to food preferences, body type, and metabolic response
- Adjusts calories, macro balance, and timing of meals
- Considers dietary restrictions (vegetarian, vegan, allergies, religious preferences)
- Calculates BMR and TDEE using Mifflin-St Jeor Equation
- Provides specific meal timing and portion guidance

### 2. **Custom Exercise Protocol**

- Recommends exercise routines based on age, mobility, and fitness goals
- Specifies exercise type, duration, and optimal timing
- Includes rest and recovery recommendations
- Adjusts intensity based on current fitness level and age
- Progressive training approach with measurable goals

### 3. **Targeted Detoxification**

- Suggests practical detox strategies based on health history
- Recommends daily toxin-flushing habits
- Morning hydration protocols with lemon water
- Herbal tea recommendations (green tea, chamomile)
- Evening wind-down routines for better sleep

### 4. **Medication Optimization**

- Integrates prescribed medications into daily routine
- Ensures correct timing (before/after meals, morning/night)
- Tracks medication interactions and safety
- Provides medication reminders and instructions
- Optimizes timing based on user's schedule

### 5. **Lifestyle Integration**

- Adapts plans to work schedule, sleep patterns, and stress levels
- Suggests optimal sleep times and stress management techniques
- Includes meditation, deep breathing, and journaling recommendations
- Ensures balance between productivity and health
- Provides actionable lifestyle tips

## 🏗️ Architecture

### Core Components

1. **AIHealthAssistantService** (`src/services/aiHealthAssistantService.ts`)

   - Main service class that handles plan generation
   - OpenAI integration for advanced AI-powered plans
   - Rule-based fallback system for reliability
   - Comprehensive health calculations and algorithms

2. **AIDailyHealthPlan Component** (`src/components/health/AIDailyHealthPlan.tsx`)

   - React component for displaying generated plans
   - Tabbed interface for different plan sections
   - Interactive plan generation and management
   - Beautiful, responsive UI design

3. **Demo Page** (`src/pages/AIHealthAssistantDemo.tsx`)
   - Complete demonstration of the system
   - Step-by-step user profile creation
   - Real-time plan generation and display
   - Educational information about the system

### Data Flow

```
User Input → Profile Creation → AI Analysis → Plan Generation → Display & Management
     ↓              ↓              ↓              ↓              ↓
Health Data → UserProfile → AI Service → DailyPlan → React Component
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- React 18+ with TypeScript
- Supabase for database (optional)
- OpenAI API key (optional, for enhanced AI features)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd urcare-v1.0
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   # .env.local
   REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Navigate to the demo page**
   ```
   http://localhost:5173/ai-health-assistant-demo
   ```

## 📱 Usage

### 1. **Create User Profile**

- Fill in basic information (age, gender, height, weight)
- Select body type and fitness goals
- Specify dietary preferences and allergies
- Add health conditions and stress level

### 2. **Configure Daily Schedule**

- Set work schedule and type
- Define sleep patterns and quality
- Add medications and timing instructions
- Customize activity preferences

### 3. **Generate Health Plan**

- Click "Generate Daily Plan" button
- AI processes your profile and creates personalized schedule
- Review the comprehensive daily plan
- Access detailed information in organized tabs

### 4. **Review and Customize**

- **Daily Schedule Tab**: Hour-by-hour breakdown of activities
- **Nutrition Tab**: Calorie targets, macros, and meal timing
- **Exercise Tab**: Workout sessions and fitness recommendations
- **Detox Tab**: Hydration goals and wellness strategies
- **Summary Tab**: Key takeaways, tips, and warnings

## 🔧 Configuration

### OpenAI Integration

The system automatically uses OpenAI when available:

```typescript
// Automatically detects and uses OpenAI API
const plan = await aiHealthAssistantService.generateDailyPlan(userProfile);
```

### Rule-Based Fallback

When OpenAI is unavailable, the system uses sophisticated rule-based algorithms:

```typescript
// Fallback to rule-based generation
private generateRuleBased(profile: UserHealthProfile): PersonalizedDailyPlan {
  // Comprehensive rule-based logic
  // Nutrition calculations, exercise planning, etc.
}
```

### Customization Options

You can customize various aspects of the system:

```typescript
// Modify health calculations
private calculateNutrition(profile: UserHealthProfile) {
  // Custom BMR calculations
  // Adjustable macro ratios
  // Goal-specific calorie adjustments
}

// Customize exercise recommendations
private generateExercisePlan(profile: UserHealthProfile) {
  // Age-appropriate intensity
  // Goal-specific frequency
  // Progressive overload planning
}
```

## 📊 Data Models

### UserHealthProfile Interface

```typescript
interface UserHealthProfile {
  age: number;
  gender: "male" | "female" | "other";
  bodyType: "ectomorph" | "mesomorph" | "endomorph";
  foodPreferences: string[];
  allergies: string[];
  healthConditions: string[];
  medications: MedicationInfo[];
  workSchedule: WorkScheduleInfo;
  sleepPattern: SleepPatternInfo;
  stressLevel: "low" | "moderate" | "high" | "very-high";
  fitnessGoals: string[];
  currentFitnessLevel: "beginner" | "intermediate" | "advanced";
  height: number;
  weight: number;
  activityLevel: ActivityLevel;
}
```

### PersonalizedDailyPlan Interface

```typescript
interface PersonalizedDailyPlan {
  date: string;
  userProfile: UserHealthProfile;
  schedule: DailyScheduleItem[];
  nutritionSummary: NutritionSummary;
  exerciseSummary: ExerciseSummary;
  detoxSummary: DetoxSummary;
  medicationSchedule: MedicationSchedule;
  lifestyleTips: string[];
  keyTakeaways: string[];
  warnings: string[];
}
```

## 🎨 UI Components

### Tabbed Interface

The system uses a clean, organized tabbed interface:

- **Daily Schedule**: Timeline view of all activities
- **Nutrition**: Detailed nutrition breakdown and meal planning
- **Exercise**: Workout sessions and fitness metrics
- **Detox**: Wellness strategies and hydration tracking
- **Summary**: Key insights and actionable recommendations

### Responsive Design

- Mobile-first approach
- Adaptive layouts for different screen sizes
- Touch-friendly interface elements
- Optimized for both desktop and mobile use

## 🔒 Security & Privacy

### Data Handling

- All health data is processed locally when possible
- OpenAI API calls only send necessary profile information
- No sensitive health data is stored externally
- Optional Supabase integration for user data persistence

### Safety Features

- Comprehensive input validation
- Safe fallback mechanisms
- Medical disclaimers and warnings
- Conservative health recommendations

## 🧪 Testing

### Manual Testing

1. **Profile Creation**: Test all form fields and validation
2. **Plan Generation**: Verify AI and rule-based fallback
3. **UI Responsiveness**: Test on different screen sizes
4. **Data Persistence**: Verify plan saving and loading

### Automated Testing

```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e
```

## 🚀 Deployment

### Production Build

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

### Environment Configuration

```bash
# Production environment variables
REACT_APP_OPENAI_API_KEY=prod_openai_key
REACT_APP_SUPABASE_URL=prod_supabase_url
REACT_APP_SUPABASE_ANON_KEY=prod_supabase_key
NODE_ENV=production
```

## 🤝 Contributing

### Development Guidelines

1. **Code Style**: Follow TypeScript and React best practices
2. **Testing**: Write tests for new features
3. **Documentation**: Update README and code comments
4. **Performance**: Optimize for mobile devices
5. **Accessibility**: Ensure WCAG compliance

### Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests and documentation
5. Submit a pull request

## 📈 Future Enhancements

### Planned Features

- **Machine Learning Integration**: Personalized plan learning from user feedback
- **Real-time Health Monitoring**: Integration with health devices and wearables
- **Social Features**: Community challenges and support groups
- **Advanced Analytics**: Detailed progress tracking and insights
- **Multi-language Support**: Internationalization for global users

### API Extensions

- **Webhook Support**: Real-time plan updates
- **Third-party Integrations**: Fitness apps, nutrition databases
- **Mobile SDK**: Native mobile app support
- **Voice Interface**: Voice-activated plan generation

## 📞 Support

### Documentation

- [API Reference](./docs/api-reference.md)
- [Component Library](./docs/components.md)
- [Deployment Guide](./docs/deployment.md)
- [Troubleshooting](./docs/troubleshooting.md)

### Community

- [GitHub Issues](https://github.com/urcare/urcare-v1.0/issues)
- [Discord Community](https://discord.gg/urcare)
- [Email Support](mailto:support@urcare.com)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for AI-powered health recommendations
- Supabase for backend infrastructure
- React and TypeScript communities
- Health and fitness experts for guidance
- Beta testers and early adopters

---

**Built with ❤️ for better health and wellness**

_This system is designed to provide general health guidance and should not replace professional medical advice. Always consult with healthcare providers for specific health concerns._
