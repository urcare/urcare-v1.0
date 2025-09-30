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
  TrendingUp
} from "lucide-react";
import { toast } from "sonner";
import { workoutService } from "@/services/workoutService";
import { EditPreferencesModal } from "@/components/EditPreferencesModal";
import { CheckDashboardModal } from "@/components/CheckDashboardModal";

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
  workoutIntensity: string;
  preferredTime: string;
  restDays: string[];
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

const WorkoutDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [workoutData, setWorkoutData] = useState<WorkoutDashboardData | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [showEditPreferences, setShowEditPreferences] = useState(false);
  const [showCheckDashboard, setShowCheckDashboard] = useState(false);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [completedActivities, setCompletedActivities] = useState<Set<string>>(new Set());
  const [energyLevel, setEnergyLevel] = useState(3);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [missingActivities, setMissingActivities] = useState<string[]>([]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [weeklyProgress, setWeeklyProgress] = useState<any[]>([]);
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([]);

  const generateWorkoutData = useCallback(async (plan: any) => {
    // Prevent duplicate calls
    if (generating) {
      console.log('Already generating workout data, skipping...');
      return;
    }

    setLoading(true);
    setGenerating(true);

    try {
      // Generate workout data directly without calling Supabase function
      const workoutDataWithPreferences: WorkoutDashboardData = {
        activities: [
          {
            id: "morning_breathing",
            title: "Blood Pressure Breathing Exercise",
            duration: "10 min",
            type: "Meditation",
            time: "07:00",
            icon: "sunrise",
            isCoachPick: false,
            description: "Gentle breathing techniques to lower blood pressure",
            completed: false
          },
          {
            id: "swimming_session",
            title: "Swimming Workout",
            duration: "30 min",
            type: "Exercise",
            time: "18:00",
            icon: "swimming",
            isCoachPick: true,
            description: "Low-impact swimming for cardiovascular health",
            completed: false
          },
          {
            id: "sleep_hygiene",
            title: "Sleep Hygiene Routine",
            duration: "20 min",
            type: "Sleep",
            time: "22:00",
            icon: "moon",
            isCoachPick: false,
            description: "Evening routine to improve sleep quality",
            completed: false
          }
        ],
        daySummary: {
          totalTime: "1h 0m",
          focus: "heart health + stress management + sleep optimization",
          readiness: "Ready",
          readinessColor: "bg-green-100 text-green-800"
        },
        preferences: {
          yogaLevel: 'Beginner',
          equipment: ['Mat', 'Bands'],
          location: 'Home',
          workoutIntensity: 'moderate',
          preferredTime: 'morning',
          restDays: ['sunday']
        },
        upcomingDays: getUpcomingDays(),
        intensity: "moderate",
        currentDay: getCurrentDayName()
      };
      
      setWorkoutData(workoutDataWithPreferences);
      
      // Generate AI recommendations and weekly progress
      generateRecommendations();
      
    } catch (error) {
      console.error('Error generating workout data:', error);
      toast.error('Failed to generate workout data');
    } finally {
      setLoading(false);
      setGenerating(false);
    }
  }, [generating, profile]);

  useEffect(() => {
    console.log("WorkoutDashboard useEffect - user:", !!user, "profile:", !!profile);
    console.log("Location state:", location.state);
    
    if (!user || !profile) {
      console.log("No user or profile, redirecting to onboarding");
      navigate("/onboarding");
      return;
    }

    // Prevent multiple initializations
    if (isInitialized) {
      console.log("Already initialized, skipping...");
      return;
    }

    // Get selected plan from location state
    const plan = location.state?.selectedPlan;
    console.log("Selected plan from location state:", plan);
    
    if (plan) {
      console.log("Plan found, setting selected plan and generating workout data");
      setSelectedPlan(plan);
      generateWorkoutData(plan);
      setIsInitialized(true);
    } else {
      console.log("No plan provided, redirecting to health-plan-generation");
      // If no plan provided, redirect back to plan selection
      navigate("/health-plan-generation");
    }
  }, [user, profile, navigate, location.state?.selectedPlan, isInitialized]); // Removed generateWorkoutData from dependencies

  // Load completion data from localStorage
  useEffect(() => {
    const loadCompletionData = () => {
      try {
        const completions = JSON.parse(localStorage.getItem('workoutCompletions') || '[]');
        const completedIds = new Set<string>(completions.map((c: any) => c.activityId as string));
        setCompletedActivities(completedIds);
        
        // Update workout data with completion info
        if (workoutData) {
          const updatedActivities = workoutData.activities.map(activity => {
            const completion = completions.find((c: any) => c.activityId === activity.id);
            return completion 
              ? { ...activity, completed: true, timeSpent: completion.timeSpent }
              : activity;
          });
          
          setWorkoutData({
            ...workoutData,
            activities: updatedActivities
          });
        }
      } catch (error) {
        console.error('Error loading completion data:', error);
      }
    };

    loadCompletionData();
  }, [workoutData]);


  // Drag and drop functionality
  const handleDragStart = (e: React.DragEvent, activityId: string) => {
    setDraggedItem(activityId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetActivityId: string) => {
    e.preventDefault();
    
    if (!draggedItem || !workoutData) return;
    
    const activities = [...workoutData.activities];
    const draggedIndex = activities.findIndex(activity => activity.id === draggedItem);
    const targetIndex = activities.findIndex(activity => activity.id === targetActivityId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;
    
    // Swap the activities
    const draggedActivity = activities[draggedIndex];
    const targetActivity = activities[targetIndex];
    
    // Keep the original times but swap the activities
    const tempTime = draggedActivity.time;
    draggedActivity.time = targetActivity.time;
    targetActivity.time = tempTime;
    
    // Swap positions
    activities[draggedIndex] = targetActivity;
    activities[targetIndex] = draggedActivity;
    
    setWorkoutData({
      ...workoutData,
      activities
    });
    
    setDraggedItem(null);
    toast.success("Workout order updated!");
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleSavePreferences = (preferences: UserPreferences) => {
    if (workoutData) {
      setWorkoutData({
        ...workoutData,
        preferences
      });
    }
  };

  const handleRegeneratePlan = async () => {
    setGenerating(true);
    try {
      // Regenerate the workout plan
      await generateWorkoutData(selectedPlan);
      toast.success("Workout plan regenerated!");
    } catch (error) {
      toast.error("Failed to regenerate plan");
    } finally {
      setGenerating(false);
    }
  };

  const handleNextDay = () => {
    if (workoutData && currentDayIndex < workoutData.upcomingDays.length - 1) {
      setCurrentDayIndex(currentDayIndex + 1);
    }
  };

  const handlePreviousDay = () => {
    if (currentDayIndex > 0) {
      setCurrentDayIndex(currentDayIndex - 1);
    }
  };

  const handleViewPlan = (dayIndex: number) => {
    setCurrentDayIndex(dayIndex);
    
    // Generate specific plan for the selected day
    const upcomingDays = getUpcomingDays();
    const selectedDay = upcomingDays[dayIndex];
    
    // Create day-specific activities based on the plan
    const dayActivities = generateDaySpecificActivities(selectedDay, dayIndex);
    
    // Show the day-specific plan in a modal
    setShowCheckDashboard(true);
    
    // Store the day-specific activities for the modal
    setWorkoutData(prev => prev ? {
      ...prev,
      activities: dayActivities,
      currentDay: selectedDay.day
    } : null);
  };

  const generateDaySpecificActivities = (dayPlan: any, dayIndex: number) => {
    const baseTime = "07:00";
    const activities = [];
    
    // Generate different activities based on the day plan and user's chronic conditions
    if (dayPlan.title.includes("Intervals")) {
      activities.push(
        {
          id: `intervals_warmup_${dayIndex}`,
          title: "Blood Pressure Warm-up",
          duration: "10 min",
          type: "Warm-up",
          time: baseTime,
          icon: "sunrise",
          isCoachPick: false,
          description: "Gentle warm-up focusing on blood pressure control",
          completed: false
        },
        {
          id: `intervals_main_${dayIndex}`,
          title: "Low-Impact HIIT",
          duration: "25 min",
          type: "Exercise",
          time: "07:15",
          icon: "heart",
          isCoachPick: true,
          description: "High-intensity intervals safe for blood pressure",
          completed: false
        },
        {
          id: `intervals_core_${dayIndex}`,
          title: "Core Strengthening",
          duration: "15 min",
          type: "Exercise",
          time: "07:45",
          icon: "dumbbell",
          isCoachPick: false,
          description: "Core exercises for better posture and blood pressure",
          completed: false
        }
      );
    } else if (dayPlan.title.includes("Yoga")) {
      activities.push(
        {
          id: `yoga_breathing_${dayIndex}`,
          title: "Blood Pressure Breathing",
          duration: "15 min",
          type: "Meditation",
          time: baseTime,
          icon: "sunrise",
          isCoachPick: false,
          description: "Yogic breathing techniques to lower blood pressure",
          completed: false
        },
        {
          id: `yoga_flow_${dayIndex}`,
          title: "Gentle Yoga Flow",
          duration: "30 min",
          type: "Flexibility",
          time: "07:20",
          icon: "heart",
          isCoachPick: true,
          description: "Flowing yoga sequence for stress reduction",
          completed: false
        },
        {
          id: `yoga_savasana_${dayIndex}`,
          title: "Relaxation Pose",
          duration: "10 min",
          type: "Recovery",
          time: "07:55",
          icon: "moon",
          isCoachPick: false,
          description: "Deep relaxation to calm the nervous system",
          completed: false
        }
      );
    } else if (dayPlan.title.includes("Swimming")) {
      activities.push(
        {
          id: `swim_warmup_${dayIndex}`,
          title: "Pool Warm-up",
          duration: "10 min",
          type: "Warm-up",
          time: baseTime,
          icon: "sunrise",
          isCoachPick: false,
          description: "Gentle pool warm-up for blood pressure management",
          completed: false
        },
        {
          id: `swim_main_${dayIndex}`,
          title: "Swimming Workout",
          duration: "35 min",
          type: "Exercise",
          time: "07:15",
          icon: "swimming",
          isCoachPick: true,
          description: "Swimming session for cardiovascular health",
          completed: false
        },
        {
          id: `swim_cooldown_${dayIndex}`,
          title: "Pool Cooldown",
          duration: "10 min",
          type: "Recovery",
          time: "07:55",
          icon: "moon",
          isCoachPick: false,
          description: "Gentle cooldown in the pool",
          completed: false
        }
      );
    } else {
      // Default activities for other plans
      activities.push(
        {
          id: `default_1_${dayIndex}`,
          title: "Morning Routine",
          duration: "15 min",
          type: "Warm-up",
          time: baseTime,
          icon: "sunrise",
          isCoachPick: false,
          description: "Morning routine for health conditions",
          completed: false
        },
        {
          id: `default_2_${dayIndex}`,
          title: dayPlan.title,
          duration: "30 min",
          type: "Exercise",
          time: "07:20",
          icon: "heart",
          isCoachPick: true,
          description: dayPlan.description,
          completed: false
        },
        {
          id: `default_3_${dayIndex}`,
          title: "Evening Wind-down",
          duration: "15 min",
          type: "Recovery",
          time: "22:00",
          icon: "moon",
          isCoachPick: false,
          description: "Evening routine for better sleep",
          completed: false
        }
      );
    }
    
    return activities;
  };

  const getUpcomingDays = () => {
    const today = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const upcomingDays = [];
    
    for (let i = 1; i <= 3; i++) {
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + i);
      const dayName = days[futureDate.getDay()];
      
      // Generate AI-based workout plans for each day
      const workoutTypes = [
        { title: "Intervals + Core", description: "High-intensity interval training with core focus" },
        { title: "Active Recovery", description: "Light movement and stretching" },
        { title: "Upper Body Strength", description: "Focused upper body strength training" },
        { title: "Cardio Blast", description: "Intense cardiovascular workout" },
        { title: "Yoga Flow", description: "Dynamic yoga sequence for flexibility" },
        { title: "Swimming Session", description: "Full-body swimming workout" },
        { title: "Lower Body Focus", description: "Targeted lower body strength training" }
      ];
      
      const randomWorkout = workoutTypes[Math.floor(Math.random() * workoutTypes.length)];
      
      upcomingDays.push({
        day: dayName,
        title: randomWorkout.title,
        description: randomWorkout.description,
        date: futureDate
      });
    }
    
    return upcomingDays;
  };

  const handleStartWorkout = (activity: WorkoutActivity) => {
    navigate("/workout-activity", {
      state: {
        activity,
        activityId: activity.id
      }
    });
  };


  const generateWeeklyProgress = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const progress = days.map((day, index) => {
      const dayCompletions = JSON.parse(localStorage.getItem(`workoutCompletions_${day}`) || '[]');
      const completedCount = dayCompletions.length;
      const totalCount = workoutData?.activities.length || 5;
      const completionRate = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
      
      return {
        day,
        completionRate,
        completedCount,
        totalCount,
        date: new Date(Date.now() + (index - new Date().getDay() + 1) * 24 * 60 * 60 * 1000)
      };
    });
    
    setWeeklyProgress(progress);
  };

  const generateAIRecommendations = () => {
    const completedCount = completedActivities.size;
    const totalCount = workoutData?.activities.length || 0;
    const completionRate = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
    
    const recommendations = [];
    
    // Based on user's health goals and profile
    if (profile?.health_goals?.includes('control_high_blood_pressure')) {
      recommendations.push("Focus on low-intensity cardio like swimming to help manage blood pressure");
      recommendations.push("Include 10 minutes of deep breathing exercises to reduce stress");
    }
    
    if (profile?.health_goals?.includes('improve_sleep')) {
      recommendations.push("Complete your evening wind-down routine 1 hour before bedtime");
      recommendations.push("Avoid intense workouts 3 hours before sleep for better rest");
    }
    
    if (profile?.workout_type === 'Swimming') {
      recommendations.push("Swimming is excellent for your cardiovascular health - aim for 30 minutes");
      recommendations.push("Focus on proper breathing technique during your swim sessions");
    }
    
    // Completion-based recommendations
    if (completionRate >= 80) {
      recommendations.push("Excellent progress! You're on track to meet your daily goals.");
      recommendations.push("Consider adding a short walk or stretching session to maintain momentum.");
    } else if (completionRate >= 50) {
      recommendations.push("Good progress! Try to complete the remaining activities for maximum benefit.");
      recommendations.push("Take short breaks between activities to maintain energy levels.");
    } else {
      recommendations.push("You're getting started! Every small step counts towards your health goals.");
      recommendations.push("Consider starting with shorter activities and gradually increasing intensity.");
    }
    
    // Energy-based recommendations
    if (energyLevel >= 4) {
      recommendations.push("Your energy is high! Perfect time for more intense activities.");
    } else if (energyLevel <= 2) {
      recommendations.push("Your energy seems low. Focus on gentle activities and proper rest.");
    }
    
    setAiRecommendations(recommendations);
    
    // Generate missing activities
    const missing = [];
    if (completionRate < 100) {
      missing.push("Complete remaining workout activities");
    }
    if (energyLevel < 4) {
      missing.push("Consider light movement or stretching");
    }
    missing.push("Stay hydrated throughout the day");
    missing.push("Get adequate sleep (7-9 hours)");
    
    setMissingActivities(missing);
  };

  const generateRecommendations = () => {
    generateWeeklyProgress();
    generateAIRecommendations();
  };

  const getCurrentDayName = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  };

  const calculateTotalTime = () => {
    if (!workoutData) return "0h 0m";
    
    const totalMinutes = workoutData.activities.reduce((total, activity) => {
      if (activity.completed && activity.timeSpent) {
        return total + activity.timeSpent;
      }
      return total;
    }, 0);
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return `${hours}h ${minutes}m`;
  };

  const clearCompletionData = () => {
    localStorage.removeItem('workoutCompletions');
    setCompletedActivities(new Set());
    if (workoutData) {
      const updatedActivities = workoutData.activities.map(activity => ({
        ...activity,
        completed: false,
        timeSpent: undefined
      }));
      setWorkoutData({
        ...workoutData,
        activities: updatedActivities
      });
    }
    toast.success("Completion data cleared!");
  };

  const getActivityIcon = (icon: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      sunrise: <Sun className="w-4 h-4" />,
      yoga: <Heart className="w-4 h-4" />,
      walk: <Users className="w-4 h-4" />,
      strength: <Dumbbell className="w-4 h-4" />,
      recovery: <Moon className="w-4 h-4" />
    };
    return iconMap[icon] || <Zap className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-indigo-400 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Generating Your Workout Plan
            </h2>
            <p className="text-slate-600 text-lg">
              Creating personalized workouts based on your selected plan...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!workoutData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto">
            <Activity className="w-8 h-8 text-slate-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              No Workout Data Available
            </h2>
            <p className="text-slate-600 text-lg">
              Unable to generate workout data. Please try again.
            </p>
          </div>
          <Button 
            onClick={() => navigate("/health-plan-generation")}
            className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Back to Plan Selection
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 space-y-4 lg:space-y-0">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent">
              {getCurrentDayName()}'s Personalized Workouts
            </h1>
            <p className="text-slate-600 text-lg">
              Built from your goals and recovery. Stay flexible—swap or skip anytime.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge className="px-4 py-2 bg-slate-200 text-slate-700 font-medium">
              {getCurrentDayName()}
            </Badge>
            <Badge className="px-4 py-2 bg-blue-100 text-blue-700 font-medium">
              Intensity: {workoutData.intensity}
            </Badge>
            <Button
              onClick={handleRegeneratePlan}
              disabled={generating}
              className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {generating ? (
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Regenerate plan
            </Button>
            <Button
              onClick={clearCompletionData}
              variant="outline"
              className="border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2"
            >
              Clear Progress
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Workout Activities */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              {workoutData.activities.map((activity, index) => (
                <Card 
                  key={activity.id} 
                  className={`group hover:shadow-xl transition-all duration-300 border-0 backdrop-blur-sm shadow-lg hover:scale-[1.02] cursor-move ${
                  activity.completed ? 'bg-green-50/80 border-green-200' : 'bg-white/80'
                  } ${draggedItem === activity.id ? 'opacity-50 scale-95' : ''}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, activity.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, activity.id)}
                  onDragEnd={handleDragEnd}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex items-center gap-2">
                            <GripVertical className="w-4 h-4 text-slate-400 cursor-move" />
                            <div className={`w-2 h-2 rounded-full ${
                              activity.completed 
                                ? 'bg-green-500' 
                                : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                            }`}></div>
                            <span className="text-sm font-medium text-slate-500">
                              {activity.time}
                            </span>
                          </div>
                          {activity.completed && (
                            <Badge className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Completed
                            </Badge>
                          )}
                          {activity.isCoachPick && !activity.completed && (
                            <Badge className="bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 text-xs px-3 py-1 rounded-full">
                              <Star className="w-3 h-3 mr-1" />
                              Coach pick
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-slate-900 transition-colors">
                          {activity.title}
                        </h3>
                        <div className="flex items-center gap-6 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-slate-100 rounded-lg">
                              <Clock className="w-4 h-4 text-slate-600" />
                            </div>
                            <span className="font-medium">
                              {activity.completed && activity.timeSpent 
                                ? `${Math.floor(activity.timeSpent / 60)}m ${activity.timeSpent % 60}s`
                                : activity.duration
                              }
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-slate-100 rounded-lg">
                              {getActivityIcon(activity.icon || '')}
                            </div>
                            <span className="font-medium">{activity.type}</span>
                          </div>
                        </div>
                        {activity.description && (
                          <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                            {activity.description}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        {activity.completed ? (
                          <Button
                            disabled
                            className="bg-green-100 text-green-800 px-6 py-3 cursor-not-allowed"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Completed
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleStartWorkout(activity)}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Start
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Column - Information Panels */}
          <div className="space-y-6">
            {/* Today at a glance */}
            <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  Today at a glance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                  <div className="text-3xl font-bold text-slate-800 mb-1">
                    {calculateTotalTime()}
                  </div>
                  <div className="text-sm text-slate-600 font-medium">Total time completed</div>
                </div>
                <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl">
                  <div className="font-bold text-slate-800 text-lg mb-1">
                    {workoutData.daySummary.focus}
                  </div>
                  <div className="text-sm text-slate-600 font-medium">Focus</div>
                </div>
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                  <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-bold ${workoutData.daySummary.readinessColor}`}>
                    <Target className="w-4 h-4 mr-2" />
                    {workoutData.daySummary.readiness}
                  </div>
                  <div className="text-sm text-slate-600 font-medium mt-2">Readiness</div>
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Edit className="w-5 h-5 text-blue-600" />
                  Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="text-sm text-slate-600 font-medium mb-1">Yoga level</div>
                    <div className="font-bold text-slate-800 capitalize">{workoutData.preferences.yogaLevel}</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="text-sm text-slate-600 font-medium mb-1">Equipment</div>
                    <div className="font-bold text-slate-800">{workoutData.preferences.equipment.join(", ")}</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="text-sm text-slate-600 font-medium mb-1">Location</div>
                    <div className="font-bold text-slate-800 capitalize">{workoutData.preferences.location}</div>
                  </div>
                </div>
                <Button 
                  onClick={() => setShowEditPreferences(true)}
                  className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit preferences
                </Button>
              </CardContent>
            </Card>

            {/* AI Recommendations */}
            <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-600" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {aiRecommendations.slice(0, 3).map((recommendation, index) => (
                    <div key={index} className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-blue-400">
                      <p className="text-slate-700 text-sm leading-relaxed">{recommendation}</p>
                </div>
                  ))}
                </div>
                <Button 
                  onClick={() => setShowCheckDashboard(true)}
                  className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Check Dashboard
                </Button>
              </CardContent>
            </Card>

            {/* Weekly Progress */}
            <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Weekly Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {weeklyProgress.map((day, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-xs font-bold text-slate-600">
                          {day.day}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-700">
                            {day.completedCount}/{day.totalCount} activities
                          </div>
                          <div className="text-xs text-slate-500">
                            {day.completionRate.toFixed(0)}% complete
                          </div>
                        </div>
                      </div>
                      <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
                          style={{ width: `${day.completionRate}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Upcoming Days */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Upcoming Days
            </h2>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousDay}
                disabled={currentDayIndex === 0}
                className="border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextDay}
                disabled={workoutData && currentDayIndex >= workoutData.upcomingDays.length - 1}
                className="border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getUpcomingDays().map((day, index) => (
              <Card 
                key={index} 
                className={`group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:scale-[1.02] ${
                  index === currentDayIndex ? 'ring-2 ring-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50' : 'bg-white/80 backdrop-blur-sm'
                }`}
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-slate-800 text-lg">{day.day}</div>
                      {index === currentDayIndex && (
                        <Badge className="bg-blue-100 text-blue-800 text-xs px-2 py-1">
                          Current
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="text-xl font-bold text-slate-800 group-hover:text-slate-900 transition-colors">
                        {day.title}
                      </div>
                      <div className="text-slate-600 leading-relaxed">
                        {day.description}
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewPlan(index)}
                      className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 group-hover:border-slate-400 transition-all duration-300"
                    >
                      View plan
                      <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditPreferencesModal
        isOpen={showEditPreferences}
        onClose={() => setShowEditPreferences(false)}
        preferences={workoutData?.preferences || {
          yogaLevel: 'Beginner',
          equipment: ['Mat', 'Bands'],
          location: 'Home',
          workoutIntensity: 'moderate',
          preferredTime: 'morning',
          restDays: ['sunday']
        }}
        onSave={handleSavePreferences}
      />

      <CheckDashboardModal
        isOpen={showCheckDashboard}
        onClose={() => setShowCheckDashboard(false)}
        activities={workoutData?.activities || []}
        daySummary={workoutData?.daySummary || { totalTime: "0h 0m", focus: "General", readiness: "Ready", readinessColor: "bg-blue-100 text-blue-800" }}
        completedActivities={completedActivities.size}
        totalActivities={workoutData?.activities.length || 0}
        energyLevel={energyLevel}
        recommendations={aiRecommendations}
        missingActivities={missingActivities}
        weeklyProgress={weeklyProgress}
      />
    </div>
  );
};

export default WorkoutDashboard;
