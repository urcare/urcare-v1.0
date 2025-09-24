import { Footprints, ShoppingBag, TrendingDown } from "lucide-react";
import React from "react";

interface StatsCardsProps {
  currentSteps: number;
  stepsGoal: number;
  stepsChange: number;
  todayCalories: number;
  calorieChangePercent: number;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  currentSteps = 8247,
  stepsGoal = 10000,
  stepsChange = 1753,
  todayCalories = 1278,
  calorieChangePercent = -5.6,
}) => {
  const stepsPercentage = Math.min((currentSteps / stepsGoal) * 100, 100);

  return (
    <div className="flex gap-3">
      {/* Steps Tracker Card */}
      <div className="flex-1 bg-card-bg rounded-xl p-3 shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 bg-card-secondary/20 rounded-lg flex items-center justify-center">
            <Footprints className="w-3 h-3 text-logo-text" />
          </div>
          <h4 className="text-xs font-medium text-logo-text">Steps Today</h4>
        </div>

        <div className="text-xl font-bold text-logo-text mb-1">
          {currentSteps.toLocaleString()}
        </div>

        <div className="flex items-center gap-1 text-logo-text mb-2">
          <TrendingDown className="w-3 h-3" />
          <span className="text-xs font-medium">
            {stepsChange.toLocaleString()} to goal
          </span>
        </div>

        {/* Steps progress bars */}
        <div className="flex items-end gap-1 h-6">
          {Array.from({ length: 10 }, (_, i) => {
            const barHeight = Math.min((stepsPercentage / 10) * (i + 1), 100);
            const height = Math.max((barHeight / 100) * 24, 3); // 24px max height, 3px min
            return (
              <div
                key={i}
                className="w-1.5 bg-progress-fill rounded-t transition-all duration-300"
                style={{ height: `${height}px` }}
              ></div>
            );
          })}
        </div>
      </div>

      {/* Today's Calories Card */}
      <div className="flex-1 bg-card-bg rounded-xl p-3 shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 bg-card-secondary/20 rounded-lg flex items-center justify-center">
            <ShoppingBag className="w-3 h-3 text-logo-text" />
          </div>
          <h4 className="text-xs font-medium text-logo-text">
            Today's Calories
          </h4>
        </div>

        <div className="text-xl font-bold text-logo-text mb-1">
          {todayCalories} Kcal
        </div>

        <div className="flex items-center gap-1 text-logo-text">
          <TrendingDown className="w-3 h-3" />
          <span className="text-xs font-medium">{calorieChangePercent}%</span>
        </div>

        {/* Mini chart */}
        <div className="mt-2 h-6 flex items-end gap-1">
          <div className="w-1.5 bg-progress-fill/20 rounded-t"></div>
          <div className="w-1.5 bg-progress-fill/30 rounded-t"></div>
          <div className="w-1.5 bg-progress-fill/50 rounded-t"></div>
          <div className="w-1.5 bg-progress-fill rounded-t"></div>
          <div className="w-1.5 bg-progress-fill/80 rounded-t"></div>
          <div className="w-1.5 bg-progress-fill rounded-t"></div>
          <div className="w-1.5 bg-progress-fill/50 rounded-t"></div>
          <div className="w-1.5 bg-progress-fill/30 rounded-t"></div>
          <div className="w-1.5 bg-progress-fill/20 rounded-t"></div>
          <div className="w-1.5 bg-progress-fill/10 rounded-t"></div>
        </div>
      </div>
    </div>
  );
};
