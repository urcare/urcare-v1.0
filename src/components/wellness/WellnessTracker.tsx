
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Activity, Heart, Droplets, Moon, Target, TrendingUp, Award, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { toast } from 'sonner';

interface WellnessMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  icon: any;
  color: string;
  trend: 'up' | 'down' | 'stable';
}

interface ActivityData {
  date: string;
  steps: number;
  calories: number;
  sleep: number;
  water: number;
}

export const WellnessTracker = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [wellnessMetrics, setWellnessMetrics] = useState<WellnessMetric[]>([
    {
      id: '1',
      name: 'Daily Steps',
      value: 8500,
      target: 10000,
      unit: 'steps',
      icon: Activity,
      color: 'blue',
      trend: 'up'
    },
    {
      id: '2',
      name: 'Heart Rate',
      value: 72,
      target: 80,
      unit: 'bpm',
      icon: Heart,
      color: 'red',
      trend: 'stable'
    },
    {
      id: '3',
      name: 'Water Intake',
      value: 6,
      target: 8,
      unit: 'glasses',
      icon: Droplets,
      color: 'cyan',
      trend: 'up'
    },
    {
      id: '4',
      name: 'Sleep',
      value: 7.5,
      target: 8,
      unit: 'hours',
      icon: Moon,
      color: 'purple',
      trend: 'down'
    }
  ]);

  const [activityData] = useState<ActivityData[]>([
    { date: 'Mon', steps: 8200, calories: 320, sleep: 7.2, water: 6 },
    { date: 'Tue', steps: 9100, calories: 380, sleep: 7.8, water: 7 },
    { date: 'Wed', steps: 7800, calories: 295, sleep: 6.9, water: 5 },
    { date: 'Thu', steps: 10200, calories: 420, sleep: 8.1, water: 8 },
    { date: 'Fri', steps: 8900, calories: 365, sleep: 7.5, water: 7 },
    { date: 'Sat', steps: 12000, calories: 480, sleep: 8.3, water: 9 },
    { date: 'Sun', steps: 6500, calories: 250, sleep: 7.0, water: 6 }
  ]);

  const getProgressColor = (value: number, target: number) => {
    const percentage = (value / target) * 100;
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? '↗️' : trend === 'down' ? '↘️' : '➡️';
  };

  const updateMetric = (metricId: string, newValue: number) => {
    setWellnessMetrics(prev => prev.map(metric => 
      metric.id === metricId ? { ...metric, value: newValue } : metric
    ));
    toast.success('Metric updated successfully!');
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-green-600" />
            Wellness Tracker
          </CardTitle>
          <CardDescription>
            Monitor your health metrics and track wellness goals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <Activity className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <h3 className="font-bold text-green-800">Active</h3>
              <p className="text-sm text-gray-600">Daily tracking</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <Target className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <h3 className="font-bold text-blue-800">Goals</h3>
              <p className="text-sm text-gray-600">Personal targets</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <TrendingUp className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <h3 className="font-bold text-purple-800">Insights</h3>
              <p className="text-sm text-gray-600">Data analysis</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <Award className="h-8 w-8 mx-auto text-yellow-600 mb-2" />
              <h3 className="font-bold text-yellow-800">Achievements</h3>
              <p className="text-sm text-gray-600">Goal milestones</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tracking">Daily Tracking</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {wellnessMetrics.map((metric) => {
              const IconComponent = metric.icon;
              const progress = (metric.value / metric.target) * 100;
              
              return (
                <Card key={metric.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <IconComponent className={`h-8 w-8 text-${metric.color}-600`} />
                      <span className="text-2xl">{getTrendIcon(metric.trend)}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-semibold">{metric.name}</h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold">{metric.value}</span>
                        <span className="text-sm text-gray-600">/ {metric.target} {metric.unit}</span>
                      </div>
                      
                      <Progress value={progress} className="h-2" />
                      
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{Math.round(progress)}% of goal</span>
                        <Badge variant={progress >= 100 ? "default" : "outline"}>
                          {progress >= 100 ? "Achieved" : "In Progress"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-4">
          <h3 className="text-lg font-semibold">Log Today's Metrics</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {wellnessMetrics.map((metric) => {
              const IconComponent = metric.icon;
              
              return (
                <Card key={metric.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <IconComponent className={`h-5 w-5 text-${metric.color}-600`} />
                      {metric.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Input
                        type="number"
                        defaultValue={metric.value}
                        onChange={(e) => updateMetric(metric.id, Number(e.target.value))}
                      />
                      <span className="text-sm text-gray-600">{metric.unit}</span>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      Target: {metric.target} {metric.unit}
                    </div>
                    
                    <Button size="sm" className="w-full">
                      Update {metric.name}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <h3 className="text-lg font-semibold">Weekly Trends</h3>
          
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="steps" stroke="#3B82F6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sleep & Water Intake</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sleep" fill="#8B5CF6" />
                    <Bar dataKey="water" fill="#06B6D4" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <h3 className="text-lg font-semibold">Wellness Goals</h3>
          
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Goals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Complete 5 workouts</h4>
                    <p className="text-sm text-gray-600">4/5 completed</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">80%</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Drink 8 glasses daily</h4>
                    <p className="text-sm text-gray-600">6/7 days achieved</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">86%</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Sleep 8 hours nightly</h4>
                    <p className="text-sm text-gray-600">3/7 nights achieved</p>
                  </div>
                  <Badge className="bg-purple-100 text-purple-800">43%</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Achievement Badges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <Award className="h-8 w-8 mx-auto text-yellow-600 mb-2" />
                    <p className="text-xs font-medium">Step Master</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <Droplets className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                    <p className="text-xs font-medium">Hydration Hero</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <Activity className="h-8 w-8 mx-auto text-green-600 mb-2" />
                    <p className="text-xs font-medium">Fitness Streak</p>
                  </div>
                  <div className="text-center p-3 bg-gray-100 rounded-lg opacity-50">
                    <Moon className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-xs font-medium">Sleep Champion</p>
                  </div>
                  <div className="text-center p-3 bg-gray-100 rounded-lg opacity-50">
                    <Heart className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-xs font-medium">Heart Health</p>
                  </div>
                  <div className="text-center p-3 bg-gray-100 rounded-lg opacity-50">
                    <Calendar className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-xs font-medium">Consistency</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
