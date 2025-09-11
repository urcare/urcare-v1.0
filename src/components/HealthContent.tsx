import { SimpleDashboard } from "./SimpleDashboard";

export const HealthContent = () => {
  return (
    <div className="h-screen bg-transparent relative overflow-hidden">
      <div className="h-full overflow-y-auto">
        {/* Simple Dashboard with Photo, Name, and Health Score */}
        <SimpleDashboard />
      </div>
    </div>
  );
};
