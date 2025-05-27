
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AIHabitPlanner } from './AIHabitPlanner';
import { HydrationTracker } from './HydrationTracker';
import { NutritionLogger } from './NutritionLogger';
import { SleepCoach } from './SleepCoach';
import { ActivityMonitor } from './ActivityMonitor';
import { FamilyWellnessChallenges } from './FamilyWellnessChallenges';
import { Brain, Droplets, Apple, Moon, Activity, Users } from 'lucide-react';

export const WellnessDashboard = () => {
  const [activeTab, setActiveTab] = useState('habits');

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Wellness Dashboard</h1>
        <p className="text-gray-600">
          Your comprehensive health and wellness command center
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="habits" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">Habits</span>
          </TabsTrigger>
          <TabsTrigger value="hydration" className="flex items-center gap-2">
            <Droplets className="h-4 w-4" />
            <span className="hidden sm:inline">Hydration</span>
          </TabsTrigger>
          <TabsTrigger value="nutrition" className="flex items-center gap-2">
            <Apple className="h-4 w-4" />
            <span className="hidden sm:inline">Nutrition</span>
          </TabsTrigger>
          <TabsTrigger value="sleep" className="flex items-center gap-2">
            <Moon className="h-4 w-4" />
            <span className="hidden sm:inline">Sleep</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Activity</span>
          </TabsTrigger>
          <TabsTrigger value="family" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Family</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="habits" className="space-y-6">
          <AIHabitPlanner />
        </TabsContent>

        <TabsContent value="hydration" className="space-y-6">
          <HydrationTracker />
        </TabsContent>

        <TabsContent value="nutrition" className="space-y-6">
          <NutritionLogger />
        </TabsContent>

        <TabsContent value="sleep" className="space-y-6">
          <SleepCoach />
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <ActivityMonitor />
        </TabsContent>

        <TabsContent value="family" className="space-y-6">
          <FamilyWellnessChallenges />
        </TabsContent>
      </Tabs>
    </div>
  );
};
