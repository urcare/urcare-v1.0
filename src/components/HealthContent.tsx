import { useTwoDayPlan } from "@/hooks/useTwoDayPlan";
import { FitnessDashboard } from "./FitnessDashboard";
import { HealthPlanWidget } from "./health-plan/HealthPlanWidget";

export const HealthContent = () => {
  const { currentPlan, loading, generateNewPlan } = useTwoDayPlan();

  return (
    <div className="h-screen bg-transparent px-3 py-2 relative overflow-hidden">
      <div className="h-full overflow-y-auto space-y-4">
        {/* Health Plan Widget */}
        <div className="h-64">
          <HealthPlanWidget
            currentPlan={currentPlan}
            loading={loading}
            onGeneratePlan={generateNewPlan}
          />
        </div>

        {/* Existing Fitness Dashboard */}
        <div className="flex-1">
          <FitnessDashboard />
        </div>
      </div>
    </div>
  );
};
