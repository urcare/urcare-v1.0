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
import { enhancedHealthPlanService } from "@/services/enhancedHealthPlanService";
import { HealthGoal } from "@/services/goalTimelineCalculator";
import {
  AlertTriangle,
  Award,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  Target,
  TrendingUp,
} from "lucide-react";
import React, { useEffect, useState } from "react";

interface ProgressSummary {
  totalGoals: number;
  activeGoals: number;
  completedGoals: number;
  averageProgress: number;
  timelineStatus: {
    onTrack: number;
    ahead: number;
    behind: number;
  };
}

interface GoalProgressData {
  goal: HealthGoal;
  expectedProgress: number;
  actualProgress: number;
  complianceRate: number;
  timelineAdjustment: number;
  recentActivities: number;
  nextMilestone?: {
    title: string;
    targetDate: string;
    progress: number;
  };
}

export const ProgressDashboard: React.FC = () => {
  const { goals, getActiveGoals, getCompletedGoals } = useHealthGoals();
  const [progressSummary, setProgressSummary] =
    useState<ProgressSummary | null>(null);
  const [goalProgressData, setGoalProgressData] = useState<GoalProgressData[]>(
    []
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProgressData();
  }, [goals]);

  const loadProgressData = async () => {
    try {
      setLoading(true);

      // Get progress summary
      const summary = await enhancedHealthPlanService.getGoalProgressSummary(
        goals[0]?.user_id || ""
      );
      setProgressSummary(summary);

      // Get detailed progress data for each goal
      const activeGoals = getActiveGoals();
      const progressData: GoalProgressData[] = [];

      for (const goal of activeGoals) {
        if (goal.id) {
          try {
            const adjustments =
              await enhancedHealthPlanService.getAdaptiveAdjustments(goal.id);

            // Calculate expected progress
            const startDate = new Date(goal.start_date);
            const targetDate = new Date(goal.target_date);
            const today = new Date();

            const totalDays = Math.ceil(
              (targetDate.getTime() - startDate.getTime()) /
                (1000 * 60 * 60 * 24)
            );
            const daysElapsed = Math.ceil(
              (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
            );
            const expectedProgress = Math.max(
              0,
              Math.min(100, (daysElapsed / totalDays) * 100)
            );

            // Find next milestone
            const nextMilestone = goal.milestones?.find(
              (milestone) => !milestone.completed
            );

            progressData.push({
              goal,
              expectedProgress,
              actualProgress: goal.progress_percentage,
              complianceRate: 0, // This would be calculated from recent compliance data
              timelineAdjustment: adjustments.timelineAdjustment,
              recentActivities: 0, // This would be calculated from recent activities
              nextMilestone: nextMilestone
                ? {
                    title: nextMilestone.title,
                    targetDate: nextMilestone.target_date,
                    progress: (goal.progress_percentage / 100) * 100,
                  }
                : undefined,
            });
          } catch (error) {
            console.error(
              `Error loading progress data for goal ${goal.id}:`,
              error
            );
          }
        }
      }

      setGoalProgressData(progressData);
    } catch (error) {
      console.error("Error loading progress data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTimelineStatus = (expected: number, actual: number) => {
    const difference = actual - expected;
    if (difference >= 10)
      return { status: "ahead", color: "text-green-600", icon: TrendingUp };
    if (difference <= -10)
      return { status: "behind", color: "text-red-600", icon: AlertTriangle };
    return { status: "on_track", color: "text-blue-600", icon: CheckCircle };
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 60) return "bg-blue-500";
    if (progress >= 40) return "bg-yellow-500";
    if (progress >= 20) return "bg-orange-500";
    return "bg-red-500";
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading progress data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Progress Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Track your health goals and celebrate achievements
          </p>
        </div>
        <Button onClick={loadProgressData} variant="outline">
          <BarChart3 className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Progress Summary Cards */}
      {progressSummary && (
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
                  <CheckCircle className="h-5 w-5 text-green-600" />
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

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">On Track</p>
                  <p className="text-2xl font-bold">
                    {progressSummary.timelineStatus.onTrack}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Timeline Status Overview */}
      {progressSummary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Timeline Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {progressSummary.timelineStatus.ahead}
                </div>
                <div className="text-sm text-gray-600">Ahead of Schedule</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {progressSummary.timelineStatus.onTrack}
                </div>
                <div className="text-sm text-gray-600">On Track</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {progressSummary.timelineStatus.behind}
                </div>
                <div className="text-sm text-gray-600">Behind Schedule</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Goals Progress Tabs */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Active Goals ({goalProgressData.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Completed ({getCompletedGoals().length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {goalProgressData.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No active goals</h3>
                <p className="text-gray-600">
                  Create your first health goal to start tracking progress.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {goalProgressData.map((data) => {
                const timelineStatus = getTimelineStatus(
                  data.expectedProgress,
                  data.actualProgress
                );
                const daysRemaining = getDaysRemaining(data.goal.target_date);

                return (
                  <Card
                    key={data.goal.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-xl">
                            {data.goal.title}
                          </CardTitle>
                          <CardDescription>
                            {data.goal.description}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={timelineStatus.color}
                          >
                            <timelineStatus.icon className="h-3 w-3 mr-1" />
                            {timelineStatus.status.replace("_", " ")}
                          </Badge>
                          <Badge variant="outline">
                            Priority {data.goal.priority}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Progress Bars */}
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Overall Progress</span>
                            <span>{data.actualProgress.toFixed(1)}%</span>
                          </div>
                          <Progress
                            value={data.actualProgress}
                            className="h-3"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Expected Progress</span>
                            <span>{data.expectedProgress.toFixed(1)}%</span>
                          </div>
                          <Progress
                            value={data.expectedProgress}
                            className="h-2 bg-gray-200"
                          />
                        </div>
                      </div>

                      {/* Goal Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Current:</span>
                          <span className="ml-2 font-medium">
                            {data.goal.current_value} {data.goal.unit}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Target:</span>
                          <span className="ml-2 font-medium">
                            {data.goal.target_value} {data.goal.unit}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Timeline:</span>
                          <span className="ml-2 font-medium">
                            {data.goal.calculated_timeline_weeks} weeks
                          </span>
                        </div>
                      </div>

                      {/* Next Milestone */}
                      {data.nextMilestone && (
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-blue-800">
                                Next Milestone
                              </h4>
                              <p className="text-sm text-blue-600">
                                {data.nextMilestone.title}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-blue-600">
                                {formatDate(data.nextMilestone.targetDate)}
                              </p>
                              <p className="text-xs text-gray-500">
                                {daysRemaining} days remaining
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Timeline Adjustment */}
                      {data.timelineAdjustment !== 1.0 && (
                        <div className="p-3 bg-yellow-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            <span className="text-sm text-yellow-800">
                              Timeline adjusted by{" "}
                              {((data.timelineAdjustment - 1) * 100).toFixed(0)}
                              %
                              {data.timelineAdjustment > 1
                                ? " (extended)"
                                : " (accelerated)"}
                            </span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {getCompletedGoals().length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
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
              {getCompletedGoals().map((goal) => (
                <Card key={goal.id} className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Award className="h-5 w-5 text-green-600" />
                      {goal.title}
                    </CardTitle>
                    <CardDescription>{goal.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Final Progress:</span>
                        <span className="font-medium text-green-600">100%</span>
                      </div>
                      <Progress value={100} className="h-2 bg-green-200" />
                      <div className="text-sm text-gray-600">
                        Completed on {formatDate(goal.updated_at || "")}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
