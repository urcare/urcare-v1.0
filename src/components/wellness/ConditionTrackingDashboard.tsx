
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SugarLogTracker } from './condition-trackers/SugarLogTracker';
import { BestWeekRecap } from './condition-trackers/BestWeekRecap';
import { HabitSwapLogic } from './condition-trackers/HabitSwapLogic';
import { BloodPressureTracker } from './condition-trackers/BloodPressureTracker';
import { SymptomSeverityTracker } from './condition-trackers/SymptomSeverityTracker';
import { MedicationEffectivenessTracker } from './condition-trackers/MedicationEffectivenessTracker';
import { Droplets, Trophy, RefreshCw, Heart, Activity, Pill } from 'lucide-react';

export const ConditionTrackingDashboard = () => {
  const [activeTab, setActiveTab] = useState('sugar');

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Condition-Specific Health Trackers
        </h1>
        <p className="text-gray-600">
          Specialized monitoring tools for managing specific health conditions and symptoms
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="sugar" className="flex items-center gap-2">
            <Droplets className="h-4 w-4" />
            <span className="hidden sm:inline">Sugar Log</span>
          </TabsTrigger>
          <TabsTrigger value="recap" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            <span className="hidden sm:inline">Best Week</span>
          </TabsTrigger>
          <TabsTrigger value="swap" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Habit Swap</span>
          </TabsTrigger>
          <TabsTrigger value="bp" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Blood Pressure</span>
          </TabsTrigger>
          <TabsTrigger value="symptoms" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Symptoms</span>
          </TabsTrigger>
          <TabsTrigger value="medication" className="flex items-center gap-2">
            <Pill className="h-4 w-4" />
            <span className="hidden sm:inline">Medication</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sugar" className="space-y-6">
          <SugarLogTracker />
        </TabsContent>

        <TabsContent value="recap" className="space-y-6">
          <BestWeekRecap />
        </TabsContent>

        <TabsContent value="swap" className="space-y-6">
          <HabitSwapLogic />
        </TabsContent>

        <TabsContent value="bp" className="space-y-6">
          <BloodPressureTracker />
        </TabsContent>

        <TabsContent value="symptoms" className="space-y-6">
          <SymptomSeverityTracker />
        </TabsContent>

        <TabsContent value="medication" className="space-y-6">
          <MedicationEffectivenessTracker />
        </TabsContent>
      </Tabs>
    </div>
  );
};
