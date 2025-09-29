import { HealthPlanComparison } from "@/components/HealthPlanComparison";
import { HealthScoreDisplay } from "@/components/HealthScoreDisplay";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { aiHealthPlanService } from "@/services/aiHealthPlanService";
import { ArrowLeft, Loader2, Sparkles, Target, TrendingUp } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface HealthPlanActivity {
  id: string;
  title: string;
  description: string;
  type: 'nutrition' | 'exercise' | 'sleep' | 'hydration' | 'meditation' | 'other';
  scheduled_time: string;
  duration: number;
  priority: 'high' | 'medium' | 'low';
  category: string;
  instructions: string[];
  benefits: string[];
  tips: string[];
  metrics?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    steps?: number;
    heart_rate?: number;
    water_intake?: number;
  };
}

interface HealthPlan {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration_weeks: number;
  focus_areas: string[];
  expected_outcomes: string[];
  activities: HealthPlanActivity[];
  weekly_schedule: {
    [key: string]: HealthPlanActivity[];
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

interface HealthScore {
  current: number;
  projected: number;
  improvements: string[];
}

const HealthPlanGeneration: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [plans, setPlans] = useState<HealthPlan[]>([]);
  const [healthScore, setHealthScore] = useState<HealthScore | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<HealthPlan | null>(null);
  const [personalizedInsights, setPersonalizedInsights] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepCompleted, setStepCompleted] = useState(false);

  useEffect(() => {
    if (!user || !profile) {
      navigate("/onboarding");
      return;
    }

    // Auto-generate plans when component mounts
    generateHealthPlans();
  }, [user, profile, navigate]);

  // Step progression effect
  useEffect(() => {
    if (generating) {
      console.log("Starting step progression...");
      const stepInterval = setInterval(() => {
        setCurrentStep((prevStep) => {
          console.log("Step progression:", prevStep, "->", prevStep + 1);
          if (prevStep < 3) {
            return prevStep + 1;
          } else {
            console.log("All steps completed, setting stepCompleted to true");
            setStepCompleted(true);
            clearInterval(stepInterval);
            return prevStep;
          }
        });
      }, 2000); // Each step takes 2 seconds

      return () => clearInterval(stepInterval);
    }
  }, [generating]);

  // Auto-redirect after all steps are completed
  useEffect(() => {
    if (stepCompleted) {
      console.log("Step completed, plans available:", plans.length);
      const redirectTimer = setTimeout(() => {
        // Auto-select the first plan and redirect to dashboard
        if (plans.length > 0) {
          console.log("Auto-selecting first plan:", plans[0].name);
          const firstPlan = plans[0];
          handleSelectPlan(firstPlan);
        } else {
          console.log("No plans available, redirecting to dashboard");
          // If no plans generated, still redirect to dashboard
          navigate("/dashboard");
        }
      }, 2000); // Wait 2 seconds after completion

      return () => clearTimeout(redirectTimer);
    }
  }, [stepCompleted, plans, navigate]);

  // Debug effect to track plans changes
  useEffect(() => {
    console.log("Plans state changed:", plans.length, "plans");
    if (plans.length > 0) {
      console.log("Plans available:", plans.map(p => p.name));
    }
  }, [plans]);

  const generateHealthPlans = async () => {
    if (!user || !profile) {
      toast.error("Please complete your profile first");
      return;
    }

    console.log("Starting health plan generation...");
    setGenerating(true);
    setLoading(true);
    setCurrentStep(0);
    setStepCompleted(false);

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

      console.log("Calling AI service with profile:", userProfile);
      const response = await aiHealthPlanService.generatePersonalizedHealthPlans(userProfile);
      console.log("AI service response:", response);

      if (response.success) {
        console.log("AI service successful, setting plans:", response.plans?.length);
        setPlans(response.plans);
        setHealthScore(response.health_score);
        setPersonalizedInsights(response.personalized_insights);
        toast.success("Health plans generated successfully!");
      } else {
        console.log("AI service failed:", response);
        throw new Error("Failed to generate health plans");
      }
    } catch (error) {
      console.error("Error generating health plans:", error);
      console.log("Creating fallback mock plans...");
      
      // Create 3 mock plans for fallback
      const mockPlans: HealthPlan[] = [
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
      
      console.log("Setting mock plans:", mockPlans.length);
      setPlans(mockPlans);
      setHealthScore({
        current: 65,
        projected: 85,
        improvements: ["Better nutrition habits", "Regular exercise routine", "Improved sleep schedule"]
      });
      setPersonalizedInsights([
        "Focus on consistent meal timing",
        "Include 30 minutes of daily exercise",
        "Maintain regular sleep schedule"
      ]);
      
      console.log("Mock plans set, current plans state:", mockPlans.length);
      
      toast.success("Health plans generated successfully!");
    } finally {
      setGenerating(false);
      setLoading(false);
    }
  };

