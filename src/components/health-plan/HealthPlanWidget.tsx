import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TwoDayHealthPlan } from "@/services/twoDayPlanService";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Target,
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

interface HealthPlanWidgetProps {
  currentPlan?: TwoDayHealthPlan | null;
  loading?: boolean;
  onGeneratePlan?: () => void;
}

export const HealthPlanWidget: React.FC<HealthPlanWidgetProps> = ({
  currentPlan,
  loading = false,
  onGeneratePlan,
}) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="h-5 w-5" />
            Health Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-32">
          <div className="text-center">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-gray-500">Loading plan...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentPlan) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="h-5 w-5" />
            Health Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-4">
            <Sparkles className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-4">
              No active health plan. Generate your personalized 2-day plan!
            </p>
            <Button onClick={onGeneratePlan} size="sm" className="w-full">
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Plan
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalActivities =
    currentPlan.day1Plan.activities.length +
    currentPlan.day2Plan.activities.length;
  const completedActivities = [
    ...currentPlan.day1Plan.activities,
    ...currentPlan.day2Plan.activities,
  ].filter((a) => a.completed).length;

  const overallProgress =
    totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0;

  const getCurrentDayActivities = () => {
    const today = new Date().toISOString().split("T")[0];
    const planStartDate = new Date(currentPlan.planStartDate)
      .toISOString()
      .split("T")[0];
    const planEndDate = new Date(currentPlan.planEndDate)
      .toISOString()
      .split("T")[0];

    if (today === planStartDate) {
      return {
        dayNumber: 1,
        activities: currentPlan.day1Plan.activities,
        completed: currentPlan.day1Completed,
      };
    } else if (today === planEndDate) {
      return {
        dayNumber: 2,
        activities: currentPlan.day2Plan.activities,
        completed: currentPlan.day2Completed,
      };
    }

    // Default to day 1 if dates don't match exactly
    return {
      dayNumber: 1,
      activities: currentPlan.day1Plan.activities,
      completed: currentPlan.day1Completed,
    };
  };

  const currentDay = getCurrentDayActivities();
  const todayCompleted = currentDay.activities.filter(
    (a) => a.completed
  ).length;
  const todayTotal = currentDay.activities.length;

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="h-5 w-5" />
            Health Plan
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            Day {currentDay.dayNumber}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Overall Progress</span>
            <span className="font-medium">{Math.round(overallProgress)}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>

        {/* Today's Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Today's Activities</span>
            <span className="font-medium">
              {todayCompleted}/{todayTotal}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {currentDay.activities.slice(0, 4).map((activity, index) => (
              <div
                key={activity.id}
                className={`w-3 h-3 rounded-full ${
                  activity.completed ? "bg-green-500" : "bg-gray-200"
                }`}
              />
            ))}
            {currentDay.activities.length > 4 && (
              <span className="text-xs text-gray-500 ml-1">
                +{currentDay.activities.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Next Activities */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Next Activities:</p>
          <div className="space-y-1">
            {currentDay.activities
              .filter((a) => !a.completed)
              .slice(0, 2)
              .map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-2 text-xs"
                >
                  <Clock className="h-3 w-3 text-gray-400" />
                  <span className="text-gray-600">{activity.time}</span>
                  <span className="font-medium truncate">{activity.title}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Plan Status */}
        {currentPlan.day1Completed && currentPlan.day2Completed && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-sm font-medium">Plan Completed!</span>
            </div>
            <p className="text-xs text-green-600 mt-1">
              Your next plan will be generated automatically.
            </p>
          </div>
        )}

        {/* Action Button */}
        <Button
          onClick={() => navigate("/health-plan")}
          variant="outline"
          size="sm"
          className="w-full"
        >
          View Full Plan
          <ArrowRight className="ml-2 h-3 w-3" />
        </Button>
      </CardContent>
    </Card>
  );
};
