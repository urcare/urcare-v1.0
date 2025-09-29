import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Heart, 
  Zap, 
  Moon, 
  Brain,
  Dumbbell,
  Utensils,
  Droplets
} from "lucide-react";
import React from "react";

interface HealthScore {
  current: number;
  projected: number;
  improvements: string[];
}

interface HealthScoreDisplayProps {
  healthScore: HealthScore;
  className?: string;
}

export const HealthScoreDisplay: React.FC<HealthScoreDisplayProps> = ({
  healthScore,
  className = ""
}) => {
  const improvement = healthScore.projected - healthScore.current;
  const improvementPercentage = Math.round((improvement / healthScore.current) * 100);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Improvement";
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return "bg-emerald-100 text-emerald-800 border-emerald-200";
    if (score >= 60) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (score >= 40) return "bg-orange-100 text-orange-800 border-orange-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Health Score Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-emerald-600" />
            Health Score
          </CardTitle>
          <CardDescription>
            Your current health status and projected improvement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Score */}
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background Circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-gray-200"
                  />
                  {/* Progress Circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - healthScore.current / 100)}`}
                    className={`transition-all duration-1000 ${getScoreColor(healthScore.current)}`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(healthScore.current)}`}>
                      {healthScore.current}
                    </div>
                    <div className="text-xs text-gray-500">Current</div>
                  </div>
                </div>
              </div>
              <Badge className={getScoreBadgeColor(healthScore.current)}>
                {getScoreLabel(healthScore.current)}
              </Badge>
            </div>

            {/* Projected Score */}
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background Circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-gray-200"
                  />
                  {/* Progress Circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - healthScore.projected / 100)}`}
                    className={`transition-all duration-1000 ${getScoreColor(healthScore.projected)}`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(healthScore.projected)}`}>
                      {healthScore.projected}
                    </div>
                    <div className="text-xs text-gray-500">Projected</div>
                  </div>
                </div>
              </div>
              <Badge className={getScoreBadgeColor(healthScore.projected)}>
                {getScoreLabel(healthScore.projected)}
              </Badge>
            </div>
          </div>

          {/* Improvement Summary */}
          <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Expected Improvement</span>
              <div className="flex items-center gap-1">
                {improvement > 0 ? (
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span className={`text-sm font-bold ${
                  improvement > 0 ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  +{improvement} points ({improvementPercentage}%)
                </span>
              </div>
            </div>
            <Progress 
              value={healthScore.projected} 
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Improvements List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Key Improvements
          </CardTitle>
          <CardDescription>
            Areas where you'll see the most progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {healthScore.improvements.map((improvement, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-sm text-gray-700">{improvement}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


