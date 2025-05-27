
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Calendar, Target, Brain, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

interface WeeklyMetric {
  category: string;
  current: number;
  previous: number;
  goal: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  insight: string;
}

interface HealthInsight {
  type: 'achievement' | 'improvement' | 'concern' | 'suggestion';
  title: string;
  description: string;
  action?: string;
}

export const WeeklyHealthSummary = () => {
  const [selectedWeek, setSelectedWeek] = useState('current');
  
  const weeklyMetrics: WeeklyMetric[] = [
    {
      category: 'Hydration',
      current: 7.2,
      previous: 6.8,
      goal: 8.0,
      unit: 'glasses/day',
      trend: 'up',
      insight: 'Great improvement! You\'re 90% towards your hydration goal.'
    },
    {
      category: 'Sleep',
      current: 7.1,
      previous: 7.5,
      goal: 8.0,
      unit: 'hours/night',
      trend: 'down',
      insight: 'Sleep quality decreased this week. Consider an earlier bedtime.'
    },
    {
      category: 'Exercise',
      current: 4,
      previous: 3,
      goal: 5,
      unit: 'sessions/week',
      trend: 'up',
      insight: 'Excellent progress! You\'re building a consistent exercise routine.'
    },
    {
      category: 'Nutrition',
      current: 85,
      previous: 82,
      goal: 90,
      unit: '% healthy meals',
      trend: 'up',
      insight: 'Your nutrition choices are improving steadily.'
    }
  ];

  const healthInsights: HealthInsight[] = [
    {
      type: 'achievement',
      title: 'Hydration Streak Champion!',
      description: 'You maintained your hydration goal for 5 consecutive days this week.',
      action: 'Keep this momentum going!'
    },
    {
      type: 'improvement',
      title: 'Exercise Consistency Rising',
      description: 'Your workout frequency increased by 33% compared to last week.',
      action: 'Add one more session to reach your weekly goal.'
    },
    {
      type: 'concern',
      title: 'Sleep Pattern Disruption',
      description: 'Your sleep duration decreased by 24 minutes on average.',
      action: 'Try setting a consistent bedtime routine.'
    },
    {
      type: 'suggestion',
      title: 'Nutrition Optimization',
      description: 'You\'re close to your nutrition goal. Focus on increasing vegetable intake.',
      action: 'Add one extra serving of vegetables daily.'
    }
  ];

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'achievement': return 'bg-green-100 text-green-800 border-green-200';
      case 'improvement': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'concern': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'suggestion': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'achievement': return '🏆';
      case 'improvement': return '📈';
      case 'concern': return '⚠️';
      case 'suggestion': return '💡';
      default: return '📊';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Target className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleGenerateReport = () => {
    toast.success('Weekly health report generated and sent to your email!');
  };

  const overallScore = Math.round(
    weeklyMetrics.reduce((sum, metric) => sum + (metric.current / metric.goal) * 100, 0) / weeklyMetrics.length
  );

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Weekly Health Summary
          </CardTitle>
          <CardDescription>
            Comprehensive insights into your health journey with AI-powered recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Overall Health Score</h3>
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold text-blue-600">{overallScore}%</div>
                <div className="space-y-1">
                  <Progress value={overallScore} className="w-32 h-3" />
                  <p className="text-sm text-gray-600">
                    {overallScore >= 90 ? 'Excellent' : overallScore >= 70 ? 'Good' : 'Needs Improvement'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={selectedWeek === 'current' ? 'default' : 'outline'}
                onClick={() => setSelectedWeek('current')}
                size="sm"
              >
                This Week
              </Button>
              <Button
                variant={selectedWeek === 'previous' ? 'default' : 'outline'}
                onClick={() => setSelectedWeek('previous')}
                size="sm"
              >
                Last Week
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {weeklyMetrics.map((metric, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{metric.category}</h4>
                      {getTrendIcon(metric.trend)}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-blue-600">
                          {metric.current}
                        </span>
                        <span className="text-sm text-gray-600">{metric.unit}</span>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Goal: {metric.goal}</span>
                          <span>{Math.round((metric.current / metric.goal) * 100)}%</span>
                        </div>
                        <Progress 
                          value={(metric.current / metric.goal) * 100} 
                          className="h-2"
                        />
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-600">vs last week:</span>
                        <span className={`font-medium ${
                          metric.current > metric.previous ? 'text-green-600' : 
                          metric.current < metric.previous ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {metric.current > metric.previous ? '+' : ''}
                          {(metric.current - metric.previous).toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Health Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {healthInsights.map((insight, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border-2 ${getInsightColor(insight.type)}`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{getInsightIcon(insight.type)}</span>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{insight.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {insight.type}
                      </Badge>
                    </div>
                    <p className="text-sm">{insight.description}</p>
                    {insight.action && (
                      <div className="mt-2 p-2 bg-white/50 rounded text-sm font-medium">
                        💡 {insight.action}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Report Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleGenerateReport}>
              <Calendar className="h-4 w-4 mr-2" />
              Generate Full Report
            </Button>
            <Button variant="outline">
              <Target className="h-4 w-4 mr-2" />
              Set New Goals
            </Button>
            <Button variant="outline">
              <Brain className="h-4 w-4 mr-2" />
              Schedule Coach Session
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
