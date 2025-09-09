import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useHealthGoals } from "@/hooks/useHealthGoals";
import {
  HealthGoal,
  TimelineCalculation,
} from "@/services/goalTimelineCalculator";
import { AlertTriangle, Clock, Target, TrendingUp } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface GoalSetupProps {
  onGoalCreated?: (goal: HealthGoal) => void;
  onCancel?: () => void;
}

export const GoalSetup: React.FC<GoalSetupProps> = ({
  onGoalCreated,
  onCancel,
}) => {
  const { createGoal, calculateTimeline, calculating } = useHealthGoals();

  const [goalData, setGoalData] = useState({
    goal_type: "" as any,
    title: "",
    description: "",
    target_value: 0,
    current_value: 0,
    unit: "",
    target_date: "",
    timeline_preference: "moderate" as "gradual" | "moderate" | "aggressive",
    priority: 1,
    barriers: [] as string[],
  });

  const [timelinePreview, setTimelinePreview] =
    useState<TimelineCalculation | null>(null);
  const [showTimelinePreview, setShowTimelinePreview] = useState(false);

  const goalTypes = [
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

  const handleGoalTypeChange = (value: string) => {
    const goalType = goalTypes.find((type) => type.value === value);
    setGoalData((prev) => ({
      ...prev,
      goal_type: value as any,
      unit: goalType?.unit || "",
      title: goalType?.label || "",
    }));
  };

  const handleBarrierToggle = (barrier: string) => {
    setGoalData((prev) => ({
      ...prev,
      barriers: prev.barriers.includes(barrier)
        ? prev.barriers.filter((b) => b !== barrier)
        : [...prev.barriers, barrier],
    }));
  };

  const handlePreviewTimeline = async () => {
    if (
      !goalData.goal_type ||
      !goalData.target_value ||
      !goalData.current_value
    ) {
      toast.error("Please fill in the required fields first");
      return;
    }

    const timeline = await calculateTimeline({
      goal_type: goalData.goal_type,
      title: goalData.title,
      description: goalData.description,
      target_value: goalData.target_value,
      current_value: goalData.current_value,
      unit: goalData.unit,
      target_date: goalData.target_date,
      start_date: new Date().toISOString().split("T")[0],
      timeline_preference: goalData.timeline_preference,
      status: "active",
      priority: goalData.priority,
      barriers: goalData.barriers,
      milestones: [],
      progress_percentage: 0,
    });

    if (timeline) {
      setTimelinePreview(timeline);
      setShowTimelinePreview(true);
    }
  };

  const handleCreateGoal = async () => {
    if (!goalData.goal_type || !goalData.title || !goalData.target_value) {
      toast.error("Please fill in all required fields");
      return;
    }

    const goal = await createGoal({
      goal_type: goalData.goal_type,
      title: goalData.title,
      description: goalData.description,
      target_value: goalData.target_value,
      current_value: goalData.current_value,
      unit: goalData.unit,
      target_date:
        goalData.target_date ||
        new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0], // Default 90 days
      start_date: new Date().toISOString().split("T")[0],
      timeline_preference: goalData.timeline_preference,
      status: "active",
      priority: goalData.priority,
      barriers: goalData.barriers,
      milestones: timelinePreview?.milestones || [],
      progress_percentage: 0,
    });

    if (goal && onGoalCreated) {
      onGoalCreated(goal);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            Set Your Health Goal
          </CardTitle>
          <CardDescription>
            Let's create a personalized health goal with a realistic timeline
            that fits your lifestyle.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Goal Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="goal-type">Goal Type *</Label>
            <Select
              value={goalData.goal_type}
              onValueChange={handleGoalTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your goal type" />
              </SelectTrigger>
              <SelectContent>
                {goalTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Goal Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Goal Title *</Label>
            <Input
              id="title"
              value={goalData.title}
              onChange={(e) =>
                setGoalData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="e.g., Lose 10kg for better health"
            />
          </div>

          {/* Goal Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={goalData.description}
              onChange={(e) =>
                setGoalData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Describe why this goal is important to you..."
              rows={3}
            />
          </div>

          {/* Current and Target Values */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="current-value">Current Value *</Label>
              <div className="flex gap-2">
                <Input
                  id="current-value"
                  type="number"
                  value={goalData.current_value || ""}
                  onChange={(e) =>
                    setGoalData((prev) => ({
                      ...prev,
                      current_value: parseFloat(e.target.value) || 0,
                    }))
                  }
                  placeholder="0"
                />
                <Badge variant="outline">{goalData.unit}</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="target-value">Target Value *</Label>
              <div className="flex gap-2">
                <Input
                  id="target-value"
                  type="number"
                  value={goalData.target_value || ""}
                  onChange={(e) =>
                    setGoalData((prev) => ({
                      ...prev,
                      target_value: parseFloat(e.target.value) || 0,
                    }))
                  }
                  placeholder="0"
                />
                <Badge variant="outline">{goalData.unit}</Badge>
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
                    goalData.timeline_preference === pref.value
                      ? "ring-2 ring-primary bg-primary/5"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() =>
                    setGoalData((prev) => ({
                      ...prev,
                      timeline_preference: pref.value as any,
                    }))
                  }
                >
                  <CardContent className="p-4">
                    <h4 className="font-medium">{pref.label}</h4>
                    <p className="text-sm text-gray-600">{pref.description}</p>
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
                    goalData.barriers.includes(barrier) ? "default" : "outline"
                  }
                  className="cursor-pointer"
                  onClick={() => handleBarrierToggle(barrier)}
                >
                  {barrier}
                </Badge>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority">Priority Level</Label>
            <Select
              value={goalData.priority.toString()}
              onValueChange={(value) =>
                setGoalData((prev) => ({ ...prev, priority: parseInt(value) }))
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

          {/* Preview Timeline Button */}
          <Button
            onClick={handlePreviewTimeline}
            disabled={
              calculating || !goalData.goal_type || !goalData.target_value
            }
            className="w-full"
            variant="outline"
          >
            <Clock className="h-4 w-4 mr-2" />
            {calculating ? "Calculating..." : "Preview Timeline"}
          </Button>
        </CardContent>
      </Card>

      {/* Timeline Preview */}
      {showTimelinePreview && timelinePreview && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-green-600" />
              Your Personalized Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {timelinePreview.realistic_weeks}
                </div>
                <div className="text-sm text-gray-600">Weeks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {timelinePreview.realistic_months}
                </div>
                <div className="text-sm text-gray-600">Months</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {timelinePreview.success_probability}%
                </div>
                <div className="text-sm text-gray-600">Success Probability</div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>
                Weekly Target: {timelinePreview.weekly_target.toFixed(2)}{" "}
                {goalData.unit}
              </Label>
              <Progress
                value={
                  (timelinePreview.weekly_target / goalData.target_value) * 100
                }
                className="h-2"
              />
            </div>

            <div className="space-y-2">
              <Label>Milestones</Label>
              <div className="space-y-2">
                {timelinePreview.milestones
                  .slice(0, 3)
                  .map((milestone, index) => (
                    <div
                      key={milestone.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded"
                    >
                      <span className="font-medium">{milestone.title}</span>
                      <span className="text-sm text-gray-600">
                        {milestone.target_date}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {timelinePreview.safety_considerations.length > 0 && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  Safety Considerations
                </Label>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  {timelinePreview.safety_considerations.map(
                    (consideration, index) => (
                      <li key={index}>{consideration}</li>
                    )
                  )}
                </ul>
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                {timelinePreview.timeline_preference_impact}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          onClick={handleCreateGoal}
          disabled={
            calculating ||
            !goalData.goal_type ||
            !goalData.title ||
            !goalData.target_value
          }
          className="min-w-32"
        >
          {calculating ? "Creating..." : "Create Goal"}
        </Button>
      </div>
    </div>
  );
};
