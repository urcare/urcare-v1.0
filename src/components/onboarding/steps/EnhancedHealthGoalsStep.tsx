import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Plus, Target, X } from "lucide-react";
import React, { useState } from "react";

interface EnhancedHealthGoalsStepProps {
  selectedGoals: string[];
  onToggleGoal: (goal: string) => void;
  goalDetails: GoalDetail[];
  onUpdateGoalDetail: (goalType: string, detail: Partial<GoalDetail>) => void;
  onAddGoalDetail: (goalType: string) => void;
  onRemoveGoalDetail: (goalType: string) => void;
  error?: string;
}

interface GoalDetail {
  goalType: string;
  title: string;
  description?: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  timelinePreference: "gradual" | "moderate" | "aggressive";
  barriers: string[];
  priority: number;
}

const healthGoals = [
  { value: "weight_loss", label: "Weight Loss", unit: "kg" },
  { value: "weight_gain", label: "Weight Gain", unit: "kg" },
  { value: "muscle_building", label: "Muscle Building", unit: "kg" },
  { value: "fitness", label: "Fitness Improvement", unit: "%" },
  { value: "sleep_improvement", label: "Sleep Improvement", unit: "hours" },
  { value: "stress_reduction", label: "Stress Reduction", unit: "level" },
  {
    value: "smoking_cessation",
    label: "Smoking Cessation",
    unit: "cigarettes/day",
  },
  {
    value: "alcohol_reduction",
    label: "Alcohol Reduction",
    unit: "drinks/week",
  },
  { value: "nutrition", label: "Nutrition Improvement", unit: "score" },
  { value: "custom", label: "Custom Goal", unit: "units" },
];

const timelinePreferences = [
  {
    value: "gradual",
    label: "Gradual (6+ months)",
    description: "Slow and steady approach",
  },
  {
    value: "moderate",
    label: "Moderate (3-6 months)",
    description: "Balanced timeline",
  },
  {
    value: "aggressive",
    label: "Aggressive (1-3 months)",
    description: "Fast-track approach",
  },
];

const commonBarriers = [
  "Consistency",
  "Unhealthy eating",
  "Lack of support",
  "Busy schedule",
  "Smoking",
  "Alcohol",
  "Stress",
  "Lack of motivation",
  "Financial constraints",
  "Health conditions",
];

export const EnhancedHealthGoalsStep: React.FC<
  EnhancedHealthGoalsStepProps
