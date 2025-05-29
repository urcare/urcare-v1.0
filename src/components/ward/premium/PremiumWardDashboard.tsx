
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WardTransferFlow } from './WardTransferFlow';
import { DischargeReadinessEngine } from './DischargeReadinessEngine';
import { SmartNotesTimeline } from './SmartNotesTimeline';
import { DoctorRiskFlagBoard } from './DoctorRiskFlagBoard';
import { HighRiskAlerts } from './HighRiskAlerts';
import { OPIPRecordMerger } from './OPIPRecordMerger';
import { ArrowRight, TrendingUp, FileText, AlertTriangle, Bell, Merge, Crown } from 'lucide-react';

export const PremiumWardDashboard = () => {
  const [activeTab, setActiveTab] = useState('transfers');

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gold-600 to-purple-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
          <Crown className="h-8 w-8 text-yellow-500" />
          Premium Ward Management System
        </h1>
        <p className="text-gray-600">
          Advanced clinical workflow automation and risk management
        </p>
      </div>

      <Card className="bg-gradient-to-r from-yellow-50 to-purple-50 border-yellow-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 text-center">
            <div className="p-4 bg-white/50 rounded-lg">
              <ArrowRight className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <h3 className="font-bold text-blue-800">Transfers</h3>
              <p className="text-sm text-gray-600">Ward-to-ward flow</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <TrendingUp className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <h3 className="font-bold text-green-800">Readiness</h3>
              <p className="text-sm text-gray-600">Discharge engine</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <FileText className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <h3 className="font-bold text-purple-800">Smart Notes</h3>
              <p className="text-sm text-gray-600">Timeline builder</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <AlertTriangle className="h-8 w-8 mx-auto text-orange-600 mb-2" />
              <h3 className="font-bold text-orange-800">Risk Flags</h3>
              <p className="text-sm text-gray-600">Doctor board</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Bell className="h-8 w-8 mx-auto text-red-600 mb-2" />
              <h3 className="font-bold text-red-800">Alerts</h3>
              <p className="text-sm text-gray-600">Room notifications</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Merge className="h-8 w-8 mx-auto text-indigo-600 mb-2" />
              <h3 className="font-bold text-indigo-800">Records</h3>
              <p className="text-sm text-gray-600">OP/IP merger</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="transfers" className="flex items-center gap-2">
            <ArrowRight className="h-4 w-4" />
            <span className="hidden sm:inline">Transfers</span>
          </TabsTrigger>
          <TabsTrigger value="readiness" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Readiness</span>
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Notes</span>
          </TabsTrigger>
          <TabsTrigger value="risk-flags" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">Risk</span>
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Alerts</span>
          </TabsTrigger>
          <TabsTrigger value="records" className="flex items-center gap-2">
            <Merge className="h-4 w-4" />
            <span className="hidden sm:inline">Records</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transfers" className="space-y-6">
          <WardTransferFlow />
        </TabsContent>

        <TabsContent value="readiness" className="space-y-6">
          <DischargeReadinessEngine />
        </TabsContent>

        <TabsContent value="notes" className="space-y-6">
          <SmartNotesTimeline />
        </TabsContent>

        <TabsContent value="risk-flags" className="space-y-6">
          <DoctorRiskFlagBoard />
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <HighRiskAlerts />
        </TabsContent>

        <TabsContent value="records" className="space-y-6">
          <OPIPRecordMerger />
        </TabsContent>
      </Tabs>
    </div>
  );
};
