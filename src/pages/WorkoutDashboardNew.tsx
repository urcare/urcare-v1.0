import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Play, 
  Dumbbell, 
  Users, 
  Calendar,
  Edit,
  ChevronRight,
  RefreshCw,
  Sun,
  Moon,
  Heart,
  Zap,
  ArrowLeft,
  ArrowRight,
  Star,
  Activity,
  Target,
  Timer,
  CheckCircle,
  BarChart3,
  GripVertical,
  Lightbulb,
  TrendingUp,
  Settings
} from "lucide-react";
import { toast } from "sonner";
import { workoutService } from "@/services/workoutService";
import { generatePlanActivities } from "@/services/planActivitiesService";
import { EditPreferencesModal } from "@/components/EditPreferencesModal";
import { CheckDashboardModal } from "@/components/CheckDashboardModal";
import TodaySchedule from "@/components/TodaySchedule";

interface WorkoutActivity {
  id: string;
  title: string;
  duration: string;
  type: string;
  time: string;
  icon?: string;
  isCoachPick?: boolean;
  description?: string;
  completed?: boolean;
  timeSpent?: number;
  instructions?: string[];
  benefits?: string[];
  equipment?: string[];
  difficulty?: string;
  calories?: number;
}

interface HealthPlan {
  id: string;
  title: string;
  description: string;
  activities: WorkoutActivity[];
  focusAreas?: string[];
  difficulty?: string;
  duration?: string;
}

interface WorkoutData {
  activities: WorkoutActivity[];
  totalDuration: number;
  totalCalories: number;
  difficulty: string;
  focusAreas: string[];
}

type ViewMode = 'plans' | 'schedule';

