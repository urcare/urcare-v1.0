import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  GoalAwareActivity,
  enhancedHealthPlanService,
} from "@/services/enhancedHealthPlanService";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Edit3,
  Info,
  Target,
  TrendingUp,
  XCircle,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface ActivityTrackingProps {
  activities: GoalAwareActivity[];
  planId: string;
  dayNumber: number;
  onActivityUpdate?: (activityId: string, status: string) => void;
}

type ComplianceStatus = "completed" | "skipped" | "modified" | "partial";

export const ActivityTracking: React.FC<ActivityTrackingProps> = ({
  activities,
  planId,
  dayNumber,
  onActivityUpdate,
}) => {
  const [trackingData, setTrackingData] = useState<{
    [activityId: string]: {
      status: ComplianceStatus | null;
      notes: string;
      isExpanded: boolean;
    };
  }>({});

  const [loading, setLoading] = useState<{ [activityId: string]: boolean }>({});

  const getStatusColor = (status: ComplianceStatus) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "partial":
        return "bg-yellow-500";
      case "modified":
        return "bg-blue-500";
      case "skipped":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: ComplianceStatus) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "partial":
        return <Clock className="h-4 w-4" />;
      case "modified":
        return <Edit3 className="h-4 w-4" />;
      case "skipped":
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleStatusChange = async (
    activityId: string,
    status: ComplianceStatus
  ) => {
    setLoading((prev) => ({ ...prev, [activityId]: true }));

    try {
      const notes = trackingData[activityId]?.notes || "";

      await enhancedHealthPlanService.trackActivityCompliance(
        planId,
        activityId,
        dayNumber,
        status,
        notes
      );

      setTrackingData((prev) => ({
        ...prev,
        [activityId]: {
          ...prev[activityId],
          status,
          isExpanded: false,
        },
      }));

      toast.success(`Activity marked as ${status}`);

      if (onActivityUpdate) {
        onActivityUpdate(activityId, status);
      }
    } catch (error) {
      console.error("Error tracking activity compliance:", error);
      toast.error("Failed to update activity status");
    } finally {
      setLoading((prev) => ({ ...prev, [activityId]: false }));
    }
  };

  const toggleExpanded = (activityId: string) => {
    setTrackingData((prev) => ({
      ...prev,
      [activityId]: {
        ...prev[activityId],
        isExpanded: !prev[activityId]?.isExpanded,
      },
    }));
  };

  const updateNotes = (activityId: string, notes: string) => {
    setTrackingData((prev) => ({
      ...prev,
      [activityId]: {
        ...prev[activityId],
        notes,
      },
    }));
  };

  const getGoalImpactText = (impactScore: number) => {
    if (impactScore >= 0.8) return "High Impact";
    if (impactScore >= 0.5) return "Medium Impact";
    if (impactScore >= 0.2) return "Low Impact";
    return "Minimal Impact";
  };

  const getComplianceWeightText = (weight: number) => {
    if (weight >= 0.8) return "Critical";
    if (weight >= 0.5) return "Important";
    if (weight >= 0.2) return "Moderate";
    return "Optional";
  };

  const completedActivities = activities.filter(
    (activity) => trackingData[activity.id]?.status === "completed"
  ).length;

  const totalProgress =
    activities.length > 0 ? (completedActivities / activities.length) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Day {dayNumber} Progress
          </CardTitle>
          <CardDescription>
            Track your activities and see how they contribute to your goals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>
                {completedActivities} / {activities.length} activities
              </span>
            </div>
            <Progress value={totalProgress} className="h-3" />
            <div className="text-sm text-gray-600">
              {totalProgress.toFixed(1)}% of activities completed
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activities List */}
      <div className="space-y-4">
        {activities.map((activity) => {
          const currentStatus = trackingData[activity.id]?.status;
          const isExpanded = trackingData[activity.id]?.isExpanded;
          const isLoading = loading[activity.id];

          return (
            <Card
              key={activity.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">
                        {activity.title}
                      </CardTitle>
                      <Badge
                        variant="outline"
                        className={getPriorityColor(activity.priority)}
                      >
                        {activity.priority}
                      </Badge>
                    </div>
                    <CardDescription>{activity.description}</CardDescription>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {activity.startTime} - {activity.endTime}
                      </span>
                      <span>{activity.duration} min</span>
                      <span className="flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        {getGoalImpactText(activity.impactScore)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {currentStatus && (
                      <Badge
                        variant="outline"
                        className={`${getStatusColor(
                          currentStatus
                        )} text-white`}
                      >
                        {getStatusIcon(currentStatus)}
                        <span className="ml-1 capitalize">{currentStatus}</span>
                      </Badge>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleExpanded(activity.id)}
                    >
                      {isExpanded ? "Collapse" : "Details"}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Goal Impact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
                  <div>
                    <Label className="text-sm font-medium">Goal Impact</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress
                        value={activity.impactScore * 100}
                        className="h-2 flex-1"
                      />
                      <span className="text-sm text-gray-600">
                        {(activity.impactScore * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">
                      Compliance Weight
                    </Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress
                        value={activity.complianceWeight * 100}
                        className="h-2 flex-1"
                      />
                      <span className="text-sm text-gray-600">
                        {getComplianceWeightText(activity.complianceWeight)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="space-y-4 border-t pt-4">
                    {/* Instructions */}
                    {activity.instructions &&
                      activity.instructions.length > 0 && (
                        <div>
                          <Label className="text-sm font-medium">
                            Instructions
                          </Label>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 mt-1">
                            {activity.instructions.map((instruction, index) => (
                              <li key={index}>{instruction}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                    {/* Tips */}
                    {activity.tips && activity.tips.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium">Tips</Label>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 mt-1">
                          {activity.tips.map((tip, index) => (
                            <li key={index}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Notes */}
                    <div>
                      <Label htmlFor={`notes-${activity.id}`}>
                        Notes (Optional)
                      </Label>
                      <Textarea
                        id={`notes-${activity.id}`}
                        value={trackingData[activity.id]?.notes || ""}
                        onChange={(e) =>
                          updateNotes(activity.id, e.target.value)
                        }
                        placeholder="Add any notes about this activity..."
                        rows={2}
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  {!currentStatus && (
                    <>
                      <Button
                        size="sm"
                        onClick={() =>
                          handleStatusChange(activity.id, "completed")
                        }
                        disabled={isLoading}
                        className="flex items-center gap-1"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Complete
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleStatusChange(activity.id, "partial")
                        }
                        disabled={isLoading}
                        className="flex items-center gap-1"
                      >
                        <Clock className="h-4 w-4" />
                        Partial
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleStatusChange(activity.id, "modified")
                        }
                        disabled={isLoading}
                        className="flex items-center gap-1"
                      >
                        <Edit3 className="h-4 w-4" />
                        Modified
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleStatusChange(activity.id, "skipped")
                        }
                        disabled={isLoading}
                        className="flex items-center gap-1 text-red-600 hover:text-red-700"
                      >
                        <XCircle className="h-4 w-4" />
                        Skip
                      </Button>
                    </>
                  )}

                  {currentStatus && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Info className="h-4 w-4" />
                      <span>Status: {currentStatus}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setTrackingData((prev) => ({
                            ...prev,
                            [activity.id]: {
                              ...prev[activity.id],
                              status: null,
                            },
                          }))
                        }
                      >
                        Change
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary */}
      {activities.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg text-blue-800">
              Daily Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">Total Activities:</span>
                <span className="ml-2">{activities.length}</span>
              </div>
              <div>
                <span className="font-medium">Completed:</span>
                <span className="ml-2 text-green-600">
                  {completedActivities}
                </span>
              </div>
              <div>
                <span className="font-medium">Remaining:</span>
                <span className="ml-2 text-gray-600">
                  {activities.length - completedActivities}
                </span>
              </div>
            </div>
            <div className="mt-3 text-sm text-blue-700">
              Keep up the great work! Each completed activity brings you closer
              to your health goals.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
