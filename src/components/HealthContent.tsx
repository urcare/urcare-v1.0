import { FitnessDashboard } from "./FitnessDashboard";

export const HealthContent = () => {
  return (
    <div className="h-screen bg-transparent px-3 py-2 relative overflow-hidden">
      <div className="h-full overflow-y-auto space-y-4">
        {/* Fitness Dashboard Only */}
        <div className="flex-1">
          <FitnessDashboard />
        </div>
      </div>
    </div>
  );
};