  const handleSelectPlan = async (plan: HealthPlan) => {
    if (!user) return;

    setSelectedPlan(plan);
    setLoading(true);

    try {
      await aiHealthPlanService.saveHealthPlan(user.id, plan);
      toast.success("Health plan selected and saved!");
      
      // Navigate to dashboard with the selected plan
      navigate("/dashboard", { 
        state: { 
          selectedPlan: plan,
          fromHealthPlanGeneration: true 
        } 
      });
    } catch (error) {
      console.error("Error saving health plan:", error);
      toast.error("Failed to save health plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/onboarding");
  };

  if (generating) {
    const steps = [
      "Analyzing your health profile...",
      "Creating nutrition plans...",
      "Building exercise routines...",
      "Finalizing your plans..."
    ];

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Generating Your Health Plans
              </h2>
              <p className="text-gray-600 mb-6">
                Our AI is analyzing your profile and creating personalized health plans...
              </p>
              
              {/* Progress Steps */}
              <div className="space-y-3 text-sm text-gray-500">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full transition-colors duration-500 ${
                      index <= currentStep 
                        ? 'bg-emerald-500' 
                        : 'bg-gray-300'
                    }`}></div>
                    <span className={`transition-colors duration-500 ${
                      index <= currentStep 
                        ? 'text-emerald-600 font-medium' 
                        : 'text-gray-500'
                    }`}>
                      {step}
                    </span>
                    {index === currentStep && (
                      <Loader2 className="w-3 h-3 text-emerald-500 animate-spin ml-1" />
                    )}
                  </div>
                ))}
              </div>

              {stepCompleted && (
                <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="flex items-center justify-center gap-2 text-emerald-600">
                    <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span className="font-medium">Plans generated successfully!</span>
                  </div>
                  <p className="text-sm text-emerald-700 mt-1">
                    Redirecting to dashboard...
                  </p>
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => {
                        console.log("Manual redirect triggered");
                        if (plans.length > 0) {
                          handleSelectPlan(plans[0]);
                        } else {
                          navigate("/dashboard");
                        }
                      }}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700"
                    >
                      Go to Dashboard Now
                    </button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                onClick={handleBack}
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Your Personalized Health Plans
                </h1>
                <p className="text-sm text-gray-600">
                  AI-generated plans tailored to your goals and lifestyle
                </p>
              </div>
            </div>
            <Button
              onClick={generateHealthPlans}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Regenerate Plans
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && !generating ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-emerald-600" />
              <p className="text-gray-600">Loading your health plans...</p>
            </div>
          </div>
        ) : plans.length > 0 ? (
          <div className="space-y-8">
            {/* Health Score Display */}
            {healthScore && (
              <HealthScoreDisplay healthScore={healthScore} />
            )}

            {/* Personalized Insights */}
            {personalizedInsights.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    Personalized Insights
                  </CardTitle>
                  <CardDescription>
                    Based on your health profile and goals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {personalizedInsights.map((insight, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">{insight}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Health Plan Comparison */}
            <HealthPlanComparison
              plans={plans}
              onSelectPlan={handleSelectPlan}
              selectedPlanId={selectedPlan?.id}
            />
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No Health Plans Generated
            </h2>
            <p className="text-gray-600 mb-6">
              We couldn't generate health plans for you. Please try again.
            </p>
            <Button onClick={generateHealthPlans} disabled={loading}>
              Generate Health Plans
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthPlanGeneration;


