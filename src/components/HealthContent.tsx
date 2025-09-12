import { CalorieTrackerCard } from "./CalorieTrackerCard";
import { DashboardHeader } from "./DashboardHeader";
import { HealthInputBar } from "./HealthInputBar";
import { StepCounterCard } from "./StepCounterCard";

export const HealthContent = () => {
  return (
    <div className="h-screen bg-gradient-to-br from-green-100 via-emerald-50 to-green-100 relative overflow-hidden">
      {/* Header Section - Top 15% */}
      <DashboardHeader />

      {/* Tracker Cards Section - Next 40% */}
      <div className="h-2/5 bg-transparent px-2 sm:px-4 pb-2 sm:pb-4">
        <div className="h-full flex gap-2 sm:gap-4">
          {/* Step Counter Card */}
          <div className="flex-1">
            <StepCounterCard />
          </div>
          {/* Calorie Tracker Card */}
          <div className="flex-1">
            <CalorieTrackerCard />
          </div>
        </div>
      </div>

      {/* Health Input Section - Next 45% */}
      <HealthInputBar />
    </div>
  );
};
