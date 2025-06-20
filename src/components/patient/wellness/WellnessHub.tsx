
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Activity, Moon, Droplets, Target, TrendingUp, Plus, Calendar } from 'lucide-react';

export const WellnessHub = () => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Wellness Hub</h1>
        <p className="text-muted-foreground">Track your health metrics, goals, and wellness journey</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button size="lg" className="h-20 flex-col gap-2 bg-red-500 hover:bg-red-600">
          <Heart className="w-6 h-6" />
          Heart Rate
        </Button>
        <Button size="lg" className="h-20 flex-col gap-2 bg-blue-500 hover:bg-blue-600">
          <Activity className="w-6 h-6" />
          Activity
        </Button>
        <Button size="lg" className="h-20 flex-col gap-2 bg-purple-500 hover:bg-purple-600">
          <Moon className="w-6 h-6" />
          Sleep
        </Button>
        <Button size="lg" className="h-20 flex-col gap-2 bg-cyan-500 hover:bg-cyan-600">
          <Droplets className="w-6 h-6" />
          Hydration
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Today's Overview</CardTitle>
            <CardDescription>Your wellness metrics for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-red-50 dark:bg-red-950/30 rounded-lg">
                <Heart className="w-8 h-8 mx-auto text-red-500 mb-2" />
                <div className="text-2xl font-bold text-red-600">72</div>
                <div className="text-sm text-muted-foreground">BPM</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                <Activity className="w-8 h-8 mx-auto text-green-500 mb-2" />
                <div className="text-2xl font-bold text-green-600">8,542</div>
                <div className="text-sm text-muted-foreground">Steps</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                <Moon className="w-8 h-8 mx-auto text-purple-500 mb-2" />
                <div className="text-2xl font-bold text-purple-600">7.5h</div>
                <div className="text-sm text-muted-foreground">Sleep</div>
              </div>
              <div className="text-center p-4 bg-cyan-50 dark:bg-cyan-950/30 rounded-lg">
                <Droplets className="w-8 h-8 mx-auto text-cyan-500 mb-2" />
                <div className="text-2xl font-bold text-cyan-600">6/8</div>
                <div className="text-sm text-muted-foreground">Glasses</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Health Goals</CardTitle>
            <CardDescription>Your wellness targets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-blue-500" />
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Daily Steps</span>
                  <span className="text-sm text-muted-foreground">8,542/10,000</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full w-4/5"></div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-green-500" />
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Water Intake</span>
                  <span className="text-sm text-muted-foreground">6/8 glasses</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full w-3/4"></div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-purple-500" />
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Sleep Goal</span>
                  <span className="text-sm text-muted-foreground">7.5/8 hours</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full w-11/12"></div>
                </div>
              </div>
            </div>

            <Button variant="outline" size="sm" className="w-full mt-4">
              <Plus className="w-4 h-4 mr-2" />
              Add New Goal
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
