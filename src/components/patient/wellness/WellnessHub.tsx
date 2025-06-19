
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Activity, Target, Brain, TrendingUp, Award } from 'lucide-react';

export const WellnessHub = () => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Wellness Hub</h1>
        <p className="text-muted-foreground">Track your health, build habits, and achieve wellness goals</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <Heart className="w-8 h-8 mx-auto text-destructive mb-2" />
            <CardTitle className="text-lg">Vitals</CardTitle>
            <CardDescription>Track vital signs</CardDescription>
          </CardHeader>
        </Card>

        <Card className="text-center cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <Activity className="w-8 h-8 mx-auto text-success mb-2" />
            <CardTitle className="text-lg">Activity</CardTitle>
            <CardDescription>Exercise & movement</CardDescription>
          </CardHeader>
        </Card>

        <Card className="text-center cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <Brain className="w-8 h-8 mx-auto text-primary mb-2" />
            <CardTitle className="text-lg">Mental</CardTitle>
            <CardDescription>Mood & mindfulness</CardDescription>
          </CardHeader>
        </Card>

        <Card className="text-center cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <Target className="w-8 h-8 mx-auto text-warning mb-2" />
            <CardTitle className="text-lg">Goals</CardTitle>
            <CardDescription>Health objectives</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-success" />
              Health Progress
            </CardTitle>
            <CardDescription>Your wellness journey overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Daily Steps Goal</span>
                <span className="text-sm text-muted-foreground">8,247 / 10,000</span>
              </div>
              <div className="w-full bg-background-secondary rounded-full h-3">
                <div className="bg-success h-3 rounded-full w-[82%]"></div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Weekly Exercise Goal</span>
                <span className="text-sm text-muted-foreground">4 / 5 sessions</span>
              </div>
              <div className="w-full bg-background-secondary rounded-full h-3">
                <div className="bg-primary h-3 rounded-full w-[80%]"></div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Sleep Quality</span>
                <span className="text-sm text-muted-foreground">7.5 hrs avg</span>
              </div>
              <div className="w-full bg-background-secondary rounded-full h-3">
                <div className="bg-secondary h-3 rounded-full w-[94%]"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-warning" />
              Achievements
            </CardTitle>
            <CardDescription>Your health milestones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg">
              <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-success">7-Day Streak</p>
                <p className="text-xs text-muted-foreground">Daily meditation completed</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-primary">Goal Achieved</p>
                <p className="text-xs text-muted-foreground">Monthly step target reached</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-secondary/10 rounded-lg">
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-secondary">Health Improved</p>
                <p className="text-xs text-muted-foreground">Resting heart rate decreased</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI Health Coach Recommendations</CardTitle>
          <CardDescription>Personalized suggestions for better health</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-primary/10 rounded-lg">
              <h3 className="font-semibold text-primary mb-2">Hydration Reminder</h3>
              <p className="text-sm text-muted-foreground mb-3">You're 2 glasses behind your daily water goal</p>
              <Button size="sm" variant="outline">Track Water</Button>
            </div>

            <div className="p-4 bg-success/10 rounded-lg">
              <h3 className="font-semibold text-success mb-2">Movement Break</h3>
              <p className="text-sm text-muted-foreground mb-3">Take a 5-minute walk to boost your energy</p>
              <Button size="sm" variant="outline">Start Timer</Button>
            </div>

            <div className="p-4 bg-secondary/10 rounded-lg">
              <h3 className="font-semibold text-secondary mb-2">Sleep Optimization</h3>
              <p className="text-sm text-muted-foreground mb-3">Wind down routine starts in 30 minutes</p>
              <Button size="sm" variant="outline">Set Reminder</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
