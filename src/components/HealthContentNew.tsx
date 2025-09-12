import { HealthInputBar } from "./HealthInputBar";
import { DashboardHeaderNew } from "./dashboard/DashboardHeaderNew";
import { ProgressCard } from "./dashboard/ProgressCard";
import { StatsCards } from "./dashboard/StatsCards";

export const HealthContentNew = () => {
  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Header Section */}
      <DashboardHeaderNew />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Main Progress Card */}
        <div className="px-4 mb-3">
          <ProgressCard
            progressPercentage={91}
            caloriesGoal={1350}
            currentDate="19 September"
          />
        </div>

        {/* Stats Cards Section */}
        <div className="px-4 mb-3">
          <StatsCards
            currentSteps={8247}
            stepsGoal={10000}
            stepsChange={1753}
            todayCalories={1278}
            calorieChangePercent={-5.6}
          />
        </div>
      </div>

      {/* Health Input Section - Fixed at bottom with proper spacing */}
      <div className="flex-shrink-0 pb-32">
        <HealthInputBar />
      </div>
    </div>
  );
};
