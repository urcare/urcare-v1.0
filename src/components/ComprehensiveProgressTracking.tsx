import { comprehensiveHealthPlanService } from "@/services/comprehensiveHealthPlanService";
import {
  ComprehensiveHealthPlan,
  DailyPlanExecution,
  MonthlyAssessment,
  WeeklyProgressTracking,
} from "@/types/comprehensiveHealthPlan";
import {
  AlertTriangle,
  BarChart3,
  Calendar,
  CheckCircle,
  Target,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";

interface ComprehensiveProgressTrackingProps {
  plan: ComprehensiveHealthPlan;
  onBack: () => void;
}

type ViewMode = "daily" | "weekly" | "monthly" | "overview";

export const ComprehensiveProgressTracking = ({
  plan,
  onBack,
}: ComprehensiveProgressTrackingProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>("overview");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(1);

  const [dailyPlan, setDailyPlan] = useState<DailyPlanExecution | null>(null);
  const [weeklyProgress, setWeeklyProgress] =
    useState<WeeklyProgressTracking | null>(null);
  const [monthlyAssessment, setMonthlyAssessment] =
    useState<MonthlyAssessment | null>(null);

  useEffect(() => {
    loadProgressData();
  }, [viewMode, selectedDate, selectedWeek, selectedMonth]);

  const loadProgressData = async () => {
    try {
      switch (viewMode) {
        case "daily":
          const daily = await comprehensiveHealthPlanService.getDailyPlan(
            plan.id,
            selectedDate
          );
          setDailyPlan(daily);
          break;
        case "weekly":
          const weekly = await comprehensiveHealthPlanService.getWeeklyProgress(
            plan.id,
            selectedWeek
          );
          setWeeklyProgress(weekly);
          break;
        case "monthly":
          // Load monthly assessment data
          // setMonthlyAssessment(monthly);
          break;
      }
    } catch (error) {
      console.error("Error loading progress data:", error);
    }
  };

  const getCurrentWeek = () => {
    const startDate = new Date(plan.start_date);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.min(Math.ceil(diffDays / 7), plan.duration_weeks);
  };

  const getCurrentMonth = () => {
    const startDate = new Date(plan.start_date);
    const currentDate = new Date();
    const diffMonths =
      (currentDate.getFullYear() - startDate.getFullYear()) * 12 +
      (currentDate.getMonth() - startDate.getMonth());
    return Math.min(diffMonths + 1, Math.ceil(plan.duration_weeks / 4));
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600 bg-green-100";
    if (percentage >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Overall Progress */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Overall Progress</h3>
          <div className="text-3xl font-bold text-blue-600">
            {Math.round(plan.overall_progress_percentage)}%
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${plan.overall_progress_percentage}%` }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">
              {getCurrentWeek()}/{plan.duration_weeks}
            </div>
            <div className="text-sm text-gray-600">Weeks Completed</div>
          </div>
          <div className="text-center">
            <div
              className={`text-2xl font-bold ${getProgressColor(
                plan.weekly_compliance_rate
              )}`}
            >
              {Math.round(plan.weekly_compliance_rate)}%
            </div>
            <div className="text-sm text-gray-600">Weekly Compliance</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">
              {Math.max(
                0,
                Math.ceil(
                  (new Date(plan.target_end_date).getTime() -
                    new Date().getTime()) /
                    (1000 * 60 * 60 * 24)
                )
              )}
            </div>
            <div className="text-sm text-gray-600">Days Remaining</div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            <span className="font-medium text-gray-700">Today</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">85%</div>
          <div className="text-sm text-gray-500">Activities Complete</div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className="font-medium text-gray-700">This Week</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">78%</div>
          <div className="text-sm text-gray-500">Compliance Rate</div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="w-5 h-5 text-purple-500" />
            <span className="font-medium text-gray-700">Milestones</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">3/5</div>
          <div className="text-sm text-gray-500">Achieved</div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center space-x-2 mb-2">
            <BarChart3 className="w-5 h-5 text-orange-500" />
            <span className="font-medium text-gray-700">Trend</span>
          </div>
          <div className="text-2xl font-bold text-green-600">↗</div>
          <div className="text-sm text-gray-500">Improving</div>
        </div>
      </div>

      {/* Recent Milestones */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h4 className="text-lg font-bold text-gray-900 mb-4">
          Recent Milestones
        </h4>
        <div className="space-y-3">
          {plan.weekly_milestones.slice(0, 3).map((milestone, index) => (
            <div key={index} className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <div className="font-medium text-gray-800">
                  {milestone.title}
                </div>
                <div className="text-sm text-gray-600">
                  {milestone.description}
                </div>
                <div className="text-xs text-gray-500">
                  Week {milestone.week_number}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDailyView = () => (
    <div className="space-y-6">
      {/* Date Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Daily Progress</h3>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg"
          min={plan.start_date}
          max={plan.target_end_date}
        />
      </div>

      {dailyPlan ? (
        <div className="space-y-4">
          {/* Daily Summary */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-gray-900">
                {new Date(selectedDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h4>
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  dailyPlan.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : dailyPlan.status === "in_progress"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {dailyPlan.status}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {dailyPlan.activities_completed}/{dailyPlan.total_activities}
                </div>
                <div className="text-sm text-gray-600">Activities</div>
              </div>
              <div className="text-center">
                <div
                  className={`text-2xl font-bold ${getProgressColor(
                    dailyPlan.completion_percentage
                  )}`}
                >
                  {Math.round(dailyPlan.completion_percentage)}%
                </div>
                <div className="text-sm text-gray-600">Completion</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {dailyPlan.energy_level || "N/A"}/10
                </div>
                <div className="text-sm text-gray-600">Energy Level</div>
              </div>
            </div>
          </div>

          {/* Activities Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Morning Routine */}
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <h5 className="font-bold text-gray-900 mb-3">Morning Routine</h5>
              <div className="space-y-2">
                {dailyPlan.daily_activities
                  .filter((a) => a.time_of_day === "morning")
                  .map((activity, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">
                        {activity.title}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Workouts */}
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <h5 className="font-bold text-gray-900 mb-3">Workouts</h5>
              <div className="space-y-2">
                {dailyPlan.daily_workouts.map((workout, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-700">
                      {workout.name} ({workout.duration}min)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Meals */}
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <h5 className="font-bold text-gray-900 mb-3">Meals</h5>
              <div className="space-y-2">
                {dailyPlan.daily_meals.map((meal, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-orange-500" />
                    <span className="text-sm text-gray-700">{meal.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Wellness Activities */}
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <h5 className="font-bold text-gray-900 mb-3">Wellness</h5>
              <div className="space-y-2">
                {dailyPlan.daily_wellness.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-gray-700">
                      {activity.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Notes */}
          {dailyPlan.user_notes && (
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <h5 className="font-bold text-gray-900 mb-2">Notes</h5>
              <p className="text-gray-700">{dailyPlan.user_notes}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No plan data available for this date</p>
        </div>
      )}
    </div>
  );

  const renderWeeklyView = () => (
    <div className="space-y-6">
      {/* Week Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Weekly Progress</h3>
        <select
          value={selectedWeek}
          onChange={(e) => setSelectedWeek(Number(e.target.value))}
          className="px-3 py-2 border border-gray-300 rounded-lg"
        >
          {Array.from({ length: plan.duration_weeks }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              Week {i + 1}
            </option>
          ))}
        </select>
      </div>

      {/* Weekly Summary */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h4 className="text-lg font-bold text-gray-900 mb-4">
          Week {selectedWeek} Summary
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {weeklyProgress?.completed_activities || 0}/
              {weeklyProgress?.total_activities || 0}
            </div>
            <div className="text-sm text-gray-600">Activities</div>
          </div>
          <div className="text-center">
            <div
              className={`text-2xl font-bold ${getProgressColor(
                weeklyProgress?.compliance_rate || 0
              )}`}
            >
              {Math.round(weeklyProgress?.compliance_rate || 0)}%
            </div>
            <div className="text-sm text-gray-600">Compliance</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {weeklyProgress?.weekly_rating || "N/A"}/10
            </div>
            <div className="text-sm text-gray-600">Weekly Rating</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {weeklyProgress?.weight_change
                ? `${weeklyProgress.weight_change > 0 ? "+" : ""}${
                    weeklyProgress.weight_change
                  }kg`
                : "N/A"}
            </div>
            <div className="text-sm text-gray-600">Weight Change</div>
          </div>
        </div>

        {/* Milestones */}
        {weeklyProgress?.milestones_achieved &&
          weeklyProgress.milestones_achieved.length > 0 && (
            <div className="mb-4">
              <h5 className="font-bold text-gray-900 mb-2">
                Milestones Achieved
              </h5>
              <div className="space-y-1">
                {weeklyProgress.milestones_achieved.map((milestone, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-700">{milestone}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Challenges */}
        {weeklyProgress?.challenges_faced &&
          weeklyProgress.challenges_faced.length > 0 && (
            <div className="mb-4">
              <h5 className="font-bold text-gray-900 mb-2">Challenges Faced</h5>
              <div className="space-y-1">
                {weeklyProgress.challenges_faced.map((challenge, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-700">{challenge}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Successes */}
        {weeklyProgress?.successes_celebrated &&
          weeklyProgress.successes_celebrated.length > 0 && (
            <div>
              <h5 className="font-bold text-gray-900 mb-2">
                Successes Celebrated
              </h5>
              <div className="space-y-1">
                {weeklyProgress.successes_celebrated.map((success, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-700">{success}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );

  const renderMonthlyView = () => (
    <div className="space-y-6">
      {/* Month Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Monthly Assessment</h3>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="px-3 py-2 border border-gray-300 rounded-lg"
        >
          {Array.from(
            { length: Math.ceil(plan.duration_weeks / 4) },
            (_, i) => (
              <option key={i + 1} value={i + 1}>
                Month {i + 1}
              </option>
            )
          )}
        </select>
      </div>

      {/* Monthly Assessment */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h4 className="text-lg font-bold text-gray-900 mb-4">
          Month {selectedMonth} Assessment
        </h4>

        <div className="text-center py-12">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            Monthly assessment data will be available here
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Complete your monthly check-in to see detailed insights
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {plan.plan_name}
                </h1>
                <p className="text-gray-600">Progress Tracking</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { key: "overview", label: "Overview", icon: BarChart3 },
              { key: "daily", label: "Daily", icon: Calendar },
              { key: "weekly", label: "Weekly", icon: TrendingUp },
              { key: "monthly", label: "Monthly", icon: Target },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setViewMode(key as ViewMode)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                  viewMode === key
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {viewMode === "overview" && renderOverview()}
        {viewMode === "daily" && renderDailyView()}
        {viewMode === "weekly" && renderWeeklyView()}
        {viewMode === "monthly" && renderMonthlyView()}
      </div>
    </div>
  );
};
