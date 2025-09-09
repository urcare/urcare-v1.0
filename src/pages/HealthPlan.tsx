import { PlanGenerator } from "@/components/health-plan/PlanGenerator";
import { TwoDayPlanCard } from "@/components/health-plan/TwoDayPlanCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useTwoDayPlan } from "@/hooks/useTwoDayPlan";
import {
  AlertCircle,
  Calendar,
  Clock,
  History,
  Loader2,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import React from "react";

const PlanHistoryCard: React.FC<{ planHistory: any[] }> = ({ planHistory }) => {
  if (planHistory.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Plan History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {planHistory.slice(0, 5).map((plan) => (
            <div
              key={plan.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div>
                <div className="font-medium text-sm">
                  {new Date(plan.planStartDate).toLocaleDateString()} -{" "}
                  {new Date(plan.planEndDate).toLocaleDateString()}
                </div>
                <div className="text-xs text-gray-500">
                  Generated {new Date(plan.generatedAt).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    plan.day1Completed && plan.day2Completed
                      ? "default"
                      : "secondary"
                  }
                >
                  {plan.day1Completed && plan.day2Completed
                    ? "Completed"
                    : "Incomplete"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const StatsCard: React.FC<{ currentPlan: any; planHistory: any[] }> = ({
  currentPlan,
  planHistory,
}) => {
  const completedPlans = planHistory.filter(
    (plan) => plan.day1Completed && plan.day2Completed
  ).length;

  const totalActivities = currentPlan
    ? currentPlan.day1Plan.activities.length +
      currentPlan.day2Plan.activities.length
    : 0;

  const completedActivities = currentPlan
    ? [
        ...currentPlan.day1Plan.activities,
        ...currentPlan.day2Plan.activities,
      ].filter((a) => a.completed).length
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            <div>
              <div className="text-2xl font-bold">{completedPlans}</div>
              <div className="text-sm text-gray-600">Plans Completed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <div>
              <div className="text-2xl font-bold">{completedActivities}</div>
              <div className="text-sm text-gray-600">Activities Completed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-600" />
            <div>
              <div className="text-2xl font-bold">
                {currentPlan
                  ? Math.round((completedActivities / totalActivities) * 100)
                  : 0}
                %
              </div>
              <div className="text-sm text-gray-600">Current Progress</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const HealthPlan: React.FC = () => {
  const { user, profile } = useAuth();
  const {
    currentPlan,
    planHistory,
    loading,
    error,
    generateNewPlan,
    refreshPlan,
    hasActivePlan,
  } = useTwoDayPlan();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please log in to access your personalized health plans.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading your health plan...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Calendar className="h-8 w-8" />
            Your Health Plan
          </h1>
          <p className="text-gray-600 mt-1">
            Personalized 2-day health and fitness plans powered by AI
          </p>
        </div>

        {currentPlan && (
          <Button onClick={refreshPlan} variant="outline">
            Refresh
          </Button>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Profile Incomplete Warning */}
      {(!profile?.health_goals?.length ||
        !profile?.age ||
        !profile?.gender) && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please complete your profile to generate personalized health plans.
            We need your health goals, age, and gender to create effective
            plans.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Overview */}
      <StatsCard currentPlan={currentPlan} planHistory={planHistory} />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Plan or Generator */}
        <div className="lg:col-span-2">
          {currentPlan && hasActivePlan ? (
            <TwoDayPlanCard plan={currentPlan} onPlanUpdate={refreshPlan} />
          ) : (
            <PlanGenerator
              onPlanGenerated={refreshPlan}
              hasActivePlan={hasActivePlan}
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => generateNewPlan()}
                disabled={hasActivePlan}
                className="w-full"
                variant={hasActivePlan ? "secondary" : "default"}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {hasActivePlan ? "Complete Current Plan" : "Generate New Plan"}
              </Button>

              <div className="text-xs text-gray-500">
                {hasActivePlan
                  ? "Complete your current plan to generate the next one"
                  : "Generate a personalized 2-day health plan based on your goals"}
              </div>
            </CardContent>
          </Card>

          {/* Plan History */}
          <PlanHistoryCard planHistory={planHistory} />

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tips for Success</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-600">
              <div>• Check off activities as you complete them</div>
              <div>• Add notes to track your progress</div>
              <div>• Complete both days to unlock your next plan</div>
              <div>• Plans are personalized based on your profile</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HealthPlan;
