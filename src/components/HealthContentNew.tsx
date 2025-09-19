import { useState } from "react";
import { HealthInputBar } from "./HealthInputBar";
import { PlanSelectionCards } from "./PlanSelectionCards";
import { PlannerPage } from "./PlannerPage";
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
}

export const HealthContentNew = () => {
  const [suggestedInput, setSuggestedInput] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlans, setGeneratedPlans] = useState<PlanData[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<PlanData | null>(null);
  const [showInputBar, setShowInputBar] = useState(true);
  const [showPlannerPage, setShowPlannerPage] = useState(false);

  const handleSuggestedInput = (input: string) => {
    setSuggestedInput(input);
    // You can add logic here to pass this to the HealthInputBar component
    // For now, we'll just set the state
  };

  const handlePlanGeneration = async (input: string) => {
    setIsGenerating(true);
    setShowInputBar(false);

    try {
      // Use the actual health plan service
      const { healthPlanService } = await import(
        "@/services/healthPlanService"
      );
      const plan = await healthPlanService.generateHealthPlan();

      // Check if we got a fallback plan
      const isFallbackPlan = plan.id.startsWith("fallback-");

      // Convert the plan to the expected format
      const convertedPlan: PlanData = {
        id: plan.id,
        name: "Personalized Health Plan",
        difficulty: "moderate",
        description: "Customized health plan based on your profile and goals",
        duration: "2 days",
        features: [
          "Personalized nutrition",
          "Custom workouts",
          "Sleep optimization",
        ],
        timetable:
          plan.day_1_plan?.activities?.map((activity) => ({
            time: activity.startTime,
            activity: activity.title,
            duration: `${activity.duration} min`,
            type:
              activity.type === "meal"
                ? "meal"
                : activity.type === "workout"
                ? "exercise"
                : activity.type === "sleep"
                ? "sleep"
                : activity.type === "hydration"
                ? "morning"
                : activity.type === "meditation"
                ? "morning"
                : "morning",
            description: activity.description,
          })) || [],
      };

      // Create multiple plans with different difficulties
      const multiplePlans: PlanData[] = [
        convertedPlan,
        {
          ...convertedPlan,
          id: `${convertedPlan.id}-easy`,
          name: "Easy Wellness Plan",
          difficulty: "easy",
          description: "Gentle introduction to healthy habits",
          duration: "1 week",
          features: ["Light exercises", "Simple meals", "Basic routine"],
        },
        {
          ...convertedPlan,
          id: `${convertedPlan.id}-hard`,
          name: "Intensive Health Plan",
          difficulty: "hard",
          description: "Comprehensive health transformation",
          duration: "4 weeks",
          features: [
            "Intensive workouts",
            "Strict nutrition",
            "Advanced tracking",
          ],
        },
      ];

      setGeneratedPlans(multiplePlans);
      setIsGenerating(false);
      console.log("🎉 Plan generation completed successfully!");
    } catch (error) {
      console.error("❌ Error generating health plan:", error);
      setIsGenerating(false);
      setShowInputBar(true); // Show input bar again on error
      // Show error to user with more helpful message
      alert(
        `Unable to generate health plan at this time. Please try again in a few moments. Error: ${error.message}`
      );
    }
  };

  const handlePlanSelect = (plan: PlanData) => {
    setSelectedPlan(plan);
    setShowPlannerPage(true);
  };

  const handleBackToPlans = () => {
    setShowPlannerPage(false);
    setSelectedPlan(null);
  };

  const handleNewPlan = () => {
    setSelectedPlan(null);
    setGeneratedPlans([]);
    setShowInputBar(true);
    setShowPlannerPage(false);
  };

  // Show PlannerPage when a plan is selected
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

        {/* Loading State */}
        {isGenerating && (
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-center">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mr-3"></div>
              <p className="text-lg font-medium text-gray-700">
                Creating your health plan...
              </p>
            </div>
          </div>
        )}

        {/* Test Button - Remove this after testing */}
        {!isGenerating && generatedPlans.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="text-sm text-yellow-800 mb-2">
              Debug: Test the function directly
            </p>
            <button
              onClick={() => handlePlanGeneration("I want to lose weight")}
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
            >
              Test Generate Plan
            </button>
          </div>
        )}

        {/* Health Input Bar - Show when no plans generated or when generating */}
        {(showInputBar || isGenerating) && (
          <HealthInputBar onPlanGenerate={handlePlanGeneration} />
        )}

        {/* Plan Selection Cards - Show when plans are generated */}
        {generatedPlans.length > 0 && (
          <PlanSelectionCards
            plans={generatedPlans}
            onPlanSelect={handlePlanSelect}
          />
        )}
      </div>
    </div>
  );
};
