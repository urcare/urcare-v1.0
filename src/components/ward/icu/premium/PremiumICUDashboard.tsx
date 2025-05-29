
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SepsisAlertEngine } from './SepsisAlertEngine';
import { IsolationRoomLogic } from './IsolationRoomLogic';
import { VentilatorPumpMonitor } from './VentilatorPumpMonitor';
import { ICUAdmissionPrioritizer } from './ICUAdmissionPrioritizer';
import { EmergencyICUTransfer } from './EmergencyICUTransfer';
import { CrashCartTracker } from './CrashCartTracker';
import { Shield, Wifi, Activity, Users, ArrowRightLeft, Truck, Crown, Sparkles } from 'lucide-react';

export const PremiumICUDashboard = () => {
  const [activeTab, setActiveTab] = useState('sepsis');

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
          <Crown className="h-8 w-8 text-yellow-600" />
          Premium ICU Monitoring
          <Sparkles className="h-8 w-8 text-orange-600" />
        </h1>
        <p className="text-gray-600">
          Advanced AI-powered ICU monitoring with premium features and enterprise-grade alerts
        </p>
      </div>

      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 text-center">
            <div className="p-4 bg-white/50 rounded-lg">
              <Shield className="h-8 w-8 mx-auto text-red-600 mb-2" />
              <h3 className="font-bold text-red-800">Sepsis Engine</h3>
              <p className="text-sm text-gray-600">Early warning AI</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Wifi className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <h3 className="font-bold text-purple-800">Isolation Logic</h3>
              <p className="text-sm text-gray-600">Infection control</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Activity className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <h3 className="font-bold text-blue-800">Equipment</h3>
              <p className="text-sm text-gray-600">Ventilator & pumps</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Users className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <h3 className="font-bold text-green-800">Admission AI</h3>
              <p className="text-sm text-gray-600">Priority scoring</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <ArrowRightLeft className="h-8 w-8 mx-auto text-cyan-600 mb-2" />
              <h3 className="font-bold text-cyan-800">Transfer Sync</h3>
              <p className="text-sm text-gray-600">Emergency to ICU</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Truck className="h-8 w-8 mx-auto text-orange-600 mb-2" />
              <h3 className="font-bold text-orange-800">Crash Cart</h3>
              <p className="text-sm text-gray-600">Equipment tracker</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="sepsis" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Sepsis</span>
          </TabsTrigger>
          <TabsTrigger value="isolation" className="flex items-center gap-2">
            <Wifi className="h-4 w-4" />
            <span className="hidden sm:inline">Isolation</span>
          </TabsTrigger>
          <TabsTrigger value="equipment" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Equipment</span>
          </TabsTrigger>
          <TabsTrigger value="admission" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Admission</span>
          </TabsTrigger>
          <TabsTrigger value="transfer" className="flex items-center gap-2">
            <ArrowRightLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Transfer</span>
          </TabsTrigger>
          <TabsTrigger value="crashcart" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            <span className="hidden sm:inline">Cart</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sepsis" className="space-y-6">
          <SepsisAlertEngine />
        </TabsContent>

        <TabsContent value="isolation" className="space-y-6">
          <IsolationRoomLogic />
        </TabsContent>

        <TabsContent value="equipment" className="space-y-6">
          <VentilatorPumpMonitor />
        </TabsContent>

        <TabsContent value="admission" className="space-y-6">
          <ICUAdmissionPrioritizer />
        </TabsContent>

        <TabsContent value="transfer" className="space-y-6">
          <EmergencyICUTransfer />
        </TabsContent>

        <TabsContent value="crashcart" className="space-y-6">
          <CrashCartTracker />
        </TabsContent>
      </Tabs>
    </div>
  );
};
