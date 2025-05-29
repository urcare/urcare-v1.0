
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ICULengthOfStayEstimator } from './ICULengthOfStayEstimator';
import { DeviceSyncAlerts } from './DeviceSyncAlerts';
import { RapidDeteriorationTimer } from './RapidDeteriorationTimer';
import { StaffRatioAlerts } from './StaffRatioAlerts';
import { ICUCapacityPlanning } from './ICUCapacityPlanning';
import { FamilyCommunicationInterface } from './FamilyCommunicationInterface';
import { BarChart3, Wifi, Timer, Users, PieChart, MessageCircle, TrendingUp, Brain } from 'lucide-react';

export const ICUAnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState('length-of-stay');

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
          <Brain className="h-8 w-8 text-blue-600" />
          ICU Analytics & Prediction
          <TrendingUp className="h-8 w-8 text-purple-600" />
        </h1>
        <p className="text-gray-600">
          Advanced AI-powered analytics for ICU management, prediction, and optimization
        </p>
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 text-center">
            <div className="p-4 bg-white/50 rounded-lg">
              <BarChart3 className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <h3 className="font-bold text-blue-800">Stay Estimator</h3>
              <p className="text-sm text-gray-600">AI predictions</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Wifi className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <h3 className="font-bold text-green-800">Device Sync</h3>
              <p className="text-sm text-gray-600">Real-time alerts</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Timer className="h-8 w-8 mx-auto text-red-600 mb-2" />
              <h3 className="font-bold text-red-800">Deterioration</h3>
              <p className="text-sm text-gray-600">Early intervention</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Users className="h-8 w-8 mx-auto text-orange-600 mb-2" />
              <h3 className="font-bold text-orange-800">Staff Ratios</h3>
              <p className="text-sm text-gray-600">Safety alerts</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <PieChart className="h-8 w-8 mx-auto text-cyan-600 mb-2" />
              <h3 className="font-bold text-cyan-800">Capacity</h3>
              <p className="text-sm text-gray-600">Planning dashboard</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <MessageCircle className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <h3 className="font-bold text-purple-800">Family Comm</h3>
              <p className="text-sm text-gray-600">ICU interface</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="length-of-stay" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Stay</span>
          </TabsTrigger>
          <TabsTrigger value="device-sync" className="flex items-center gap-2">
            <Wifi className="h-4 w-4" />
            <span className="hidden sm:inline">Devices</span>
          </TabsTrigger>
          <TabsTrigger value="deterioration" className="flex items-center gap-2">
            <Timer className="h-4 w-4" />
            <span className="hidden sm:inline">Timer</span>
          </TabsTrigger>
          <TabsTrigger value="staff-ratios" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Staff</span>
          </TabsTrigger>
          <TabsTrigger value="capacity" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            <span className="hidden sm:inline">Capacity</span>
          </TabsTrigger>
          <TabsTrigger value="family" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Family</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="length-of-stay" className="space-y-6">
          <ICULengthOfStayEstimator />
        </TabsContent>

        <TabsContent value="device-sync" className="space-y-6">
          <DeviceSyncAlerts />
        </TabsContent>

        <TabsContent value="deterioration" className="space-y-6">
          <RapidDeteriorationTimer />
        </TabsContent>

        <TabsContent value="staff-ratios" className="space-y-6">
          <StaffRatioAlerts />
        </TabsContent>

        <TabsContent value="capacity" className="space-y-6">
          <ICUCapacityPlanning />
        </TabsContent>

        <TabsContent value="family" className="space-y-6">
          <FamilyCommunicationInterface />
        </TabsContent>
      </Tabs>
    </div>
  );
};
