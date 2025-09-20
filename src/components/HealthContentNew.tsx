import { supabase } from "@/integrations/supabase/client";
import {
  PlanDurationCalculator,
  comprehensiveHealthPlanService,
} from "@/services/comprehensiveHealthPlanService";
import { progressTrackingService } from "@/services/progressTrackingService";
import {
  ComprehensiveHealthPlan,
  PLAN_TYPE_DEFINITIONS,
} from "@/types/comprehensiveHealthPlan";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHealthPlanGeneration } from "../hooks/useHealthPlanGeneration";
import { ComprehensivePlanSelectionCards } from "./ComprehensivePlanSelectionCards";
import { HealthInputBar } from "./HealthInputBar";
import { HealthPlanCalendarView } from "./HealthPlanCalendarView";
import { PlannerPage } from "./PlannerPage";
import { SimplePlanLoading } from "./SimplePlanLoading";
import { DashboardHeaderNew } from "./dashboard/DashboardHeaderNew";
import { ProgressCard } from "./dashboard/ProgressCard";
import { StatsCards } from "./dashboard/StatsCards";

interface PlanData {
  id: string;
  name: string;
  difficulty: "easy" | "moderate" | "hard";
  description: string;
  duration: string;
  features: string[];
  timetable: Array<{
    time: string;
    activity: string;
    duration: string;
    type: "morning" | "meal" | "exercise" | "work" | "evening" | "sleep";
    description?: string;
  }>;
  // Enhanced properties for comprehensive plans
  plan_type?: ComprehensiveHealthPlan["plan_type"];
  duration_weeks?: number;
  expected_outcomes?: string[];
  key_milestones?: string[];
  comprehensive_plan?: ComprehensiveHealthPlan;
}

