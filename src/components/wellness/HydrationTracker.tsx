
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Droplets, Plus, Minus, Target } from 'lucide-react';
import { toast } from 'sonner';

export const HydrationTracker = () => {
  const [currentIntake, setCurrentIntake] = useState(5); // glasses consumed
  const [dailyGoal, setDailyGoal] = useState(8); // glasses target
  const [glassSize, setGlassSize] = useState(250); // ml per glass

  const addWater = (amount: number) => {
    const newIntake = Math.max(0, currentIntake + amount);
    setCurrentIntake(newIntake);
    
    if (amount > 0) {
      toast.success(`Added ${amount} glass${amount !== 1 ? 'es' : ''} of water! 💧`);
      
      if (newIntake >= dailyGoal) {
        toast.success('🎉 Daily hydration goal achieved!');
      }
    }
  };

  const progressPercentage = (currentIntake / dailyGoal) * 100;
  const remainingGlasses = Math.max(0, dailyGoal - currentIntake);
  const totalMl = currentIntake * glassSize;
  const targetMl = dailyGoal * glassSize;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-blue-500" />
            Hydration Tracker
          </CardTitle>
          <CardDescription>
            Track your daily water intake and stay hydrated
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-blue-600">
                {currentIntake}/{dailyGoal}
              </div>
              <p className="text-gray-600">glasses today</p>
              <p className="text-sm text-gray-500">
                {totalMl}ml / {targetMl}ml ({glassSize}ml per glass)
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
            </div>

            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => addWater(-1)}
                disabled={currentIntake <= 0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              
              <Button
                onClick={() => addWater(1)}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Glass
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => addWater(1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {remainingGlasses > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <Target className="h-5 w-5 text-blue-600 mx-auto mb-2" />
                <p className="text-blue-800 font-medium">
                  {remainingGlasses} more glass{remainingGlasses !== 1 ? 'es' : ''} to reach your goal!
                </p>
              </div>
            )}

            {currentIntake >= dailyGoal && (
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-green-800 font-medium">
                  🎉 Goal achieved! Great hydration today!
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => addWater(2)}
              className="h-20 flex flex-col gap-1"
            >
              <Droplets className="h-6 w-6 text-blue-500" />
              <span className="text-sm">Large Bottle</span>
              <span className="text-xs text-gray-500">2 glasses</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => addWater(0.5)}
              className="h-20 flex flex-col gap-1"
            >
              <Droplets className="h-4 w-4 text-blue-500" />
              <span className="text-sm">Small Cup</span>
              <span className="text-xs text-gray-500">0.5 glass</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hydration Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800">Morning Boost</h4>
              <p className="text-sm text-blue-600">Start your day with 1-2 glasses of water to kickstart hydration</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800">Exercise Extra</h4>
              <p className="text-sm text-green-600">Add 2-3 extra glasses on workout days</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <h4 className="font-medium text-orange-800">Set Reminders</h4>
              <p className="text-sm text-orange-600">Use hourly reminders to maintain consistent intake</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
