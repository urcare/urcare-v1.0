
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ComplicationNotesLayer } from './ComplicationNotesLayer';
import { OTConsentStatusReview } from './OTConsentStatusReview';
import { SurgeonNurseFeedbackFlow } from './SurgeonNurseFeedbackFlow';
import { EquipmentMaintenanceTracker } from './EquipmentMaintenanceTracker';
import { OTInfectionControlMonitoring } from './OTInfectionControlMonitoring';
import { SurgicalOutcomeTracking } from './SurgicalOutcomeTracking';
import { AlertTriangle, Shield, MessageSquare, Wrench, Droplets, TrendingUp } from 'lucide-react';

export const OTSafetyQualityDashboard = () => {
  const [activeTab, setActiveTab] = useState('complications');

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
          <Shield className="h-8 w-8 text-red-600" />
          OT Safety & Quality Management
          <AlertTriangle className="h-8 w-8 text-orange-600" />
        </h1>
        <p className="text-gray-600">
          Comprehensive safety monitoring, quality assurance, and outcome tracking
        </p>
      </div>

      <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 text-center">
            <div className="p-4 bg-white/50 rounded-lg">
              <AlertTriangle className="h-8 w-8 mx-auto text-red-600 mb-2" />
              <h3 className="font-bold text-red-800">Complications</h3>
              <p className="text-sm text-gray-600">Notes & tracking</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Shield className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <h3 className="font-bold text-blue-800">Consent</h3>
              <p className="text-sm text-gray-600">Status review</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <MessageSquare className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <h3 className="font-bold text-green-800">Feedback</h3>
              <p className="text-sm text-gray-600">Staff input</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Wrench className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <h3 className="font-bold text-purple-800">Equipment</h3>
              <p className="text-sm text-gray-600">Maintenance</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Droplets className="h-8 w-8 mx-auto text-cyan-600 mb-2" />
              <h3 className="font-bold text-cyan-800">Infection</h3>
              <p className="text-sm text-gray-600">Control monitor</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <TrendingUp className="h-8 w-8 mx-auto text-orange-600 mb-2" />
              <h3 className="font-bold text-orange-800">Outcomes</h3>
              <p className="text-sm text-gray-600">Tracking</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="complications" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">Complications</span>
          </TabsTrigger>
          <TabsTrigger value="consent" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Consent</span>
          </TabsTrigger>
          <TabsTrigger value="feedback" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Feedback</span>
          </TabsTrigger>
          <TabsTrigger value="equipment" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            <span className="hidden sm:inline">Equipment</span>
          </TabsTrigger>
          <TabsTrigger value="infection" className="flex items-center gap-2">
            <Droplets className="h-4 w-4" />
            <span className="hidden sm:inline">Infection</span>
          </TabsTrigger>
          <TabsTrigger value="outcomes" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Outcomes</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="complications" className="space-y-6">
          <ComplicationNotesLayer />
        </TabsContent>

        <TabsContent value="consent" className="space-y-6">
          <OTConsentStatusReview />
        </TabsContent>

        <TabsContent value="feedback" className="space-y-6">
          <SurgeonNurseFeedbackFlow />
        </TabsContent>

        <TabsContent value="equipment" className="space-y-6">
          <EquipmentMaintenanceTracker />
        </TabsContent>

        <TabsContent value="infection" className="space-y-6">
          <OTInfectionControlMonitoring />
        </TabsContent>

        <TabsContent value="outcomes" className="space-y-6">
          <SurgicalOutcomeTracking />
        </TabsContent>
      </Tabs>
    </div>
  );
};
