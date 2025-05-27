import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, TrendingDown, Target, MessageCircle, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface HabitAlert {
  id: string;
  habitName: string;
  category: 'hydration' | 'exercise' | 'sleep' | 'nutrition' | 'meditation';
  currentStreak: number;
  previousBest: number;
  daysDeclined: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  lastCompleted: string;
  intervention: {
    type: 'reminder' | 'motivation' | 'adjustment' | 'support';
    title: string;
    description: string;
    action: string;
  };
}

interface Intervention {
  id: string;
  title: string;
  description: string;
  type: 'quick-win' | 'habit-restart' | 'goal-adjustment' | 'support-system';
  estimatedTime: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const HabitDeclineNudges = () => {
  const [habitAlerts, setHabitAlerts] = useState<HabitAlert[]>([
    {
      id: '1',
      habitName: 'Daily Hydration',
      category: 'hydration',
      currentStreak: 0,
      previousBest: 15,
      daysDeclined: 3,
      severity: 'medium',
      lastCompleted: '2024-01-17',
      intervention: {
        type: 'reminder',
        title: 'Hydration Reminder',
        description: 'You used to drink 8 glasses daily for 15 days straight!',
        action: 'Set hourly water reminders'
      }
    },
    {
      id: '2',
      habitName: 'Morning Exercise',
      category: 'exercise',
      currentStreak: 1,
      previousBest: 12,
      daysDeclined: 5,
      severity: 'high',
      lastCompleted: '2024-01-19',
      intervention: {
        type: 'adjustment',
        title: 'Exercise Modification',
        description: 'Consider shorter, 10-minute morning workouts to rebuild consistency.',
        action: 'Start with 10-minute sessions'
      }
    },
    {
      id: '3',
      habitName: 'Meditation Practice',
      category: 'meditation',
      currentStreak: 0,
      previousBest: 8,
      daysDeclined: 7,
      severity: 'critical',
      lastCompleted: '2024-01-13',
      intervention: {
        type: 'support',
        title: 'Meditation Support',
        description: 'Let\'s find what\'s blocking your meditation practice.',
        action: 'Chat with health coach'
      }
    }
  ]);

  const [interventions] = useState<Intervention[]>([
    {
      id: '1',
      title: 'Quick Habit Reset',
      description: 'Start with just 1 minute today to rebuild momentum',
      type: 'quick-win',
      estimatedTime: '1-2 minutes',
      difficulty: 'easy'
    },
    {
      id: '2',
      title: 'Habit Stacking',
      description: 'Attach your struggling habit to an existing strong habit',
      type: 'habit-restart',
      estimatedTime: '5 minutes setup',
      difficulty: 'medium'
    },
    {
      id: '3',
      title: 'Goal Simplification',
      description: 'Reduce the habit requirement to make it more achievable',
      type: 'goal-adjustment',
      estimatedTime: '3 minutes',
      difficulty: 'easy'
    },
    {
      id: '4',
      title: 'Accountability Partner',
      description: 'Connect with someone who shares similar health goals',
      type: 'support-system',
      estimatedTime: '10 minutes',
      difficulty: 'medium'
    }
  ]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'hydration': return '💧';
      case 'exercise': return '💪';
      case 'sleep': return '😴';
      case 'nutrition': return '🥗';
      case 'meditation': return '🧘';
      default: return '⭐';
    }
  };

  const getInterventionIcon = (type: string) => {
    switch (type) {
      case 'quick-win': return '⚡';
      case 'habit-restart': return '🔄';
      case 'goal-adjustment': return '🎯';
      case 'support-system': return '🤝';
      default: return '💡';
    }
  };

  const handleApplyIntervention = (alertId: string, interventionType: string) => {
    toast.success(`${interventionType} intervention applied! You've got this! 💪`);
    
    // Remove the alert or update its status
    setHabitAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const handleSnoozeAlert = (alertId: string) => {
    toast.success('Alert snoozed for 24 hours');
    setHabitAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const criticalAlerts = habitAlerts.filter(alert => alert.severity === 'critical');
  const totalDeclineDays = habitAlerts.reduce((sum, alert) => sum + alert.daysDeclined, 0);

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Habit Decline Detection & Intervention
          </CardTitle>
          <CardDescription>
            AI-powered system to detect habit decline and provide personalized interventions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600">{habitAlerts.length}</div>
              <p className="text-sm text-gray-600">Habits Need Attention</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-3xl font-bold text-red-600">{criticalAlerts.length}</div>
              <p className="text-sm text-gray-600">Critical Alerts</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-3xl font-bold text-yellow-600">{totalDeclineDays}</div>
              <p className="text-sm text-gray-600">Total Decline Days</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {habitAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Active Habit Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {habitAlerts.map((alert) => (
                <div 
                  key={alert.id}
                  className={`p-4 rounded-lg border-2 ${getSeverityColor(alert.severity)}`}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getCategoryIcon(alert.category)}</span>
                        <div>
                          <h4 className="font-bold text-lg">{alert.habitName}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getSeverityColor(alert.severity)}>
                              {alert.severity.toUpperCase()}
                            </Badge>
                            <span className="text-sm text-gray-600">
                              {alert.daysDeclined} days declined
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <TrendingDown className="h-4 w-4" />
                          <span>Best: {alert.previousBest} days</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <Calendar className="h-4 w-4" />
                          <span>Last: {alert.lastCompleted}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/70 p-3 rounded">
                      <h5 className="font-medium mb-2">🎯 Recommended Intervention</h5>
                      <p className="text-sm mb-2">{alert.intervention.description}</p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApplyIntervention(alert.id, alert.intervention.type)}
                        >
                          {alert.intervention.action}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSnoozeAlert(alert.id)}
                        >
                          Snooze 24h
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Recovery Progress</span>
                        <span>{alert.currentStreak}/{Math.ceil(alert.previousBest * 0.5)} days</span>
                      </div>
                      <Progress 
                        value={(alert.currentStreak / Math.ceil(alert.previousBest * 0.5)) * 100} 
                        className="h-2"
                      />
                      <p className="text-xs text-gray-600">
                        Goal: Reach {Math.ceil(alert.previousBest * 0.5)} days to rebuild momentum
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Available Interventions</CardTitle>
          <CardDescription>
            Science-backed strategies to help you get back on track
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {interventions.map((intervention) => (
              <div 
                key={intervention.id}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getInterventionIcon(intervention.type)}</span>
                    <div>
                      <h4 className="font-medium">{intervention.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {intervention.difficulty}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600">{intervention.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      ⏱️ {intervention.estimatedTime}
                    </span>
                    <Button size="sm" variant="outline">
                      Learn More
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
