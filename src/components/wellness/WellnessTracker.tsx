
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Heart, Activity, Droplets, Moon, Target, TrendingUp, Award, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface HealthMetric {
  id: string;
  type: 'steps' | 'water' | 'sleep' | 'weight' | 'blood-pressure' | 'heart-rate';
  value: number;
  unit: string;
  timestamp: Date;
  goal?: number;
}

interface Habit {
  id: string;
  name: string;
  category: string;
  streak: number;
  target: number;
  completedToday: boolean;
  icon: string;
}

export const WellnessTracker = () => {
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([
    {
      id: '1',
      type: 'steps',
      value: 8542,
      unit: 'steps',
      timestamp: new Date(),
      goal: 10000
    },
    {
      id: '2',
      type: 'water',
      value: 6,
      unit: 'glasses',
      timestamp: new Date(),
      goal: 8
    },
    {
      id: '3',
      type: 'sleep',
      value: 7.5,
      unit: 'hours',
      timestamp: new Date(),
      goal: 8
    },
    {
      id: '4',
      type: 'weight',
      value: 75.2,
      unit: 'kg',
      timestamp: new Date(),
      goal: 70
    }
  ]);

  const [habits, setHabits] = useState<Habit[]>([
    {
      id: '1',
      name: 'Morning Meditation',
      category: 'Mental Health',
      streak: 12,
      target: 1,
      completedToday: true,
      icon: '🧘‍♂️'
    },
    {
      id: '2',
      name: 'Daily Vitamin',
      category: 'Nutrition',
      streak: 28,
      target: 1,
      completedToday: false,
      icon: '💊'
    },
    {
      id: '3',
      name: 'Exercise',
      category: 'Fitness',
      streak: 5,
      target: 1,
      completedToday: true,
      icon: '🏃‍♂️'
    }
  ]);

  const [newMetricValue, setNewMetricValue] = useState('');
  const [selectedMetricType, setSelectedMetricType] = useState<HealthMetric['type']>('steps');

  const handleAddMetric = () => {
    if (!newMetricValue) return;

    const metricConfig = {
      steps: { unit: 'steps', goal: 10000 },
      water: { unit: 'glasses', goal: 8 },
      sleep: { unit: 'hours', goal: 8 },
      weight: { unit: 'kg', goal: 70 },
      'blood-pressure': { unit: 'mmHg', goal: 120 },
      'heart-rate': { unit: 'bpm', goal: 70 }
    };

    const newMetric: HealthMetric = {
      id: Date.now().toString(),
      type: selectedMetricType,
      value: parseFloat(newMetricValue),
      unit: metricConfig[selectedMetricType].unit,
      timestamp: new Date(),
      goal: metricConfig[selectedMetricType].goal
    };

    setHealthMetrics(prev => [newMetric, ...prev.filter(m => m.type !== selectedMetricType)]);
    setNewMetricValue('');
    toast.success('Health metric recorded');
  };

  const handleCompleteHabit = (habitId: string) => {
    setHabits(prev => prev.map(habit => 
      habit.id === habitId 
        ? { 
            ...habit, 
            completedToday: true, 
            streak: habit.completedToday ? habit.streak : habit.streak + 1 
          }
        : habit
    ));
    toast.success('Habit completed! 🎉');
  };

  const calculateHealthScore = () => {
    const scores = healthMetrics.map(metric => {
      if (!metric.goal) return 100;
      const percentage = (metric.value / metric.goal) * 100;
      return Math.min(100, percentage);
    });
    return Math.round(scores.reduce((acc, score) => acc + score, 0) / scores.length);
  };

  const getMetricIcon = (type: string) => {
    switch (type) {
      case 'steps': return <Activity className="h-4 w-4" />;
      case 'water': return <Droplets className="h-4 w-4" />;
      case 'sleep': return <Moon className="h-4 w-4" />;
      case 'weight': return <Target className="h-4 w-4" />;
      case 'heart-rate': return <Heart className="h-4 w-4" />;
      default: return <TrendingUp className="h-4 w-4" />;
    }
  };

  const getMetricColor = (type: string) => {
    switch (type) {
      case 'steps': return 'text-blue-600';
      case 'water': return 'text-cyan-600';
      case 'sleep': return 'text-purple-600';
      case 'weight': return 'text-green-600';
      case 'heart-rate': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const healthScore = calculateHealthScore();

  return (
    <div className="space-y-6">
      {/* Health Score Overview */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="w-32 h-32 mx-auto">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="2"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2"
                    strokeDasharray={`${healthScore}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{healthScore}</div>
                    <div className="text-sm text-gray-600">Health Score</div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Today's Wellness Summary</h2>
              <p className="text-gray-600">Keep up the great work!</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="metrics" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="habits">Habits</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4">
          {/* Quick Log */}
          <Card>
            <CardHeader>
              <CardTitle>Log Health Metric</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <select 
                  className="border rounded px-3 py-2"
                  value={selectedMetricType}
                  onChange={(e) => setSelectedMetricType(e.target.value as HealthMetric['type'])}
                >
                  <option value="steps">Steps</option>
                  <option value="water">Water (glasses)</option>
                  <option value="sleep">Sleep (hours)</option>
                  <option value="weight">Weight (kg)</option>
                  <option value="blood-pressure">Blood Pressure</option>
                  <option value="heart-rate">Heart Rate</option>
                </select>
                <Input
                  type="number"
                  placeholder="Value"
                  value={newMetricValue}
                  onChange={(e) => setNewMetricValue(e.target.value)}
                />
                <Button onClick={handleAddMetric}>
                  <Plus className="h-4 w-4 mr-2" />
                  Log
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Current Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {healthMetrics.map((metric) => (
              <Card key={metric.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-lg bg-gray-100 ${getMetricColor(metric.type)}`}>
                      {getMetricIcon(metric.type)}
                    </div>
                    <Badge variant="outline">Today</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold">
                      {metric.value.toLocaleString()} {metric.unit}
                    </div>
                    <div className="text-sm text-gray-600 capitalize">
                      {metric.type.replace('-', ' ')}
                    </div>
                    {metric.goal && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Goal: {metric.goal} {metric.unit}</span>
                          <span>{Math.round((metric.value / metric.goal) * 100)}%</span>
                        </div>
                        <Progress value={(metric.value / metric.goal) * 100} className="h-1" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="habits" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Daily Habits</h3>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Habit
            </Button>
          </div>

          <div className="space-y-3">
            {habits.map((habit) => (
              <Card key={habit.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{habit.icon}</div>
                      <div>
                        <h4 className="font-semibold">{habit.name}</h4>
                        <p className="text-sm text-gray-600">{habit.category}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Award className="h-4 w-4 text-yellow-600" />
                          <span className="text-sm font-medium">{habit.streak} day streak</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {habit.completedToday ? (
                        <Badge className="bg-green-100 text-green-800">
                          ✓ Done Today
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleCompleteHabit(habit.id)}
                        >
                          Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Health Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Weekly Goals</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span>Exercise 5 times</span>
                      <Progress value={60} className="mt-1" />
                      <span className="text-xs text-gray-500">3/5 completed</span>
                    </div>
                    <div>
                      <span>Sleep 8h daily</span>
                      <Progress value={85} className="mt-1" />
                      <span className="text-xs text-gray-500">6/7 days</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Monthly Goals</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Lose 2kg</span>
                      <span className="text-green-600">On track</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Meditate 20 days</span>
                      <span className="text-green-600">Ahead of schedule</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Health Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">💡 Insight</h4>
                  <p className="text-blue-800 text-sm">
                    Your sleep quality has improved by 15% this week. Keep maintaining your bedtime routine!
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">🎯 Achievement</h4>
                  <p className="text-green-800 text-sm">
                    Congratulations! You've maintained your meditation streak for 12 days.
                  </p>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Suggestion</h4>
                  <p className="text-yellow-800 text-sm">
                    Consider increasing your water intake. You're averaging 6 glasses vs. your goal of 8.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
