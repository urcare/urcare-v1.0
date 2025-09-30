import { HealthContentNew } from "@/components/HealthContentNew";
import { ThemeWrapper } from "@/components/ThemeWrapper";
import { HealthPlanComparison } from "@/components/HealthPlanComparison";
import { HealthScoreDisplay } from "@/components/HealthScoreDisplay";
import { useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { aiHealthPlanService } from "@/services/aiHealthPlanService";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle, 
  Clock, 
  Target, 
  TrendingUp, 
  Users, 
  Sparkles, 
  Calendar,
  Activity,
  Heart,
  Zap,
  ArrowRight,
  Plus,
  Settings,
  BarChart3
} from "lucide-react";

interface HealthPlan {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration_weeks: number;
  focus_areas: string[];
  expected_outcomes: string[];
  activities: any[];
  weekly_schedule: {
    [key: string]: any[];
  };
  health_metrics: {
    weight_loss_goal: number;
    muscle_gain_goal: number;
    fitness_improvement: number;
    energy_level: number;
    sleep_quality: number;
    stress_reduction: number;
  };
}

const Dashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [healthPlans, setHealthPlans] = useState<HealthPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<HealthPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [healthScore, setHealthScore] = useState<{current: number, projected: number, improvements: string[]} | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [savedPlans, setSavedPlans] = useState<HealthPlan[]>([]);

  useEffect(() => {
    // Check if user came from health plan generation
    if (location.state?.fromHealthPlanGeneration && location.state?.selectedPlan) {
      const plan = location.state.selectedPlan;
      setSelectedPlan(plan);
      toast.success(`Welcome! Your ${plan.name} health plan is now active.`, {
        description: "Start your personalized health journey today!",
        duration: 5000,
      });
    }
    
    // Load health plans and saved plans
    if (user && profile) {
      loadHealthPlans();
      loadSavedPlans();
    }
  }, [location.state, user, profile]);

  const loadHealthPlans = async () => {
    if (!user || !profile) return;
    
    setLoading(true);
    try {
      // Convert profile to the format expected by the AI service
      const userProfile = {
        id: user.id,
        full_name: profile.full_name || "User",
        age: String(profile.age || "25"),
        gender: profile.gender || "Male",
        height_cm: profile.height_cm || "170",
        weight_kg: profile.weight_kg || "70",
        blood_group: profile.blood_group || "O+",
        diet_type: profile.diet_type || "Balanced",
        chronic_conditions: profile.chronic_conditions || [],
        health_goals: profile.health_goals || [],
        wake_up_time: profile.wake_up_time || "06:00",
        sleep_time: profile.sleep_time || "22:00",
        work_start: profile.work_start || "09:00",
        work_end: profile.work_end || "18:00",
        breakfast_time: profile.breakfast_time || "07:00",
        lunch_time: profile.lunch_time || "12:00",
        dinner_time: profile.dinner_time || "19:00",
        workout_time: profile.workout_time || "18:00",
        workout_type: profile.workout_type || "Gym",
        routine_flexibility: profile.routine_flexibility || "5",
        smoking: profile.smoking || "never smoked",
        drinking: profile.drinking || "never drink",
        allergies: [],
        family_history: [],
        lifestyle: "moderate",
        stress_levels: "moderate",
        mental_health: "good",
        hydration_habits: "moderate",
        occupation: "office worker"
      };

      const response = await aiHealthPlanService.generatePersonalizedHealthPlans(userProfile);
      
      if (response.success) {
        setHealthPlans(response.plans);
        setHealthScore(response.health_score);
      } else {
        // Create fallback plans
        const fallbackPlans: HealthPlan[] = [
          {
            id: "plan-1",
            name: "Beginner Wellness Plan",
            description: "A gentle introduction to healthy living with focus on building sustainable habits",
            difficulty: "beginner",
            duration_weeks: 12,
            focus_areas: ["Weight Management", "Energy Boost", "Stress Reduction"],
            expected_outcomes: ["Improved energy levels", "Better sleep quality", "Reduced stress"],
            activities: [],
            weekly_schedule: {},
            health_metrics: {
              weight_loss_goal: 5,
              muscle_gain_goal: 2,
              fitness_improvement: 20,
              energy_level: 15,
              sleep_quality: 10,
              stress_reduction: 25
            }
          },
          {
            id: "plan-2",
            name: "Intermediate Health Protocol",
            description: "A balanced approach combining nutrition and exercise for optimal health",
            difficulty: "intermediate",
            duration_weeks: 16,
            focus_areas: ["Muscle Building", "Cardiovascular Health", "Nutrition Optimization"],
            expected_outcomes: ["Increased strength", "Better endurance", "Improved body composition"],
            activities: [],
            weekly_schedule: {},
            health_metrics: {
              weight_loss_goal: 8,
              muscle_gain_goal: 4,
              fitness_improvement: 35,
              energy_level: 25,
              sleep_quality: 15,
              stress_reduction: 30
            }
          },
          {
            id: "plan-3",
            name: "Advanced Performance Plan",
            description: "High-intensity training and strict nutrition for maximum results",
            difficulty: "advanced",
            duration_weeks: 20,
            focus_areas: ["Peak Performance", "Body Transformation", "Elite Fitness"],
            expected_outcomes: ["Dramatic body transformation", "Elite fitness level", "Optimal health"],
            activities: [],
            weekly_schedule: {},
            health_metrics: {
              weight_loss_goal: 12,
              muscle_gain_goal: 6,
              fitness_improvement: 50,
              energy_level: 35,
              sleep_quality: 20,
              stress_reduction: 40
            }
          }
        ];
        setHealthPlans(fallbackPlans);
        setHealthScore({
          current: 65,
          projected: 85,
          improvements: ["Better nutrition habits", "Regular exercise routine", "Improved sleep schedule"]
        });
      }
    } catch (error) {
      console.error("Error loading health plans:", error);
      toast.error("Failed to load health plans");
    } finally {
      setLoading(false);
    }
  };

  const loadSavedPlans = async () => {
    if (!user) return;
    
    try {
      const savedPlans = await aiHealthPlanService.getUserHealthPlans(user.id);
      setSavedPlans(savedPlans);
      
      // Set the most recent plan as selected if available
      if (savedPlans.length > 0) {
        setSelectedPlan(savedPlans[0]);
      }
    } catch (error) {
      console.error("Error loading saved plans:", error);
    }
  };

  const handleSelectPlan = async (plan: HealthPlan) => {
    if (!user) return;

    setLoading(true);
    try {
      // For testing purposes, grant a basic subscription when selecting a plan
      try {
        const { error: subscriptionError } = await supabase
          .from('user_subscriptions')
          .insert({
            user_id: user.id,
            plan_name: 'Basic',
            billing_cycle: 'monthly',
            status: 'active',
            amount: 1200, // $12.00 in paise
            currency: 'INR',
            started_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
          });
        
        if (subscriptionError) {
          console.log("Subscription already exists or error:", subscriptionError);
        } else {
          console.log("Test subscription granted for user:", user.id);
        }
      } catch (subError) {
        console.log("Subscription grant failed:", subError);
      }

      await aiHealthPlanService.saveHealthPlan(user.id, plan);
      setSelectedPlan(plan);
      toast.success("Health plan selected and saved!");
      
      // Refresh saved plans
      await loadSavedPlans();
    } catch (error) {
      console.error("Error saving health plan:", error);
      toast.error("Failed to save health plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateNewPlans = () => {
    navigate("/health-plan-generation");
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFirstName = () => {
    if (profile?.full_name) {
      return profile.full_name.split(" ")[0];
    }
    if (user?.email) {
      return user.email.split("@")[0];
    }
    return "User";
  };

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-blue-50 min-h-screen">
      <ThemeWrapper>
        <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
          {/* Header Section */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Welcome back, {getFirstName()}! 👋
                </h1>
                <p className="text-gray-600 text-lg">
                  Your personalized health journey starts here
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  onClick={handleGenerateNewPlans}
                  className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl shadow-lg"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate New Plans
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Health Score Section */}
          {healthScore && (
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <HealthScoreDisplay healthScore={healthScore} />
            </div>
          )}

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-white rounded-2xl p-2 shadow-lg">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="plans" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Health Plans
              </TabsTrigger>
              <TabsTrigger value="progress" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Progress
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Current Plan Status */}
              {selectedPlan ? (
                <Card className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white border-0 shadow-xl">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl text-white flex items-center gap-2">
                          <CheckCircle className="w-6 h-6" />
                          Active Health Plan
                        </CardTitle>
                        <CardDescription className="text-emerald-100 text-lg">
                          {selectedPlan.name}
                        </CardDescription>
                      </div>
                      <Badge className="bg-white/20 text-white border-white/30">
                        {selectedPlan.difficulty.charAt(0).toUpperCase() + selectedPlan.difficulty.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white/10 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-5 h-5" />
                          <span className="font-semibold">Duration</span>
                        </div>
                        <p className="text-2xl font-bold">{selectedPlan.duration_weeks} weeks</p>
                      </div>
                      <div className="bg-white/10 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Activity className="w-5 h-5" />
                          <span className="font-semibold">Activities</span>
                        </div>
                        <p className="text-2xl font-bold">{selectedPlan.activities.length}</p>
                      </div>
                      <div className="bg-white/10 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="w-5 h-5" />
                          <span className="font-semibold">Focus Areas</span>
                        </div>
                        <p className="text-2xl font-bold">{selectedPlan.focus_areas.length}</p>
                      </div>
                    </div>
                    <div className="mt-6">
                      <Button 
                        onClick={() => navigate("/health-plan")}
                        className="bg-white text-emerald-600 hover:bg-gray-100 font-semibold px-6 py-3 rounded-xl"
                      >
                        View Plan Details
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-gradient-to-r from-gray-100 to-gray-200 border-0 shadow-lg">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="w-8 h-8 text-gray-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Active Health Plan</h3>
                    <p className="text-gray-600 mb-6">Generate a personalized health plan to start your journey</p>
                    <Button 
                      onClick={handleGenerateNewPlans}
                      className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Generate Health Plans
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white shadow-lg border border-gray-100">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Heart className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Health Score</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {healthScore?.current || 0}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-lg border border-gray-100">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <Zap className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Active Plans</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {savedPlans.length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-lg border border-gray-100">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Days Active</p>
                        <p className="text-2xl font-bold text-gray-900">7</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Health Plans Tab */}
            <TabsContent value="plans" className="space-y-6">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <HealthPlanComparison
                  plans={healthPlans}
                  onSelectPlan={handleSelectPlan}
                  selectedPlanId={selectedPlan?.id}
                />
              )}
            </TabsContent>

            {/* Progress Tab */}
            <TabsContent value="progress" className="space-y-6">
              <Card className="bg-white shadow-lg border border-gray-100">
                <CardHeader>
                  <CardTitle className="text-2xl">Your Progress</CardTitle>
                  <CardDescription>Track your health journey and achievements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Progress Tracking Coming Soon</h3>
                    <p className="text-gray-600">Detailed progress analytics will be available once you start your health plan</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ThemeWrapper>
    </div>
  );
};

export default Dashboard;
