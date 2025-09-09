import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  DayActivity,
  DayPlan,
  TwoDayHealthPlan,
  twoDayPlanService,
} from "@/services/twoDayPlanService";
import {
  Brain,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Droplets,
  Dumbbell,
  Moon,
  Pill,
  Target,
  TrendingUp,
  Utensils,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface TwoDayPlanCardProps {
  plan: TwoDayHealthPlan;
  onPlanUpdate?: () => void;
}

const getActivityIcon = (type: DayActivity["type"]) => {
  switch (type) {
    case "workout":
      return <Dumbbell className="h-4 w-4" />;
    case "meal":
      return <Utensils className="h-4 w-4" />;
    case "hydration":
      return <Droplets className="h-4 w-4" />;
    case "sleep":
      return <Moon className="h-4 w-4" />;
    case "meditation":
      return <Brain className="h-4 w-4" />;
    case "supplement":
      return <Pill className="h-4 w-4" />;
    default:
      return <Circle className="h-4 w-4" />;
  }
};

const getActivityColor = (type: DayActivity["type"]) => {
  switch (type) {
    case "workout":
      return "bg-red-100 text-red-800";
    case "meal":
      return "bg-green-100 text-green-800";
    case "hydration":
      return "bg-blue-100 text-blue-800";
    case "sleep":
      return "bg-purple-100 text-purple-800";
    case "meditation":
      return "bg-indigo-100 text-indigo-800";
    case "supplement":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const ActivityCard: React.FC<{
  activity: DayActivity;
  planId: string;
  dayNumber: 1 | 2;
  onUpdate: () => void;
}> = ({ activity, planId, dayNumber, onUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [notes, setNotes] = useState(activity.notes || "");
  const [showNotes, setShowNotes] = useState(false);

  const handleToggleComplete = async () => {
    setIsUpdating(true);
    try {
      await twoDayPlanService.updateActivityProgress(
        planId,
        activity.id,
        dayNumber,
        !activity.completed,
        notes
      );
      onUpdate();
      toast.success(
        activity.completed
          ? "Activity marked as incomplete"
          : "Great job! Activity completed!",
        {
          description: activity.title,
        }
      );
    } catch (error) {
      console.error("Error updating activity:", error);
      toast.error("Failed to update activity");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleNotesUpdate = async () => {
    setIsUpdating(true);
    try {
      await twoDayPlanService.updateActivityProgress(
        planId,
        activity.id,
        dayNumber,
        activity.completed,
        notes
      );
      onUpdate();
      toast.success("Notes updated");
      setShowNotes(false);
    } catch (error) {
      console.error("Error updating notes:", error);
      toast.error("Failed to update notes");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card
      className={`transition-all duration-200 ${
        activity.completed ? "bg-green-50 border-green-200" : "hover:shadow-md"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <Checkbox
              checked={activity.completed}
              onCheckedChange={handleToggleComplete}
              disabled={isUpdating}
              className="h-5 w-5"
            />
          </div>

          <div className="flex-grow">
            <div className="flex items-center gap-2 mb-2">
              <Badge
                variant="secondary"
                className={getActivityColor(activity.type)}
              >
                {getActivityIcon(activity.type)}
                <span className="ml-1 capitalize">{activity.type}</span>
              </Badge>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Clock className="h-3 w-3" />
                {activity.time}
                {activity.duration && <span>• {activity.duration}</span>}
              </div>
            </div>

            <h4
              className={`font-medium mb-1 ${
                activity.completed ? "line-through text-gray-500" : ""
              }`}
            >
              {activity.title}
            </h4>

            <p className="text-sm text-gray-600 mb-2">{activity.description}</p>

            {activity.instructions.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-500 mb-1">
                  Instructions:
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  {activity.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start gap-1">
                      <span className="text-gray-400">•</span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotes(!showNotes)}
                className="text-xs"
              >
                {notes || activity.notes ? "View Notes" : "Add Notes"}
              </Button>
            </div>

            {showNotes && (
              <div className="mt-3 space-y-2">
                <Textarea
                  placeholder="Add notes about this activity..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="text-sm"
                  rows={2}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleNotesUpdate}
                    disabled={isUpdating}
                  >
                    Save Notes
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowNotes(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const DayPlanCard: React.FC<{
  dayPlan: DayPlan;
  dayNumber: 1 | 2;
  planId: string;
  isCompleted: boolean;
  onUpdate: () => void;
}> = ({ dayPlan, dayNumber, planId, isCompleted, onUpdate }) => {
  const completedActivities = dayPlan.activities.filter(
    (a) => a.completed
  ).length;
  const totalActivities = dayPlan.activities.length;
  const progressPercentage =
    totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0;

  return (
    <Card className={`${isCompleted ? "bg-green-50 border-green-200" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Day {dayNumber}
            {isCompleted && <CheckCircle2 className="h-5 w-5 text-green-600" />}
          </CardTitle>
          <Badge variant={isCompleted ? "default" : "secondary"}>
            {completedActivities}/{totalActivities} completed
          </Badge>
        </div>
        <div className="space-y-2">
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-sm text-gray-600">
            {Math.round(progressPercentage)}% complete
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Activities */}
        <div className="space-y-3">
          {dayPlan.activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              planId={planId}
              dayNumber={dayNumber}
              onUpdate={onUpdate}
            />
          ))}
        </div>

        {/* Goals Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
          <Card className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <Utensils className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Nutrition Goals</span>
            </div>
            <div className="space-y-1 text-xs text-gray-600">
              <div>Calories: {dayPlan.nutritionGoals.calories}</div>
              <div>Protein: {dayPlan.nutritionGoals.protein}g</div>
              <div>Water: {dayPlan.nutritionGoals.water}ml</div>
            </div>
          </Card>

          <Card className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium">Fitness Goals</span>
            </div>
            <div className="space-y-1 text-xs text-gray-600">
              <div>Steps: {dayPlan.fitnessGoals.steps.toLocaleString()}</div>
              <div>Active: {dayPlan.fitnessGoals.activeMinutes}min</div>
              <div>Calories: {dayPlan.fitnessGoals.caloriesBurned}</div>
            </div>
          </Card>

          <Card className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Wellness Goals</span>
            </div>
            <div className="space-y-1 text-xs text-gray-600">
              <div>Sleep: {dayPlan.wellnessGoals.sleepHours}h</div>
              <div>
                Mindfulness: {dayPlan.wellnessGoals.mindfulnessMinutes}min
              </div>
              <div>Stress: {dayPlan.wellnessGoals.stressLevel}</div>
            </div>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export const TwoDayPlanCard: React.FC<TwoDayPlanCardProps> = ({
  plan,
  onPlanUpdate,
}) => {
  const [currentPlan, setCurrentPlan] = useState(plan);

  const handleUpdate = async () => {
    try {
      // Refresh the plan data from the service
      const updatedPlan = await twoDayPlanService.getCurrentPlan(plan.userId);
      if (updatedPlan) {
        setCurrentPlan(updatedPlan);
      }
      onPlanUpdate?.();
    } catch (error) {
      console.error("Error refreshing plan:", error);
    }
  };

  const totalActivities =
    currentPlan.day1Plan.activities.length +
    currentPlan.day2Plan.activities.length;
  const completedActivities = [
    ...currentPlan.day1Plan.activities,
    ...currentPlan.day2Plan.activities,
  ].filter((a) => a.completed).length;

  const overallProgress =
    totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Plan Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              <TrendingUp className="h-6 w-6" />
              Your 2-Day Health Plan
            </CardTitle>
            <Badge variant="outline" className="text-sm">
              {new Date(currentPlan.planStartDate).toLocaleDateString()} -{" "}
              {new Date(currentPlan.planEndDate).toLocaleDateString()}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Overall Progress</span>
              <span>{Math.round(overallProgress)}% complete</span>
            </div>
            <Progress value={overallProgress} className="h-3" />
          </div>
        </CardHeader>
      </Card>

      {/* Day Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DayPlanCard
          dayPlan={currentPlan.day1Plan}
          dayNumber={1}
          planId={currentPlan.id}
          isCompleted={currentPlan.day1Completed}
          onUpdate={handleUpdate}
        />

        <DayPlanCard
          dayPlan={currentPlan.day2Plan}
          dayNumber={2}
          planId={currentPlan.id}
          isCompleted={currentPlan.day2Completed}
          onUpdate={handleUpdate}
        />
      </div>

      {/* Completion Message */}
      {currentPlan.day1Completed && currentPlan.day2Completed && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Congratulations! Plan Completed!
            </h3>
            <p className="text-green-700 mb-4">
              You've successfully completed your 2-day health plan. A new plan
              will be generated automatically.
            </p>
            <Badge variant="outline" className="bg-white">
              Completed on{" "}
              {currentPlan.completedAt
                ? new Date(currentPlan.completedAt).toLocaleDateString()
                : "Recently"}
            </Badge>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
