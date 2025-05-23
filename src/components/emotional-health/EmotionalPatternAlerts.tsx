
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { EmotionalPattern, MoodEntry } from '@/types/emotionalHealth';
import { AlertTriangle, TrendingDown, TrendingUp, Clock, Lightbulb } from 'lucide-react';

interface EmotionalPatternAlertsProps {
  patterns: EmotionalPattern[];
  recentMoods: MoodEntry[];
  onPatternUpdate: (patterns: EmotionalPattern[]) => void;
}

export function EmotionalPatternAlerts({ patterns, recentMoods, onPatternUpdate }: EmotionalPatternAlertsProps) {
  const getSeverityColor = (severity: EmotionalPattern['severity']) => {
    switch (severity) {
      case 'mild': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'moderate': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'severe': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPatternIcon = (type: EmotionalPattern['type']) => {
    switch (type) {
      case 'weekly_low': return <TrendingDown className="h-5 w-5" />;
      case 'stress_spike': return <AlertTriangle className="h-5 w-5" />;
      case 'anxiety_pattern': return <AlertTriangle className="h-5 w-5" />;
      case 'improvement_trend': return <TrendingUp className="h-5 w-5" />;
      case 'energy_dip': return <TrendingDown className="h-5 w-5" />;
      default: return <Clock className="h-5 w-5" />;
    }
  };

  const analyzeCurrentMood = () => {
    if (recentMoods.length < 3) return null;

    const last3Days = recentMoods.slice(0, 3);
    const lowMoodCount = last3Days.filter(mood => mood.intensity <= 3).length;
    
    if (lowMoodCount >= 2) {
      return {
        type: 'warning',
        message: 'Low mood pattern detected in recent days',
        severity: 'moderate' as const
      };
    }

    const anxiousMoodCount = last3Days.filter(mood => mood.mood === 'anxious').length;
    if (anxiousMoodCount >= 2) {
      return {
        type: 'warning',
        message: 'Increased anxiety levels noticed',
        severity: 'mild' as const
      };
    }

    return null;
  };

  const currentAlert = analyzeCurrentMood();

  return (
    <div className="space-y-6">
      {currentAlert && (
        <Alert className={`border-l-4 ${getSeverityColor(currentAlert.severity)}`}>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Pattern Alert</AlertTitle>
          <AlertDescription>
            {currentAlert.message}. Consider implementing some mood-boosting activities or reaching out for support.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Emotional Pattern Detection
          </CardTitle>
          <CardDescription>
            AI-identified patterns in your emotional wellbeing
          </CardDescription>
        </CardHeader>
        <CardContent>
          {patterns.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No patterns detected yet</p>
              <p className="text-sm">Keep tracking your mood to identify patterns and trends</p>
            </div>
          ) : (
            <div className="space-y-4">
              {patterns.map((pattern) => (
                <div
                  key={pattern.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getPatternIcon(pattern.type)}
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {pattern.description}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Occurs {pattern.frequency} • Detected {pattern.detectedAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge className={getSeverityColor(pattern.severity)}>
                      {pattern.severity}
                    </Badge>
                  </div>

                  {pattern.triggers.length > 0 && (
                    <div className="mb-3">
                      <h5 className="font-medium text-sm text-gray-700 mb-1">Common Triggers:</h5>
                      <div className="flex flex-wrap gap-1">
                        {pattern.triggers.map((trigger, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {trigger}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-blue-50 rounded-lg p-3">
                    <h5 className="font-medium text-sm text-blue-900 mb-2 flex items-center gap-1">
                      <Lightbulb className="h-4 w-4" />
                      AI Suggestions:
                    </h5>
                    <ul className="space-y-1">
                      {pattern.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-sm text-blue-800 flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pattern Prevention Tips</CardTitle>
          <CardDescription>
            Proactive strategies to maintain emotional balance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">🌱 Daily Habits</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Consistent sleep schedule</li>
                <li>• Regular movement/exercise</li>
                <li>• Mindful eating patterns</li>
                <li>• Hydration throughout the day</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">🧠 Mental Health</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Practice gratitude daily</li>
                <li>• Limit negative news intake</li>
                <li>• Connect with supportive people</li>
                <li>• Set healthy boundaries</li>
              </ul>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">⚡ Stress Management</h4>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• Deep breathing exercises</li>
                <li>• Progressive muscle relaxation</li>
                <li>• Time in nature</li>
                <li>• Meditation or mindfulness</li>
              </ul>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-semibold text-yellow-900 mb-2">🔍 Early Detection</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Track mood consistently</li>
                <li>• Notice physical symptoms</li>
                <li>• Monitor sleep quality</li>
                <li>• Be aware of thought patterns</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
