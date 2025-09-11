import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { Heart, TrendingDown, TrendingUp } from "lucide-react";
import React, { useMemo } from "react";

export const SimpleDashboard: React.FC = () => {
  const { user, profile } = useAuth();

  // Calculate health score based on profile data
  const healthScore = useMemo(() => {
    if (!profile) return { score: 0, trend: "stable" };

    let score = 50; // Base score
    let trend: "improving" | "stable" | "declining" = "stable";

    // BMI calculation
    if (profile.height_cm && profile.weight_kg) {
      const height = parseFloat(profile.height_cm);
      const weight = parseFloat(profile.weight_kg);
      const bmi = weight / (height / 100) ** 2;

      if (bmi >= 18.5 && bmi <= 24.9) {
        score += 20; // Healthy BMI
      } else if (bmi < 18.5 || bmi > 30) {
        score -= 15; // Underweight or obese
      } else {
        score += 5; // Overweight but not obese
      }
    }

    // Age factor
    if (profile.age) {
      if (profile.age >= 18 && profile.age <= 65) {
        score += 10;
      } else if (profile.age > 65) {
        score += 5;
      }
    }

    // Sleep schedule
    if (profile.sleep_time && profile.wake_up_time) {
      score += 10; // Has sleep schedule
    }

    // Workout routine
    if (profile.workout_time) {
      score += 10; // Has workout routine
    }

    // Diet type
    if (profile.diet_type && profile.diet_type !== "none") {
      score += 5; // Has dietary preferences
    }

    // Chronic conditions (negative impact)
    if (profile.chronic_conditions && profile.chronic_conditions.length > 0) {
      score -= profile.chronic_conditions.length * 5;
    }

    // Ensure score is between 0 and 100
    score = Math.max(0, Math.min(100, score));

    // Determine trend based on score
    if (score >= 80) trend = "improving";
    else if (score < 50) trend = "declining";

    return { score: Math.round(score), trend };
  }, [profile]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "declining":
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Heart className="w-4 h-4 text-blue-600" />;
    }
  };

  const getTrendText = (trend: string) => {
    switch (trend) {
      case "improving":
        return "Improving";
      case "declining":
        return "Needs Attention";
      default:
        return "Stable";
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "improving":
        return "text-green-600";
      case "declining":
        return "text-red-600";
      default:
        return "text-blue-600";
    }
  };

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardContent className="p-8 text-center space-y-6">
          {/* User Profile Photo */}
          <div className="flex justify-center">
            <Avatar className="w-24 h-24 ring-4 ring-white shadow-lg">
              <AvatarImage
                src={
                  user.user_metadata?.avatar_url ||
                  user.user_metadata?.picture ||
                  "/images/profile-placeholder.jpg"
                }
                alt={profile.full_name || "User"}
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl font-bold">
                {(profile.full_name || user?.email || "U")
                  .charAt(0)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* User Name */}
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {profile.full_name || user?.email?.split("@")[0] || "User"}
            </h1>
            {profile.role && (
              <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                {profile.role}
              </p>
            )}
          </div>

          {/* Health Score */}
          <div className="space-y-4">
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getScoreBgColor(
                healthScore.score
              )}`}
            >
              {getTrendIcon(healthScore.trend)}
              <span
                className={`text-sm font-medium ${getTrendColor(
                  healthScore.trend
                )}`}
              >
                {getTrendText(healthScore.trend)}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Heart className="w-6 h-6 text-red-500" />
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  Health Score
                </span>
              </div>

              <div className="space-y-2">
                <div className="text-4xl font-bold">
                  <span className={getScoreColor(healthScore.score)}>
                    {healthScore.score}
                  </span>
                  <span className="text-gray-500 text-2xl">/100</span>
                </div>

                <Progress value={healthScore.score} className="w-full h-3" />
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            <p>Keep up the great work!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
