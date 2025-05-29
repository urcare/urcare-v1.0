
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AIHabitPlanner } from './AIHabitPlanner';
import { HydrationTracker } from './HydrationTracker';
import { NutritionLogger } from './NutritionLogger';
import { SleepCoach } from './SleepCoach';
import { ActivityMonitor } from './ActivityMonitor';
import { FamilyWellnessChallenges } from './FamilyWellnessChallenges';
import { PremiumWellnessDashboard } from './PremiumWellnessDashboard';
import { ConditionTrackingDashboard } from './ConditionTrackingDashboard';
import { Brain, Droplets, Apple, Moon, Activity, Users, Crown, Stethoscope } from 'lucide-react';

export const WellnessDashboard = () => {
  const [activeTab, setActiveTab] = useState('habits');
  const [isPremium, setIsPremium] = useState(false);

  if (isPremium) {
    return <PremiumWellnessDashboard />;
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Wellness Dashboard</h1>
        <p className="text-gray-600">
          Your comprehensive health and wellness command center
        </p>
      </div>

      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Crown className="h-5 w-5 text-purple-600" />
                Unlock Premium Wellness Features
              </h3>
              <p className="text-gray-600">
                Get achievement badges, streak tracking, AI coaching, and advanced analytics
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Health achievement badges with social sharing</li>
                <li>• Streak system with milestone rewards</li>
                <li>• Weekly health summaries with AI insights</li>
                <li>• Smart nudges for habit decline intervention</li>
                <li>• Virtual health coach chat interface</li>
                <li>• Weight & BMI tracker with trending graphs</li>
              </ul>
            </div>
            <Button 
              onClick={() => setIsPremium(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to Premium
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-7 w-full">
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
          <TabsTrigger value="conditions" className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />
            <span className="hidden sm:inline">Conditions</span>
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

        <TabsContent value="conditions" className="space-y-6">
          <ConditionTrackingDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};
