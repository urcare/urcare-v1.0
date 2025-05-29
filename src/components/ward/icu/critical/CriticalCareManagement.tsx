
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { VitalDropNotifier } from './VitalDropNotifier';
import { VisitRestrictionsTracker } from './VisitRestrictionsTracker';
import { EmergencyConsentOverride } from './EmergencyConsentOverride';
import { ICUTransferPredictor } from './ICUTransferPredictor';
import { MissedAlertRepeater } from './MissedAlertRepeater';
import { HighRiskConsentFlow } from './HighRiskConsentFlow';
import { AlertTriangle, Shield, FileCheck, TrendingDown, Bell, Clipboard, Heart, Zap } from 'lucide-react';

export const CriticalCareManagement = () => {
  const [activeTab, setActiveTab] = useState('vitals');

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
          <Heart className="h-8 w-8 text-red-600" />
          Critical Care Management
          <Zap className="h-8 w-8 text-purple-600" />
        </h1>
        <p className="text-gray-600">
          Advanced patient safety, consent management, and critical care workflow automation
        </p>
      </div>

      <Card className="bg-gradient-to-r from-red-50 to-purple-50 border-red-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 text-center">
            <div className="p-4 bg-white/50 rounded-lg">
              <AlertTriangle className="h-8 w-8 mx-auto text-red-600 mb-2" />
              <h3 className="font-bold text-red-800">Vital Drops</h3>
              <p className="text-sm text-gray-600">Auto escalation</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Shield className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <h3 className="font-bold text-blue-800">Visit Control</h3>
              <p className="text-sm text-gray-600">Restrictions tracker</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <FileCheck className="h-8 w-8 mx-auto text-orange-600 mb-2" />
              <h3 className="font-bold text-orange-800">Emergency</h3>
              <p className="text-sm text-gray-600">Consent override</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <TrendingDown className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <h3 className="font-bold text-green-800">Transfer</h3>
              <p className="text-sm text-gray-600">Readiness AI</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Bell className="h-8 w-8 mx-auto text-yellow-600 mb-2" />
              <h3 className="font-bold text-yellow-800">Alerts</h3>
              <p className="text-sm text-gray-600">Missed repeater</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Clipboard className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <h3 className="font-bold text-purple-800">Consent</h3>
              <p className="text-sm text-gray-600">High-risk flow</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="vitals" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">Vitals</span>
          </TabsTrigger>
          <TabsTrigger value="visits" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Visits</span>
          </TabsTrigger>
          <TabsTrigger value="consent" className="flex items-center gap-2">
            <FileCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Override</span>
          </TabsTrigger>
          <TabsTrigger value="transfer" className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4" />
            <span className="hidden sm:inline">Transfer</span>
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Alerts</span>
          </TabsTrigger>
          <TabsTrigger value="procedures" className="flex items-center gap-2">
            <Clipboard className="h-4 w-4" />
            <span className="hidden sm:inline">Procedures</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vitals" className="space-y-6">
          <VitalDropNotifier />
        </TabsContent>

        <TabsContent value="visits" className="space-y-6">
          <VisitRestrictionsTracker />
        </TabsContent>

        <TabsContent value="consent" className="space-y-6">
          <EmergencyConsentOverride />
        </TabsContent>

        <TabsContent value="transfer" className="space-y-6">
          <ICUTransferPredictor />
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <MissedAlertRepeater />
        </TabsContent>

        <TabsContent value="procedures" className="space-y-6">
          <HighRiskConsentFlow />
        </TabsContent>
      </Tabs>
    </div>
  );
};
