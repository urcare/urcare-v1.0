
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Brain, Activity, Moon, Apple, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { HealthScore } from '@/types/healthTwin';

interface DailyHealthScoreProps {
  healthScore: HealthScore;
  onRefresh: () => void;
}

export function DailyHealthScore({ healthScore, onRefresh }: DailyHealthScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-400 to-green-600';
    if (score >= 60) return 'from-yellow-400 to-yellow-600';
    if (score >= 40) return 'from-orange-400 to-orange-600';
    return 'from-red-400 to-red-600';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'declining': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-600 bg-green-100';
      case 'declining': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const scoreMetrics = [
    {
      name: 'Cardiovascular',
      score: healthScore.cardiovascular,
      icon: Heart,
      description: 'Heart health and circulation'
    },
    {
      name: 'Mental Health',
      score: healthScore.mental,
      icon: Brain,
      description: 'Mood and cognitive function'
    },
    {
      name: 'Fitness',
      score: healthScore.fitness,
      icon: Activity,
      description: 'Physical activity and strength'
    },
    {
      name: 'Sleep',
      score: healthScore.sleep,
      icon: Moon,
      description: 'Sleep quality and duration'
    },
    {
      name: 'Nutrition',
      score: healthScore.nutrition,
      icon: Apple,
      description: 'Diet and nutritional balance'
    }
  ];

  // Calculate circle circumference for the circular progress
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (healthScore.overall / 100) * circumference;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-6 w-6" />
            Daily Health Score
          </CardTitle>
          <CardDescription>
            Your comprehensive health score based on multiple health metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Circular Progress */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <svg width="280" height="280" className="transform -rotate-90">
                  {/* Background circle */}
                  <circle
                    cx="140"
                    cy="140"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="20"
                    fill="transparent"
                    className="text-gray-200"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="140"
                    cy="140"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="20"
                    fill="transparent"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className={`${getScoreColor(healthScore.overall)} transition-all duration-1000 ease-out`}
                  />
                </svg>
                
                {/* Score display in center */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className={`text-5xl font-bold ${getScoreColor(healthScore.overall)}`}>
                    {healthScore.overall}
                  </div>
                  <div className="text-lg text-gray-600">Health Score</div>
                  <div className="flex items-center gap-1 mt-2">
                    {getTrendIcon(healthScore.trend)}
                    <Badge className={getTrendColor(healthScore.trend)}>
                      {healthScore.trend}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="text-center space-y-2">
                <div className="text-sm text-gray-600">
                  Last updated: {healthScore.lastUpdated.toLocaleDateString()}
                </div>
                <Button onClick={onRefresh} variant="outline" size="sm">
                  Refresh Score
                </Button>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Score Breakdown</h3>
              
              <div className="space-y-4">
                {scoreMetrics.map(metric => {
                  const IconComponent = metric.icon;
                  return (
                    <div key={metric.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4" />
                          <span className="font-medium">{metric.name}</span>
                        </div>
                        <span className={`font-semibold ${getScoreColor(metric.score)}`}>
                          {metric.score}/100
                        </span>
                      </div>
                      
                      <Progress 
                        value={metric.score} 
                        className="h-3"
                      />
                      
                      <div className="text-sm text-gray-600">
                        {metric.description}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Score Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Health Insights</CardTitle>
          <CardDescription>
            Personalized recommendations to improve your health score
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {healthScore.overall >= 80 && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-800 font-medium mb-2">
                  <TrendingUp className="h-4 w-4" />
                  Excellent Health Status
                </div>
                <p className="text-green-700">
                  Your health score is excellent! Keep up the great work with your current habits.
                </p>
              </div>
            )}
            
            {healthScore.overall >= 60 && healthScore.overall < 80 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-800 font-medium mb-2">
                  <Minus className="h-4 w-4" />
                  Good Health Status
                </div>
                <p className="text-yellow-700">
                  Your health is good, but there's room for improvement in some areas.
                </p>
              </div>
            )}
            
            {healthScore.overall < 60 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-800 font-medium mb-2">
                  <TrendingDown className="h-4 w-4" />
                  Health Needs Attention
                </div>
                <p className="text-red-700">
                  Your health score indicates several areas that need attention. Consider consulting with a healthcare provider.
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Areas of Strength</h4>
                <ul className="text-sm space-y-1">
                  {scoreMetrics
                    .filter(m => m.score >= 70)
                    .map(m => (
                      <li key={m.name} className="flex items-center gap-2 text-green-600">
                        <m.icon className="h-3 w-3" />
                        {m.name}
                      </li>
                    ))}
                </ul>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Focus Areas</h4>
                <ul className="text-sm space-y-1">
                  {scoreMetrics
                    .filter(m => m.score < 70)
                    .map(m => (
                      <li key={m.name} className="flex items-center gap-2 text-orange-600">
                        <m.icon className="h-3 w-3" />
                        {m.name}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
