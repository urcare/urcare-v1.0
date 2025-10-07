import { supabase } from "@/integrations/supabase/client";

interface WorkoutActivity {
  id: string;
  title: string;
  duration: string;
  type: string;
  time: string;
  icon?: string;
  isCoachPick?: boolean;
  description?: string;
  instructions?: string[];
  benefits?: string[];
}

interface DaySummary {
  totalTime: string;
  focus: string;
  readiness: string;
  readinessColor: string;
}

interface UserPreferences {
  yogaLevel: string;
  equipment: string[];
  location: string;
  workoutIntensity?: string;
  preferredTime?: string;
  restDays?: string[];
}

interface UpcomingDay {
  day: string;
  title: string;
  description: string;
}

interface WorkoutDashboardData {
  activities: WorkoutActivity[];
  daySummary: DaySummary;
  preferences: UserPreferences;
  upcomingDays: UpcomingDay[];
  intensity: string;
  currentDay: string;
}

export class WorkoutService {
  async generateWorkoutSchedule(plan: any, userProfile: any, preferences: any): Promise<WorkoutDashboardData> {
    // Generate workout data using fallback (AI function not implemented)
    console.log('Generating workout schedule using fallback data');
    return this.generateFallbackWorkoutData(plan, userProfile, preferences);
  }

  private generateFallbackWorkoutData(plan: any, userProfile: any, preferences: any): WorkoutDashboardData {
    const currentDate = new Date();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDayName = dayNames[currentDate.getDay()];

    return {
      activities: [
        {
          id: "1",
          title: "Sunrise Mobility Flow",
          duration: "10-12 min",
          type: "Warm-up",
          time: "6:30 AM",
          icon: "sunrise",
          description: "Gentle morning movement to wake up your body",
          instructions: [
            "Start with gentle neck rolls and shoulder circles",
            "Perform arm swings and hip circles",
            "Do light leg swings and ankle rolls",
            "Finish with deep breathing exercises"
          ],
          benefits: [
            "Improves circulation",
            "Reduces morning stiffness",
            "Enhances flexibility",
            "Boosts energy levels"
          ]
        },
        {
          id: "2",
          title: "Gentle Yoga",
          duration: "25 min",
          type: "Flexibility",
          time: "8:00 AM",
          icon: "yoga",
          isCoachPick: true,
          description: "Beginner-friendly yoga flow for flexibility",
          instructions: [
            "Start in child's pose for 2 minutes",
            "Move through cat-cow stretches",
            "Practice downward dog and plank",
            "End with seated forward fold"
          ],
          benefits: [
            "Improves flexibility and mobility",
            "Reduces stress and anxiety",
            "Strengthens core muscles",
            "Enhances mind-body connection"
          ]
        },
        {
          id: "3",
          title: "Lunchtime Walk",
          duration: "20 min",
          type: "Light cardio",
          time: "12:30 PM",
          icon: "walk",
          description: "Light walk to break up your day",
          instructions: [
            "Walk at a comfortable pace",
            "Maintain good posture",
            "Take deep breaths",
            "Enjoy the fresh air"
          ],
          benefits: [
            "Boosts energy levels",
            "Improves digestion",
            "Reduces stress",
            "Increases daily step count"
          ]
        },
        {
          id: "4",
          title: "Strength Circuit",
          duration: "30 min",
          type: "Full body",
          time: "5:30 PM",
          icon: "strength",
          description: "Full body strength training circuit",
          instructions: [
            "Warm up with 5 minutes of light movement",
            "Perform 3 rounds of: push-ups, squats, lunges",
            "Rest 1 minute between rounds",
            "Cool down with stretching"
          ],
          benefits: [
            "Builds muscle strength",
            "Improves bone density",
            "Boosts metabolism",
            "Enhances overall fitness"
          ]
        },
        {
          id: "5",
          title: "Wind-down Stretch + Breath",
          duration: "12 min",
          type: "Recovery",
          time: "9:00 PM",
          icon: "recovery",
          description: "Evening relaxation and breathing exercises",
          instructions: [
            "Find a quiet, comfortable space",
            "Practice 4-7-8 breathing technique",
            "Gentle neck and shoulder stretches",
            "End with body scan meditation"
          ],
          benefits: [
            "Promotes better sleep",
            "Reduces muscle tension",
            "Calms the nervous system",
            "Improves sleep quality"
          ]
        }
      ],
      daySummary: {
        totalTime: "1h 39m",
        focus: plan?.focus_areas?.join(" + ") || "Mobility + Strength",
        readiness: "Ready",
        readinessColor: "bg-blue-100 text-blue-800"
      },
      preferences: {
        yogaLevel: preferences?.yogaLevel || "Beginner",
        equipment: preferences?.equipment || ["Mat", "Bands"],
        location: preferences?.location || "Home",
        workoutIntensity: preferences?.workoutIntensity || "moderate",
        preferredTime: preferences?.preferredTime || "morning",
        restDays: preferences?.restDays || ["sunday"]
      },
      upcomingDays: [
        {
          day: "Tuesday",
          title: "Intervals + Core",
          description: "High-intensity interval training with core focus"
        },
        {
          day: "Wednesday", 
          title: "Active recovery",
          description: "Light movement and stretching"
        },
        {
          day: "Thursday",
          title: "Upper body strength",
          description: "Focused upper body strength training"
        }
      ],
      intensity: plan?.difficulty === 'beginner' ? 'Light' : 
                plan?.difficulty === 'intermediate' ? 'Moderate' : 'Intense',
      currentDay: `Today • ${currentDayName.slice(0, 3)}`
    };
  }
}

export const workoutService = new WorkoutService();

