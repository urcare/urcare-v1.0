import { HealthContentNew } from "@/components/HealthContentNew";
import { ThemeWrapper } from "@/components/ThemeWrapper";
import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { aiHealthPlanService } from "@/services/aiHealthPlanService";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Target, TrendingUp, Users } from "lucide-react";

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
  const { user, profile } = useAuth();
  const [healthPlans, setHealthPlans] = useState<HealthPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<HealthPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [healthScore, setHealthScore] = useState<{current: number, projected: number, improvements: string[]} | null>(null);

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
    
    // Load health plans if not already loaded
    if (user && profile && healthPlans.length === 0) {
      loadHealthPlans();
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
    } catch (error) {
      console.error("Error saving health plan:", error);
      toast.error("Failed to save health plan. Please try again.");
    } finally {
      setLoading(false);
    }
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
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      <ThemeWrapper>
        <div className="space-y-2">
          {/* Header with Health Score */}
          <div className="bg-white/80 backdrop-blur-sm rounded-[3rem] p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Hi {getFirstName()}! 👋
                </h1>
                {healthScore && (
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-blue-600" />
                      <span className="text-sm text-slate-600">Health Score:</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {healthScore.current}
                      </span>
                      <span className="text-sm text-slate-500">→ {healthScore.projected}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-blue-600">+{healthScore.projected - healthScore.current} points</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-500">Current Plan</div>
                <div className="text-lg font-semibold text-slate-800">
                  {selectedPlan ? selectedPlan.name : "No Plan Selected"}
                </div>
              </div>
            </div>
          </div>

          {/* Health Plans Section */}
          <div className="bg-white rounded-[3rem] p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Choose Your Health Plan</h2>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-500">3 Plans Available</span>
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {healthPlans.map((plan, index) => (
                  <Card 
                    key={plan.id} 
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      selectedPlan?.id === plan.id 
                        ? 'ring-2 ring-emerald-500 bg-emerald-50' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleSelectPlan(plan)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-xl">{plan.name}</CardTitle>
                            <Badge className={getDifficultyColor(plan.difficulty)}>
                              {plan.difficulty.charAt(0).toUpperCase() + plan.difficulty.slice(1)}
                            </Badge>
                          </div>
                          <CardDescription className="text-base">
                            {plan.description}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                            <Clock className="w-4 h-4" />
                            {plan.duration_weeks} weeks
                          </div>
                          {selectedPlan?.id === plan.id && (
                            <div className="flex items-center gap-1 text-emerald-600 text-sm">
                              <CheckCircle className="w-4 h-4" />
                              Selected
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-sm font-medium text-gray-700 mb-1">Focus Areas</div>
                          <div className="flex flex-wrap gap-1">
                            {plan.focus_areas.slice(0, 2).map((area, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {area}
                              </Badge>
                            ))}
                            {plan.focus_areas.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{plan.focus_areas.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-700 mb-1">Expected Results</div>
                          <div className="text-sm text-gray-600">
                            {plan.health_metrics.weight_loss_goal}kg weight loss
                          </div>
                          <div className="text-sm text-gray-600">
                            +{plan.health_metrics.fitness_improvement}% fitness
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          {plan.activities.length} activities planned
                        </div>
                        <Button 
                          variant={selectedPlan?.id === plan.id ? "default" : "outline"}
                          size="sm"
                          className="min-w-[100px]"
                        >
                          {selectedPlan?.id === plan.id ? "Selected" : "Select Plan"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Health Insights (if no plan selected) */}
          {!selectedPlan && healthScore && (
            <div className="bg-white rounded-[3rem] p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Health Insights</h3>
              <div className="space-y-3">
                {healthScore.improvements.map((improvement, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-gray-700">{improvement}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </ThemeWrapper>
    </div>
  );
};

export default Dashboard;