> = ({
  selectedGoals,
  onToggleGoal,
  goalDetails,
  onUpdateGoalDetail,
  onAddGoalDetail,
  onRemoveGoalDetail,
  error,
}) => {
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null);

  const handleGoalToggle = (goalValue: string) => {
    onToggleGoal(goalValue);

    // If adding a goal, create a default goal detail
    if (!selectedGoals.includes(goalValue)) {
      const goal = healthGoals.find((g) => g.value === goalValue);
      if (goal) {
        onAddGoalDetail(goalValue);
      }
    }
  };

  const getGoalDetail = (goalType: string): GoalDetail | undefined => {
    return goalDetails.find((detail) => detail.goalType === goalType);
  };

  const handleBarrierToggle = (goalType: string, barrier: string) => {
    const detail = getGoalDetail(goalType);
    if (!detail) return;

    const updatedBarriers = detail.barriers.includes(barrier)
      ? detail.barriers.filter((b) => b !== barrier)
      : [...detail.barriers, barrier];

    onUpdateGoalDetail(goalType, { barriers: updatedBarriers });
  };

  return (
    <div className="space-y-6">
      {/* Goal Selection */}
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">
            What are your health goals?
          </h3>
          <p className="text-gray-600 text-sm">
            Select all that apply. You can add details for each goal.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {healthGoals.map((goal) => (
            <button
              key={goal.value}
              onClick={() => handleGoalToggle(goal.value)}
              className={`p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                selectedGoals.includes(goal.value)
                  ? "border-primary bg-primary/5 text-primary shadow-lg scale-105"
                  : "border-gray-200 bg-white text-gray-700 hover:border-emerald-300 hover:bg-primary/5"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{goal.label}</span>
                {selectedGoals.includes(goal.value) && (
                  <Badge variant="secondary" className="text-xs">
                    {goal.unit}
                  </Badge>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Goal Details */}
      {selectedGoals.length > 0 && (
        <div className="space-y-4">
          <div className="text-center">
            <h4 className="text-md font-semibold mb-2">Goal Details</h4>
            <p className="text-gray-600 text-sm">
              Add specific details for each selected goal.
            </p>
          </div>

          {selectedGoals.map((goalType) => {
            const goal = healthGoals.find((g) => g.value === goalType);
            const detail = getGoalDetail(goalType);

            if (!goal || !detail) return null;

            return (
              <Card key={goalType} className="border-2 border-primary/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      {goal.label}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setExpandedGoal(
                            expandedGoal === goalType ? null : goalType
                          )
                        }
                      >
                        {expandedGoal === goalType ? "Collapse" : "Expand"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRemoveGoalDetail(goalType)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`title-${goalType}`}>Goal Title</Label>
                      <Input
                        id={`title-${goalType}`}
                        value={detail.title}
                        onChange={(e) =>
                          onUpdateGoalDetail(goalType, {
                            title: e.target.value,
                          })
                        }
                        placeholder={`e.g., ${goal.label.toLowerCase()} target`}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`description-${goalType}`}>
                        Description (Optional)
                      </Label>
                      <Textarea
                        id={`description-${goalType}`}
                        value={detail.description || ""}
                        onChange={(e) =>
                          onUpdateGoalDetail(goalType, {
                            description: e.target.value,
                          })
                        }
                        placeholder="Why is this goal important to you?"
                        rows={2}
                      />
                    </div>
                  </div>

                  {/* Current and Target Values */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`current-${goalType}`}>
                        Current Value
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id={`current-${goalType}`}
                          type="number"
                          value={detail.currentValue || ""}
                          onChange={(e) =>
                            onUpdateGoalDetail(goalType, {
                              currentValue: parseFloat(e.target.value) || 0,
                            })
                          }
                          placeholder="0"
                        />
                        <Badge variant="outline">{goal.unit}</Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`target-${goalType}`}>Target Value</Label>
                      <div className="flex gap-2">
                        <Input
                          id={`target-${goalType}`}
                          type="number"
                          value={detail.targetValue || ""}
                          onChange={(e) =>
                            onUpdateGoalDetail(goalType, {
                              targetValue: parseFloat(e.target.value) || 0,
                            })
                          }
                          placeholder="0"
                        />
                        <Badge variant="outline">{goal.unit}</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Preference */}
                  <div className="space-y-2">
                    <Label>Timeline Preference</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {timelinePreferences.map((pref) => (
                        <Card
                          key={pref.value}
                          className={`cursor-pointer transition-all ${
                            detail.timelinePreference === pref.value
                              ? "ring-2 ring-primary bg-primary/5"
                              : "hover:bg-primary/5"
                          }`}
                          onClick={() =>
                            onUpdateGoalDetail(goalType, {
                              timelinePreference: pref.value as any,
                            })
                          }
                        >
                          <CardContent className="p-3">
                            <h5 className="font-medium text-sm">
                              {pref.label}
                            </h5>
                            <p className="text-xs text-gray-600">
                              {pref.description}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Barriers */}
                  <div className="space-y-2">
                    <Label>What barriers do you anticipate?</Label>
                    <div className="flex flex-wrap gap-2">
                      {commonBarriers.map((barrier) => (
                        <Badge
                          key={barrier}
                          variant={
                            detail.barriers.includes(barrier)
                              ? "default"
                              : "outline"
                          }
                          className="cursor-pointer"
                          onClick={() => handleBarrierToggle(goalType, barrier)}
                        >
                          {barrier}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Priority */}
                  <div className="space-y-2">
                    <Label htmlFor={`priority-${goalType}`}>
                      Priority Level
                    </Label>
                    <Select
                      value={detail.priority.toString()}
                      onValueChange={(value) =>
                        onUpdateGoalDetail(goalType, {
                          priority: parseInt(value),
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 - Highest Priority</SelectItem>
                        <SelectItem value="2">2 - High Priority</SelectItem>
                        <SelectItem value="3">3 - Medium Priority</SelectItem>
                        <SelectItem value="4">4 - Low Priority</SelectItem>
                        <SelectItem value="5">5 - Lowest Priority</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add More Goals Button */}
      {selectedGoals.length > 0 &&
        selectedGoals.length < healthGoals.length && (
          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => {
                const remainingGoals = healthGoals.filter(
                  (g) => !selectedGoals.includes(g.value)
                );
                if (remainingGoals.length > 0) {
                  handleGoalToggle(remainingGoals[0].value);
                }
              }}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Another Goal
            </Button>
          </div>
        )}

      {/* Timeline Preview */}
      {selectedGoals.length > 0 && (
        <Card className="bg-emerald-50 border-emerald-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-blue-800">
              <Clock className="h-5 w-5" />
              Timeline Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-700 text-sm">
              Based on your selected goals and preferences, we'll calculate
              realistic timelines and create personalized health plans that
              adapt to your progress.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedGoals.map((goalType) => {
                const goal = healthGoals.find((g) => g.value === goalType);
                const detail = getGoalDetail(goalType);
                return (
                  <Badge key={goalType} variant="secondary" className="text-xs">
                    {goal?.label}: {detail?.timelinePreference || "moderate"}{" "}
                    timeline
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <div className="text-red-500 text-sm text-center mt-2">{error}</div>
      )}
    </div>
  );
};
