
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HealthAchievementBadges } from './HealthAchievementBadges';
import { StreakSystem } from './StreakSystem';
import { WeeklyHealthSummary } from './WeeklyHealthSummary';
import { HabitDeclineNudges } from './HabitDeclineNudges';
import { VirtualHealthCoach } from './VirtualHealthCoach';
import { WeightBMITracker } from './WeightBMITracker';
import { Trophy, Target, BarChart3, AlertTriangle, Brain, Scale } from 'lucide-react';

export const PremiumWellnessDashboard = () => {
  const [activeTab, setActiveTab] = useState('achievements');

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Premium Wellness Suite
        </h1>
        <p className="text-gray-600">
          Advanced health tracking with AI-powered insights and personalized coaching
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            <span className="hidden sm:inline">Achievements</span>
          </TabsTrigger>
          <TabsTrigger value="streaks" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Streaks</span>
          </TabsTrigger>
          <TabsTrigger value="summary" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Summary</span>
          </TabsTrigger>
          <TabsTrigger value="nudges" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">Nudges</span>
          </TabsTrigger>
          <TabsTrigger value="coach" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">Coach</span>
          </TabsTrigger>
          <TabsTrigger value="weight" className="flex items-center gap-2">
            <Scale className="h-4 w-4" />
            <span className="hidden sm:inline">Weight</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="space-y-6">
          <HealthAchievementBadges />
        </TabsContent>

        <TabsContent value="streaks" className="space-y-6">
          <StreakSystem />
        </TabsContent>

        <TabsContent value="summary" className="space-y-6">
          <WeeklyHealthSummary />
        </TabsContent>

        <TabsContent value="nudges" className="space-y-6">
          <HabitDeclineNudges />
        </TabsContent>

        <TabsContent value="coach" className="space-y-6">
          <VirtualHealthCoach />
        </TabsContent>

        <TabsContent value="weight" className="space-y-6">
          <WeightBMITracker />
        </TabsContent>
      </Tabs>
    </div>
  );
};