export const HealthContentNew = () => {
  const navigate = useNavigate();
  const [suggestedInput, setSuggestedInput] = useState<string>("");
  const [generatedPlans, setGeneratedPlans] = useState<PlanData[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<PlanData | null>(null);
  const [showInputBar, setShowInputBar] = useState(true);
  const [activePlan, setActivePlan] = useState<ComprehensiveHealthPlan | null>(
    null
  );
  const [userProfile, setUserProfile] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [realTimeProgress, setRealTimeProgress] = useState<{
    overallProgress: number;
    weeklyCompliance: number;
    currentWeek: number;
    daysRemaining: number;
    milestonesAchieved: number;
    totalMilestones: number;
  } | null>(null);
  const [progressSubscription, setProgressSubscription] = useState<
    (() => void) | null
  >(null);

  // Use the new progress system
  const { progress, generatePlan, reset } = useHealthPlanGeneration();
  const [showPlannerPage, setShowPlannerPage] = useState(false);
  const [showCalendarView, setShowCalendarView] = useState(false);

  // Add error handling for database queries
  const handleDatabaseError = (error: unknown, context: string) => {
    console.error(`Database error in ${context}:`, error);
    const errorObj = error as { code?: string; message?: string };
    if (
      errorObj?.code === "PGRST116" ||
      errorObj?.message?.includes("relation") ||
      errorObj?.message?.includes("does not exist")
    ) {
      console.warn(
        "Database table may not exist. Please run the migration script."
      );
    }
  };

  // Set up real-time progress tracking for active plan
  useEffect(() => {
    if (activePlan) {
      let unsubscribe: (() => void) | null = null;

      // Subscribe to real-time progress updates
      progressTrackingService
        .subscribeToProgressUpdates(activePlan.id, (progress) => {
          setRealTimeProgress(progress);
          // Update the active plan with new progress data
          setActivePlan((prev) =>
            prev
              ? {
                  ...prev,
                  overall_progress_percentage: progress.overallProgress,
                  weekly_compliance_rate: progress.weeklyCompliance,
                }
              : null
          );
        })
        .then((unsubFn) => {
          unsubscribe = unsubFn;
          setProgressSubscription(() => unsubFn);
        })
        .catch((error) => {
          console.warn("Failed to subscribe to progress updates:", error);
          // Set a no-op unsubscribe function
          const noOpUnsubscribe = () => {};
          setProgressSubscription(() => noOpUnsubscribe);
        });

      // Get initial progress summary
      progressTrackingService
        .getPlanProgressSummary(activePlan.id)
        .then(setRealTimeProgress)
        .catch((error) => {
          console.warn("Failed to get initial progress summary:", error);
          // Set fallback progress data
          setRealTimeProgress({
            overallProgress: 0,
            weeklyCompliance: 0,
            currentWeek: 1,
            daysRemaining: 28,
            milestonesAchieved: 0,
            totalMilestones: 4,
          });
        });

      return () => {
        if (unsubscribe && typeof unsubscribe === "function") {
          try {
            unsubscribe();
          } catch (error) {
            console.warn("Error during unsubscribe:", error);
          }
        }
      };
    } else {
      // Clean up subscription when no active plan
      if (progressSubscription && typeof progressSubscription === "function") {
        try {
          progressSubscription();
        } catch (error) {
          console.warn("Error cleaning up progress subscription:", error);
        }
        setProgressSubscription(null);
      }
      setRealTimeProgress(null);
    }
  }, [activePlan]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadUserData = useCallback(async () => {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        console.error("Authentication error:", authError);
        return;
      }

      if (!user) {
        console.log("No authenticated user found");
        return;
      }

      // Check if this is a development user
      if (user.id === "dev-user-123") {
        console.log("Development user detected - using mock data");
        setUserProfile({
          id: "9d1051c9-0241-4370-99a3-034bd2d5d001", // Use valid UUID
          full_name: "Development User",
          onboarding_completed: true,
        });
        return;
      }

      console.log("Loading data for user:", user.id);

      // Load user profile
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setUserProfile(profile);

      // Check for existing active plan
      try {
        const existingPlan = await comprehensiveHealthPlanService.getActivePlan(
          user.id
        );
        if (existingPlan) {
          setActivePlan(existingPlan);
          setShowInputBar(false);
        }
      } catch (planError) {
        handleDatabaseError(planError, "getActivePlan");
        // Continue without existing plan - user can create a new one
      }
    } catch (error) {
      handleDatabaseError(error, "loadUserData");
    }
  }, []);

  // Load user's active plan on component mount
  useEffect(() => {
    // Only load data if user is authenticated
    const checkAuthAndLoad = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        loadUserData();
      } else {
        console.log("User not authenticated, skipping data load");
      }
    };

    checkAuthAndLoad();
  }, [loadUserData]);

  const handleSuggestedInput = (input: string) => {
    setSuggestedInput(input);
    // You can add logic here to pass this to the HealthInputBar component
    // For now, we'll just set the state
  };

  const handlePlanGeneration = async (input: string) => {
    setShowInputBar(false);

    try {
      // Reset progress and start generation
      reset();
      await generatePlan();

      // Calculate plan duration and type
      const planCalculation = PlanDurationCalculator.calculateDuration(
        input,
        userProfile
      );

      // Generate comprehensive health plan
      const comprehensivePlan =
        await comprehensiveHealthPlanService.generateComprehensivePlan(
          input,
          userProfile
        );

      setActivePlan(comprehensivePlan);

      // Convert to display format with realistic duration and features
      const planTypeInfo = PLAN_TYPE_DEFINITIONS[comprehensivePlan.plan_type];

      const convertedPlan: PlanData = {
        id: comprehensivePlan.id,
        name: comprehensivePlan.plan_name,
        difficulty: "moderate",
        description: comprehensivePlan.plan_data.overview.description,
        duration: `${comprehensivePlan.duration_weeks} weeks (${Math.ceil(
          comprehensivePlan.duration_weeks / 4
        )} months)`,
        features: [
          ...comprehensivePlan.plan_data.overview.key_principles,
          `${planCalculation.timeline_preference} progression`,
          "Weekly milestone tracking",
          "Monthly assessments",
          "Adaptive adjustments",
        ],
        timetable: [], // Will be populated from daily templates
        plan_type: comprehensivePlan.plan_type,
        duration_weeks: comprehensivePlan.duration_weeks,
        expected_outcomes: planCalculation.expected_outcomes,
        key_milestones: planCalculation.key_milestones,
        comprehensive_plan: comprehensivePlan,
      };

      // Create plan options with different approaches
      const multiplePlans: PlanData[] = [
        convertedPlan,
        {
          ...convertedPlan,
          id: `${convertedPlan.id}-gradual`,
          name: `Gradual ${planTypeInfo.name}`,
          difficulty: "easy",
          description: `A gentle approach to ${input} with extended timeline for sustainable results`,
          duration: `${Math.ceil(
            comprehensivePlan.duration_weeks * 1.5
          )} weeks`,
          features: [
            "Gentle progression",
            "Extended timeline",
            "Lower intensity",
            "Focus on habit formation",
            "Stress-free approach",
          ],
          duration_weeks: Math.ceil(comprehensivePlan.duration_weeks * 1.5),
        },
        {
          ...convertedPlan,
          id: `${convertedPlan.id}-intensive`,
          name: `Intensive ${planTypeInfo.name}`,
          difficulty: "hard",
          description: `An accelerated approach to ${input} with higher intensity for faster results`,
          duration: `${Math.ceil(
            comprehensivePlan.duration_weeks * 0.75
          )} weeks`,
          features: [
            "Accelerated timeline",
            "Higher intensity",
            "Advanced techniques",
            "Frequent assessments",
            "Maximum commitment",
          ],
          duration_weeks: Math.ceil(comprehensivePlan.duration_weeks * 0.75),
        },
      ];

      setGeneratedPlans(multiplePlans);
      console.log(
        `🎉 Comprehensive ${comprehensivePlan.duration_weeks}-week plan generated successfully!`
      );
      console.log(`📊 Plan type: ${comprehensivePlan.plan_type}`);
      console.log(`🎯 Expected outcomes:`, planCalculation.expected_outcomes);
      console.log(`📋 Generated plans count:`, multiplePlans.length);
      console.log(`🔍 Current state after plan generation:`, {
        showInputBar,
        generatedPlansLength: multiplePlans.length,
        activePlan: !!comprehensivePlan,
        progressIsGenerating: progress.isGenerating
      });
    } catch (error) {
      console.error("❌ Error generating comprehensive health plan:", error);
      
      // Only show input bar again if no plans were generated
      if (generatedPlans.length === 0) {
        setShowInputBar(true);
        // Show error to user with more helpful message
        alert(
          `Unable to generate health plan at this time. Please try again in a few moments. Error: ${
            error.message || "Unknown error"
          }`
        );
      } else {
        // If plans were generated, keep them visible even if there was an error
        console.log("✅ Plans were generated successfully, keeping them visible despite error");
      }
    }
  };

  const handlePlanSelect = (plan: PlanData) => {
    setSelectedPlan(plan);
    setShowPlannerPage(true);
  };

  const handleViewPlanDetails = (plan: PlanData) => {
    // Navigate to calendar with plan data
    if (plan.comprehensive_plan) {
      navigate("/calendar", {
        state: {
          planData: plan.comprehensive_plan,
          planName: plan.name,
        },
      });
    } else {
      // Fallback to existing behavior for non-comprehensive plans
      setSelectedPlan(plan);
      setShowCalendarView(true);
    }
  };

  const handleBackToPlans = () => {
    setShowPlannerPage(false);
    setShowCalendarView(false);
    setSelectedPlan(null);
  };

  const handleNewPlan = () => {
    setSelectedPlan(null);
    setGeneratedPlans([]);
    setShowInputBar(true);
    setShowPlannerPage(false);
  };

  // Show PlannerPage when a plan is selected
  if (showCalendarView && selectedPlan) {
    return (
      <HealthPlanCalendarView plan={selectedPlan} onBack={handleBackToPlans} />
    );
  }

  if (showPlannerPage && selectedPlan) {
    return <PlannerPage plan={selectedPlan} onBack={handleBackToPlans} />;
  }

  return (
    <div className="bg-background">
      <DashboardHeaderNew />

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Progress Card - Move back to top */}
        <ProgressCard
          progressPercentage={91}
          caloriesGoal={1350}
          currentDate="19 September"
        />

        {/* Stats Cards */}
        <StatsCards
          currentSteps={8247}
          stepsGoal={10000}
          stepsChange={1753}
          todayCalories={1278}
          calorieChangePercent={-5.6}
        />

        {/* Loading State with Progress */}
        {progress.isGenerating && (
          <SimplePlanLoading
            isGenerating={progress.isGenerating}
            progress={progress.progress}
            error={progress.error}
            onComplete={() => {
              // Handle completion if needed
            }}
          />
        )}

        {/* Active Plan Display */}
        {activePlan && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-green-800">
                  {activePlan.plan_name}
                </h3>
                <p className="text-green-600">
                  {PLAN_TYPE_DEFINITIONS[activePlan.plan_type].name} •{" "}
                  {activePlan.duration_weeks} weeks
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-700">
                  {Math.round(activePlan.overall_progress_percentage)}%
                </div>
                <div className="text-sm text-green-600">Complete</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white/50 rounded-lg p-3">
                <div className="text-sm text-gray-600">Weekly Compliance</div>
                <div className="text-lg font-semibold text-gray-800">
                  {Math.round(activePlan.weekly_compliance_rate)}%
                </div>
              </div>
              <div className="bg-white/50 rounded-lg p-3">
                <div className="text-sm text-gray-600">Days Remaining</div>
                <div className="text-lg font-semibold text-gray-800">
                  {Math.max(
                    0,
                    Math.ceil(
                      (new Date(activePlan.target_end_date).getTime() -
                        new Date().getTime()) /
                        (1000 * 60 * 60 * 24)
                    )
                  )}
                </div>
              </div>
              <div className="bg-white/50 rounded-lg p-3">
                <div className="text-sm text-gray-600">Status</div>
                <div className="text-lg font-semibold capitalize text-gray-800">
                  {activePlan.status}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  // Navigate to plan details
                  console.log("View plan details");
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                View Progress
              </button>
              <button
                onClick={() => {
                  console.log("🔥 TODAY'S PLAN BUTTON CLICKED");
                  console.log("📊 Current state:", {
                    activePlan: activePlan,
                    hasActivePlan: !!activePlan,
                    activePlanId: activePlan?.id,
                    activePlanName: activePlan?.plan_name,
                    activePlanType: activePlan?.plan_type,
                    activePlanStatus: activePlan?.status,
                    userProfile: userProfile,
                    hasUserProfile: !!userProfile,
                    currentPath: window.location.pathname,
                    timestamp: new Date().toISOString(),
                  });

                  try {
                    // Navigate to calendar with active plan
                    if (activePlan) {
                      console.log(
                        "✅ Active plan found, navigating to calendar with plan data"
                      );
                      console.log("📋 Plan data being passed:", {
                        planId: activePlan.id,
                        planName: activePlan.plan_name,
                        planType: activePlan.plan_type,
                        startDate: activePlan.start_date,
                        durationWeeks: activePlan.duration_weeks,
                        status: activePlan.status,
                        hasPlanData: !!activePlan.plan_data,
                        planDataKeys: activePlan.plan_data
                          ? Object.keys(activePlan.plan_data)
                          : null,
                      });

                      navigate("/calendar", {
                        state: {
                          planData: activePlan,
                          planName: activePlan.plan_name,
                        },
                      });

                      console.log(
                        "🚀 Navigation initiated to /calendar with plan data"
                      );
                    } else {
                      // If no active plan, navigate to calendar with demo data
                      console.log(
                        "⚠️ No active plan found, navigating to calendar without plan data"
                      );
                      console.log("📝 Will use default events in calendar");

                      navigate("/calendar");

                      console.log(
                        "🚀 Navigation initiated to /calendar without plan data"
                      );
                    }
                  } catch (error) {
                    console.error("❌ Error navigating to calendar:", error);
                    console.error("🔍 Error details:", {
                      errorMessage: error.message,
                      errorStack: error.stack,
                      errorName: error.name,
                    });

                    // Fallback navigation without state
                    console.log("🔄 Attempting fallback navigation");
                    navigate("/calendar");
                    console.log("🚀 Fallback navigation initiated");
                  }
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Today's Plan
              </button>
              <button
                onClick={() => {
                  setActivePlan(null);
                  setShowInputBar(true);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                New Plan
              </button>
            </div>
          </div>
        )}

        {/* Health Input Bar - Show when no plans generated or when generating */}
        {(showInputBar || progress.isGenerating) && (
          <HealthInputBar onPlanGenerate={handlePlanGeneration} />
        )}

        {/* Plan Selection Cards - Show when plans are generated */}
        {generatedPlans.length > 0 && (
          <ComprehensivePlanSelectionCards
            plans={generatedPlans}
            onPlanSelect={handlePlanSelect}
            onViewPlanDetails={handleViewPlanDetails}
          />
        )}

        {/* Debug Info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-yellow-100 p-4 rounded-lg text-sm">
            <h3 className="font-bold">Debug Info:</h3>
            <p>showInputBar: {showInputBar.toString()}</p>
            <p>progress.isGenerating: {progress.isGenerating.toString()}</p>
            <p>generatedPlans.length: {generatedPlans.length}</p>
            <p>activePlan: {activePlan ? 'Yes' : 'No'}</p>
            <p>showPlannerPage: {showPlannerPage.toString()}</p>
            <p>showCalendarView: {showCalendarView.toString()}</p>
          </div>
        )}
      </div>
    </div>
  );
};
