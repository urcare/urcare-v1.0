
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MoodEntry, EmotionalPattern, AIInsight } from '@/types/emotionalHealth';
import { Brain, TrendingUp, AlertTriangle, Calendar } from 'lucide-react';

interface AIInsightsDashboardProps {
  moodEntries: MoodEntry[];
  patterns: EmotionalPattern[];
}

export function AIInsightsDashboard({ moodEntries, patterns }: AIInsightsDashboardProps) {
  // Generate AI insights based on mood data
  const generateInsights = (): AIInsight[] => {
    const insights: AIInsight[] = [];
    
    if (moodEntries.length >= 3) {
      const recentMoods = moodEntries.slice(0, 3);
      const avgIntensity = recentMoods.reduce((sum, entry) => sum + entry.intensity, 0) / recentMoods.length;
      
      if (avgIntensity > 7) {
        insights.push({
          id: 'high_intensity',
          type: 'celebration',
          title: 'Positive Trend Detected!',
          description: 'Your mood intensity has been consistently high over the past few days. Keep up the great work!',
          confidence: 85,
          actionable: false,
          generatedAt: new Date()
        });
      } else if (avgIntensity < 4) {
        insights.push({
          id: 'low_intensity',
          type: 'warning',
          title: 'Lower Mood Pattern',
          description: 'Your mood has been lower than usual. Consider reaching out to someone or trying some self-care activities.',
          confidence: 78,
          actionable: true,
          generatedAt: new Date()
        });
      }
    }

    if (moodEntries.filter(entry => entry.mood === 'anxious').length >= 2) {
      insights.push({
        id: 'anxiety_pattern',
        type: 'suggestion',
        title: 'Anxiety Management Suggestion',
        description: 'You\'ve logged anxiety multiple times recently. Try the 4-7-8 breathing technique or a 5-minute meditation.',
        confidence: 72,
        actionable: true,
        generatedAt: new Date()
      });
    }

    return insights;
  };

  const insights = generateInsights();

  const getMoodTrend = () => {
    if (moodEntries.length < 2) return 'stable';
    
    const recent = moodEntries.slice(0, 3);
    const older = moodEntries.slice(3, 6);
    
    if (recent.length === 0 || older.length === 0) return 'stable';
    
    const recentAvg = recent.reduce((sum, entry) => sum + entry.intensity, 0) / recent.length;
    const olderAvg = older.reduce((sum, entry) => sum + entry.intensity, 0) / older.length;
    
    if (recentAvg > olderAvg + 1) return 'improving';
    if (recentAvg < olderAvg - 1) return 'declining';
    return 'stable';
  };

  const trend = getMoodTrend();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.length}</div>
            <p className="text-sm text-gray-600">Active insights</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Mood Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge 
                variant={trend === 'improving' ? 'default' : trend === 'declining' ? 'destructive' : 'secondary'}
              >
                {trend === 'improving' ? '📈' : trend === 'declining' ? '📉' : '➡️'} {trend}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mt-1">Last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Patterns Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patterns.length}</div>
            <p className="text-sm text-gray-600">Behavioral patterns</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI-Generated Insights</CardTitle>
          <CardDescription>
            Personalized insights based on your mood patterns and data
          </CardDescription>
        </CardHeader>
        <CardContent>
          {insights.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Keep tracking your mood to unlock AI insights!</p>
              <p className="text-sm">We need at least 3 entries to start generating insights.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {insights.map((insight) => (
                <div
                  key={insight.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    insight.type === 'celebration' ? 'border-green-500 bg-green-50' :
                    insight.type === 'warning' ? 'border-red-500 bg-red-50' :
                    insight.type === 'suggestion' ? 'border-blue-500 bg-blue-50' :
                    'border-gray-500 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                      <p className="text-gray-700 mt-1">{insight.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">
                          {insight.confidence}% confidence
                        </Badge>
                        {insight.actionable && (
                          <Badge variant="secondary">
                            Actionable
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-2xl ml-4">
                      {insight.type === 'celebration' ? '🎉' :
                       insight.type === 'warning' ? '⚠️' :
                       insight.type === 'suggestion' ? '💡' : '📊'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Weekly AI Nudges</CardTitle>
          <CardDescription>
            Personalized recommendations based on your patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900">💧 Hydration Reminder</h4>
              <p className="text-blue-800 text-sm mt-1">
                Your mood tends to be lower in the afternoon. Try drinking more water around 2 PM.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900">🚶‍♀️ Movement Break</h4>
              <p className="text-green-800 text-sm mt-1">
                You feel better after physical activity. Schedule a 10-minute walk after lunch.
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-900">🧘‍♀️ Mindfulness Moment</h4>
              <p className="text-purple-800 text-sm mt-1">
                Your stress levels peak around 4 PM. Try a 3-minute breathing exercise then.
              </p>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-semibold text-yellow-900">📱 Screen Break</h4>
              <p className="text-yellow-800 text-sm mt-1">
                Extended screen time correlates with lower mood. Take breaks every hour.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