const WorkoutDashboard: React.FC = () => {
  const { user, profile, isInitialized } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // State management
  const [viewMode, setViewMode] = useState<ViewMode>('plans');
  const [plans, setPlans] = useState<HealthPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<HealthPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [showCheckModal, setShowCheckModal] = useState(false);
  const [completedActivities, setCompletedActivities] = useState<Set<string>>(new Set());
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([]);

  // Mock plans data - replace with actual Groq API call
  const mockPlans: HealthPlan[] = [
    {
      id: 'plan-1',
      title: 'Morning Energy Boost',
      description: 'Start your day with energizing activities to boost productivity and mood',
      focusAreas: ['Energy', 'Productivity', 'Morning Routine'],
      difficulty: 'Beginner',
      duration: '4 weeks',
      activities: [
        {
          id: 'activity-1',
          title: 'Morning Meditation',
          time: '07:00',
          duration: '15 min',
          type: 'mindfulness',
          description: 'Start your day with peaceful meditation',
          instructions: ['Find a quiet space', 'Sit comfortably', 'Focus on breathing'],
          benefits: ['Reduced stress', 'Better focus', 'Mental clarity'],
          equipment: ['Meditation cushion'],
          difficulty: 'Beginner',
          calories: 20
        },
        {
          id: 'activity-2',
          title: 'Morning Yoga Flow',
          time: '07:30',
          duration: '30 min',
          type: 'exercise',
          description: 'Gentle yoga to awaken your body',
          instructions: ['Start with sun salutations', 'Flow through poses', 'End with relaxation'],
          benefits: ['Improved flexibility', 'Better posture', 'Increased energy'],
          equipment: ['Yoga mat', 'Comfortable clothes'],
          difficulty: 'Beginner',
          calories: 150
        }
      ]
    },
    {
      id: 'plan-2',
      title: 'Stress Relief & Relaxation',
      description: 'Combat daily stress with calming activities and mindfulness practices',
      focusAreas: ['Stress Relief', 'Relaxation', 'Mental Health'],
      difficulty: 'Beginner',
      duration: '6 weeks',
      activities: [
        {
          id: 'activity-3',
          title: 'Deep Breathing Exercise',
          time: '18:00',
          duration: '10 min',
          type: 'mindfulness',
          description: 'Calm your nervous system with breathing',
          instructions: ['Inhale for 4 counts', 'Hold for 4 counts', 'Exhale for 6 counts'],
          benefits: ['Reduced anxiety', 'Better sleep', 'Lower blood pressure'],
          equipment: [],
          difficulty: 'Beginner',
          calories: 10
        },
        {
          id: 'activity-4',
          title: 'Evening Stretching',
          time: '19:00',
          duration: '20 min',
          type: 'exercise',
          description: 'Release tension from the day',
          instructions: ['Focus on tight areas', 'Hold stretches for 30 seconds', 'Breathe deeply'],
          benefits: ['Muscle relaxation', 'Better sleep', 'Reduced tension'],
          equipment: ['Yoga mat'],
          difficulty: 'Beginner',
          calories: 80
        }
      ]
    },
    {
      id: 'plan-3',
      title: 'Fitness & Strength Building',
      description: 'Build strength and improve overall fitness with structured workouts',
      focusAreas: ['Strength', 'Fitness', 'Muscle Building'],
      difficulty: 'Intermediate',
      duration: '8 weeks',
      activities: [
        {
          id: 'activity-5',
          title: 'Strength Training',
          time: '08:00',
          duration: '45 min',
          type: 'exercise',
          description: 'Build muscle and strength',
          instructions: ['Warm up for 10 minutes', 'Perform 3 sets of 8-12 reps', 'Cool down for 5 minutes'],
          benefits: ['Increased muscle mass', 'Better bone density', 'Improved metabolism'],
          equipment: ['Dumbbells', 'Resistance bands', 'Workout mat'],
          difficulty: 'Intermediate',
          calories: 300
        },
        {
          id: 'activity-6',
          title: 'Cardio Blast',
          time: '20:00',
          duration: '30 min',
          type: 'exercise',
          description: 'High-intensity cardio workout',
          instructions: ['Start with 5-minute warm-up', '20 minutes of intervals', '5-minute cool-down'],
          benefits: ['Improved cardiovascular health', 'Increased endurance', 'Calorie burning'],
          equipment: ['Running shoes', 'Water bottle'],
          difficulty: 'Intermediate',
          calories: 400
        }
      ]
    }
  ];

  // Load plans on component mount
  useEffect(() => {
    if (isInitialized && user) {
      loadPlans();
    }
  }, [isInitialized, user]);

  // Load completion data
  useEffect(() => {
    loadCompletionData();
  }, []);

  const loadPlans = async () => {
    setIsLoading(true);
    try {
      // For now, use mock data. Replace with actual Groq API call
      setPlans(mockPlans);
      setViewMode('plans');
    } catch (error) {
      console.error('Error loading plans:', error);
      toast.error('Failed to load health plans');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCompletionData = () => {
    try {
      const completions = JSON.parse(localStorage.getItem('workoutCompletions') || '[]');
      const completedIds = new Set<string>(completions.map((c: any) => c.activityId as string));
      setCompletedActivities(completedIds);
    } catch (error) {
      console.error('Error loading completion data:', error);
    }
  };

  const handleSetProtocol = (plan: HealthPlan) => {
    setSelectedPlan(plan);
    setViewMode('schedule');
    toast.success(`Protocol set: ${plan.title}`);
  };

  const handleBackToPlans = () => {
    setViewMode('plans');
    setSelectedPlan(null);
  };

  const handleActivityComplete = (activityId: string) => {
    const newCompleted = new Set(completedActivities);
    if (newCompleted.has(activityId)) {
      newCompleted.delete(activityId);
    } else {
      newCompleted.add(activityId);
    }
    setCompletedActivities(newCompleted);
    
    // Save to localStorage
    const completions = Array.from(newCompleted).map(id => ({
      activityId: id,
      completedAt: new Date().toISOString(),
      timeSpent: 30 // Default time spent
    }));
    localStorage.setItem('workoutCompletions', JSON.stringify(completions));
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {viewMode === 'plans' ? 'Choose Your Plan' : 'Today\'s Schedule'}
            </h1>
            <p className="text-gray-600">
              {viewMode === 'plans' 
                ? 'Select a health plan that fits your goals and lifestyle'
                : selectedPlan ? `Following: ${selectedPlan.title}` : 'Your personalized daily routine'
              }
            </p>
          </div>
          <div className="flex gap-2">
            {viewMode === 'schedule' && (
              <Button
                onClick={handleBackToPlans}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Plans
              </Button>
            )}
            <Button
              onClick={() => setShowPreferences(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Preferences
            </Button>
            <Button
              onClick={() => setShowCheckModal(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Check Progress
            </Button>
          </div>
        </div>

        {/* Plans View */}
        {viewMode === 'plans' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card 
                key={plan.id}
                className="group hover:shadow-xl transition-all duration-300 border-0 backdrop-blur-sm shadow-lg hover:scale-[1.02] cursor-pointer"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                        {plan.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 leading-relaxed">
                        {plan.description}
                      </CardDescription>
                    </div>
                    <div className="ml-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                        <Heart className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {/* Plan Details */}
                    <div className="flex flex-wrap gap-2">
                      {plan.focusAreas?.map((area, index) => (
                        <Badge 
                          key={index}
                          variant="secondary" 
                          className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                        >
                          {area}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          <span>{plan.difficulty}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{plan.duration}</span>
                        </div>
                      </div>
                    </div>

                    {/* Activities Preview */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-800 text-sm">Activities Preview:</h4>
                      {plan.activities.slice(0, 2).map((activity) => (
                        <div key={activity.id} className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>{activity.title}</span>
                          <span className="text-gray-400">•</span>
                          <span>{activity.time}</span>
                        </div>
                      ))}
                      {plan.activities.length > 2 && (
                        <div className="text-sm text-gray-500">
                          +{plan.activities.length - 2} more activities
                        </div>
                      )}
                    </div>

                    {/* Set Protocol Button */}
                    <Button
                      onClick={() => handleSetProtocol(plan)}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
                    >
                      Set Protocol
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Schedule View */}
        {viewMode === 'schedule' && (
          <TodaySchedule plan={selectedPlan} />
        )}

        {/* Modals */}
        <EditPreferencesModal
          isOpen={showPreferences}
          onClose={() => setShowPreferences(false)}
          preferences={{
            yogaLevel: 'Beginner',
            equipment: ['Yoga mat', 'Dumbbells'],
            location: 'Home',
            workoutIntensity: 'Moderate',
            preferredTime: 'Morning',
            restDays: ['Sunday']
          }}
          onSave={(preferences) => {
            console.log('Preferences saved:', preferences);
            setShowPreferences(false);
          }}
        />

        <CheckDashboardModal
          isOpen={showCheckModal}
          onClose={() => setShowCheckModal(false)}
          activities={selectedPlan?.activities || []}
          completedActivities={completedActivities}
          onActivityComplete={handleActivityComplete}
        />
      </div>
    </div>
  );
};

export default WorkoutDashboard;


