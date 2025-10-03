import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useHealthGoals } from "@/hooks/useHealthGoals";
import { HealthGoal } from "@/services/goalTimelineCalculator";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  Target,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { GoalSetup } from "./GoalSetup";

export const GoalsDashboard: React.FC = () => {
  const {
    goals,
    loading,
    getActiveGoals,
    getCompletedGoals,
    getGoalProgressSummary,
    completeGoal,
    pauseGoal,
    resumeGoal,
    deleteGoal,
  } = useHealthGoals();

  const [showGoalSetup, setShowGoalSetup] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<HealthGoal | null>(null);

  const activeGoals = getActiveGoals();
  const completedGoals = getCompletedGoals();
  const progressSummary = getGoalProgressSummary();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "paused":
        return "bg-yellow-500";
      case "completed":
        return "bg-blue-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Play className="h-4 w-4" />;
      case "paused":
        return <Pause className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1:
        return "bg-red-500";
      case 2:
        return "bg-orange-500";
      case 3:
        return "bg-yellow-500";
      case 4:
        return "bg-blue-500";
      case 5:
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDaysRemaining = (targetDate: string) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleGoalAction = async (goal: HealthGoal, action: string) => {
    if (!goal.id) return;

    switch (action) {
      case "complete":
        await completeGoal(goal.id);
        break;
      case "pause":
        await pauseGoal(goal.id);
        break;
      case "resume":
        await resumeGoal(goal.id);
        break;
      case "delete":
        if (confirm("Are you sure you want to delete this goal?")) {
          await deleteGoal(goal.id);
        }
        break;
    }
  };

  const GoalCard: React.FC<{ goal: HealthGoal }> = ({ goal }) => {
    const daysRemaining = getDaysRemaining(goal.target_date);
    const isOverdue = daysRemaining < 0;
    const isDueSoon = daysRemaining <= 7 && daysRemaining >= 0;

    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                {goal.title}
              </CardTitle>
              <CardDescription className="text-sm">
                {goal.description || "No description provided"}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={`${getStatusColor(goal.status)} text-white text-xs`}
              >
                {getStatusIcon(goal.status)}
                <span className="ml-1 capitalize">{goal.status}</span>
              </Badge>
              <Badge
                variant="outline"
                className={`${getPriorityColor(
                  goal.priority
                )} text-white text-xs`}
              >
                Priority {goal.priority}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{goal.progress_percentage.toFixed(1)}%</span>
            </div>
            <Progress value={goal.progress_percentage} className="h-2" />
          </div>

          {/* Goal Values */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Current:</span>
              <span className="ml-2 font-medium">
                {goal.current_value} {goal.unit}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Target:</span>
              <span className="ml-2 font-medium">
                {goal.target_value} {goal.unit}
              </span>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Timeline</span>
              <span
                className={
                  isOverdue
                    ? "text-red-600"
                    : isDueSoon
                    ? "text-yellow-600"
                    : "text-gray-600"
                }
              >
                {isOverdue
                  ? `${Math.abs(daysRemaining)} days overdue`
                  : isDueSoon
                  ? `${daysRemaining} days left`
                  : `${daysRemaining} days left`}
              </span>
            </div>
            <div className="text-xs text-gray-600">
              Target: {formatDate(goal.target_date)} • Timeline:{" "}
              {goal.calculated_timeline_weeks} weeks ({goal.timeline_preference}
              )
            </div>
          </div>

          {/* Barriers */}
          {goal.barriers.length > 0 && (
            <div className="space-y-2">
              <span className="text-sm text-gray-600">
                Anticipated barriers:
              </span>
              <div className="flex flex-wrap gap-1">
                {goal.barriers.slice(0, 3).map((barrier, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {barrier}
                  </Badge>
                ))}
                {goal.barriers.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{goal.barriers.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            {goal.status === "active" && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleGoalAction(goal, "pause")}
                >
                  <Pause className="h-4 w-4 mr-1" />
                  Pause
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleGoalAction(goal, "complete")}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Complete
                </Button>
              </>
            )}
            {goal.status === "paused" && (
              <Button
                size="sm"
                onClick={() => handleGoalAction(goal, "resume")}
              >
                <Play className="h-4 w-4 mr-1" />
                Resume
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleGoalAction(goal, "delete")}
              className="text-red-600 hover:text-red-700"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your goals...</p>
        </div>
      </div>
    );
  }

  if (showGoalSetup) {
    return (
      <GoalSetup
        onGoalCreated={(goal) => {
          setShowGoalSetup(false);
          toast.success(`Goal "${goal.title}" created successfully!`);
        }}
        onCancel={() => setShowGoalSetup(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Your Health Goals</h1>
          <p className="text-gray-600 mt-1">
            Track your progress and stay motivated
          </p>
        </div>
        <Button
          onClick={() => setShowGoalSetup(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Goal
        </Button>
      </div>

      {/* Progress Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Goals</p>
                <p className="text-2xl font-bold">
                  {progressSummary.totalGoals}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Play className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Goals</p>
                <p className="text-2xl font-bold">
                  {progressSummary.activeGoals}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold">
                  {progressSummary.completedGoals}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Progress</p>
                <p className="text-2xl font-bold">
                  {progressSummary.averageProgress}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals Tabs */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active" className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            Active ({activeGoals.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Completed ({completedGoals.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeGoals.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No active goals</h3>
                <p className="text-gray-600 mb-4">
                  Create your first health goal to get started on your wellness
                  journey.
                </p>
                <Button onClick={() => setShowGoalSetup(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Goal
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeGoals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedGoals.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No completed goals yet
                </h3>
                <p className="text-gray-600">
                  Complete your first goal to see it here!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedGoals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
