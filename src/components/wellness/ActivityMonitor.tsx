
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Activity, Target, Footprints, Clock, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface ActivityData {
  steps: number;
  calories: number;
  activeMinutes: number;
  distance: number; // in km
}

interface ActivityGoals {
  steps: number;
  calories: number;
  activeMinutes: number;
  distance: number;
}

export const ActivityMonitor = () => {
  const [todayActivity, setTodayActivity] = useState<ActivityData>({
    steps: 7850,
    calories: 420,
    activeMinutes: 45,
    distance: 5.2
  });

  const [goals, setGoals] = useState<ActivityGoals>({
    steps: 10000,
    calories: 500,
    activeMinutes: 60,
    distance: 8
  });

  const [weeklyData, setWeeklyData] = useState([
    { day: 'Mon', steps: 8500, calories: 380 },
    { day: 'Tue', steps: 9200, calories: 420 },
    { day: 'Wed', steps: 7800, calories: 350 },
    { day: 'Thu', steps: 10500, calories: 480 },
    { day: 'Fri', steps: 6200, calories: 280 },
    { day: 'Sat', steps: 12000, calories: 550 },
    { day: 'Sun', steps: 7850, calories: 420 }
  ]);

  const addActivity = (type: 'walk' | 'run' | 'workout') => {
    const activityBonus = {
      walk: { steps: 1000, calories: 50, activeMinutes: 10, distance: 0.8 },
      run: { steps: 2000, calories: 150, activeMinutes: 20, distance: 2.0 },
      workout: { steps: 500, calories: 200, activeMinutes: 30, distance: 0.3 }
    };

    const bonus = activityBonus[type];
    setTodayActivity(prev => ({
      steps: prev.steps + bonus.steps,
      calories: prev.calories + bonus.calories,
      activeMinutes: prev.activeMinutes + bonus.activeMinutes,
      distance: prev.distance + bonus.distance
    }));

    toast.success(`Great ${type}! Activity logged successfully! 🏃‍♀️`);
  };

  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const getAchievementBadges = () => {
    const badges = [];
    if (todayActivity.steps >= goals.steps) badges.push('🚶 Step Master');
    if (todayActivity.calories >= goals.calories) badges.push('🔥 Calorie Crusher');
    if (todayActivity.activeMinutes >= goals.activeMinutes) badges.push('⏰ Active Achiever');
    if (todayActivity.distance >= goals.distance) badges.push('🎯 Distance Destroyer');
    return badges;
  };

  const weeklyAverage = {
    steps: Math.round(weeklyData.reduce((sum, day) => sum + day.steps, 0) / weeklyData.length),
    calories: Math.round(weeklyData.reduce((sum, day) => sum + day.calories, 0) / weeklyData.length)
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-orange-500" />
            Activity Monitor
          </CardTitle>
          <CardDescription>
            Track your daily movement and stay active with real-time progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Footprints className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-800">{todayActivity.steps.toLocaleString()}</div>
              <div className="text-sm text-blue-600">Steps</div>
              <Progress value={getProgressPercentage(todayActivity.steps, goals.steps)} className="mt-2 h-1" />
            </div>
            
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <Target className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-800">{todayActivity.calories}</div>
              <div className="text-sm text-red-600">Calories</div>
              <Progress value={getProgressPercentage(todayActivity.calories, goals.calories)} className="mt-2 h-1" />
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-800">{todayActivity.activeMinutes}</div>
              <div className="text-sm text-green-600">Active Minutes</div>
              <Progress value={getProgressPercentage(todayActivity.activeMinutes, goals.activeMinutes)} className="mt-2 h-1" />
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-800">{todayActivity.distance.toFixed(1)}km</div>
              <div className="text-sm text-purple-600">Distance</div>
              <Progress value={getProgressPercentage(todayActivity.distance, goals.distance)} className="mt-2 h-1" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Activity Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            <Button
              onClick={() => addActivity('walk')}
              className="h-20 flex flex-col gap-1 bg-blue-600 hover:bg-blue-700"
            >
              <Footprints className="h-6 w-6" />
              <span className="text-sm">Walk</span>
              <span className="text-xs opacity-80">10 min</span>
            </Button>
            
            <Button
              onClick={() => addActivity('run')}
              className="h-20 flex flex-col gap-1 bg-green-600 hover:bg-green-700"
            >
              <Activity className="h-6 w-6" />
              <span className="text-sm">Run</span>
              <span className="text-xs opacity-80">20 min</span>
            </Button>
            
            <Button
              onClick={() => addActivity('workout')}
              className="h-20 flex flex-col gap-1 bg-purple-600 hover:bg-purple-700"
            >
              <Target className="h-6 w-6" />
              <span className="text-sm">Workout</span>
              <span className="text-xs opacity-80">30 min</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {getAchievementBadges().length > 0 && (
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-yellow-800">🎉 Today's Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {getAchievementBadges().map((badge, index) => (
                <Badge key={index} className="bg-yellow-100 text-yellow-800">
                  {badge}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Weekly Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-800">{weeklyAverage.steps.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Avg Steps/Day</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-800">{weeklyAverage.calories}</div>
                <div className="text-sm text-gray-600">Avg Calories/Day</div>
              </div>
            </div>
            
            <div className="space-y-2">
              {weeklyData.map((day, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="font-medium">{day.day}</span>
                  <div className="flex items-center gap-4 text-sm">
                    <span>{day.steps.toLocaleString()} steps</span>
                    <span>{day.calories} cal</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activity Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800">Start Small</h4>
              <p className="text-sm text-blue-600">Take the stairs, park further away, or have walking meetings</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800">Stay Consistent</h4>
              <p className="text-sm text-green-600">Aim for at least 150 minutes of moderate activity per week</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <h4 className="font-medium text-orange-800">Mix It Up</h4>
              <p className="text-sm text-orange-600">Combine cardio, strength training, and flexibility exercises</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
