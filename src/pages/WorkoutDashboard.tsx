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
  BarChart3
} from "lucide-react";
import { toast } from "sonner";
import { workoutService } from "@/services/workoutService";
import { EditPreferencesModal } from "@/components/EditPreferencesModal";
import { RPELoggingModal } from "@/components/RPELoggingModal";
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
  const [showRPEModal, setShowRPEModal] = useState(false);
  const [showCheckDashboard, setShowCheckDashboard] = useState(false);
  const [selectedWorkoutForRPE, setSelectedWorkoutForRPE] = useState<string>("");
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [completedActivities, setCompletedActivities] = useState<Set<string>>(new Set());
  const [energyLevel, setEnergyLevel] = useState(3);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [missingActivities, setMissingActivities] = useState<string[]>([]);

  const generateWorkoutData = useCallback(async (plan: any) => {
    // Prevent duplicate calls
    if (generating) {
      console.log('Already generating workout data, skipping...');
      return;
    }

    setLoading(true);
    setGenerating(true);

    try {
      const data = await workoutService.generateWorkoutSchedule(
        plan,
        profile,
        {
          yogaLevel: 'Beginner',
          equipment: ['Mat', 'Bands'],
          location: 'Home',
          workoutIntensity: 'moderate',
          preferredTime: 'morning',
          restDays: ['sunday']
        }
      );
      
      // Ensure the data has the correct structure
      const workoutDataWithPreferences: WorkoutDashboardData = {
        ...data,
        preferences: {
          yogaLevel: data.preferences?.yogaLevel || 'Beginner',
          equipment: data.preferences?.equipment || ['Mat', 'Bands'],
          location: data.preferences?.location || 'Home',
          workoutIntensity: (data.preferences as any)?.workoutIntensity || 'moderate',
          preferredTime: (data.preferences as any)?.preferredTime || 'morning',
          restDays: (data.preferences as any)?.restDays || ['sunday']
        }
      };
      
      setWorkoutData(workoutDataWithPreferences);
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
  }, [user, profile, navigate, location.state?.selectedPlan, generateWorkoutData, isInitialized]); // Only depend on selectedPlan, not entire location.state

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


  const handleLogRPE = (workoutTitle: string) => {
    setSelectedWorkoutForRPE(workoutTitle);
    setShowRPEModal(true);
  };

  const handleSaveRPE = (rpeData: any) => {
    console.log("RPE Data saved:", rpeData);
    // Here you would save the RPE data to your backend
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
    // Here you would navigate to the specific day's plan
    toast.success(`Viewing plan for ${workoutData?.upcomingDays[dayIndex]?.day}`);
  };

  const handleStartWorkout = (activity: WorkoutActivity) => {
    navigate("/workout-activity", {
      state: {
        activity,
        activityId: activity.id
      }
    });
  };


  const generateRecommendations = () => {
    const completedCount = completedActivities.size;
    const totalCount = workoutData?.activities.length || 0;
    const completionRate = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
    
    const newRecommendations = [];
    
    if (completionRate >= 80) {
      newRecommendations.push("Excellent progress! You're on track to meet your daily goals.");
      newRecommendations.push("Consider adding a short walk or stretching session to maintain momentum.");
    } else if (completionRate >= 50) {
      newRecommendations.push("Good progress! Try to complete the remaining activities for maximum benefit.");
      newRecommendations.push("Take short breaks between activities to maintain energy levels.");
    } else {
      newRecommendations.push("You're getting started! Every small step counts towards your health goals.");
      newRecommendations.push("Consider starting with shorter activities and gradually increasing intensity.");
    }
    
    // Energy-based recommendations
    if (energyLevel >= 4) {
      newRecommendations.push("Your energy is high! Perfect time for more intense activities.");
    } else if (energyLevel <= 2) {
      newRecommendations.push("Your energy seems low. Focus on gentle activities and proper rest.");
    }
    
    setRecommendations(newRecommendations);
    
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
                <Card key={activity.id} className={`group hover:shadow-xl transition-all duration-300 border-0 backdrop-blur-sm shadow-lg hover:scale-[1.02] ${
                  activity.completed ? 'bg-green-50/80 border-green-200' : 'bg-white/80'
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex items-center gap-2">
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
                        <Button
                          variant="outline"
                          onClick={() => handleLogRPE(activity.title)}
                          className="border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 text-sm"
                        >
                          <BarChart3 className="w-3 h-3 mr-1" />
                          Log RPE
                        </Button>
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

            {/* After you finish */}
            <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  After you finish
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-700 font-medium">Log RPE</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleLogRPE("Today's Workout")}
                    className="border-slate-300 text-slate-700 hover:bg-slate-100"
                  >
                    Log now
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-700 font-medium">Stretch cooldown</span>
                  <div className="flex items-center gap-2">
                    <Timer className="w-4 h-4 text-slate-500" />
                    <span className="font-bold text-slate-800">8 min</span>
                  </div>
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
            {workoutData.upcomingDays.map((day, index) => (
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

      <RPELoggingModal
        isOpen={showRPEModal}
        onClose={() => setShowRPEModal(false)}
        workoutTitle={selectedWorkoutForRPE}
        onSave={handleSaveRPE}
      />

      <CheckDashboardModal
        isOpen={showCheckDashboard}
        onClose={() => setShowCheckDashboard(false)}
        activities={workoutData?.activities || []}
        daySummary={workoutData?.daySummary || { totalTime: "0h 0m", focus: "General", readiness: "Ready", readinessColor: "bg-blue-100 text-blue-800" }}
        completedActivities={completedActivities.size}
        totalActivities={workoutData?.activities.length || 0}
        energyLevel={energyLevel}
        recommendations={recommendations}
        missingActivities={missingActivities}
      />
    </div>
  );
};

export default WorkoutDashboard;
