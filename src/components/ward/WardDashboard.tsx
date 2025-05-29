
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { WardPatientStatus } from './WardPatientStatus';
import { PreDischargeChecklist } from './PreDischargeChecklist';
import { VisitHistoryGenerator } from './VisitHistoryGenerator';
import { MissedVisitAlerts } from './MissedVisitAlerts';
import { ConsentStatusVisualizer } from './ConsentStatusVisualizer';
import { PostDischargeScheduler } from './PostDischargeScheduler';
import { PremiumWardDashboard } from './premium/PremiumWardDashboard';
import { ClinicalWorkflowDashboard } from './clinical/ClinicalWorkflowDashboard';
import { Bed, ClipboardCheck, History, AlertTriangle, FileCheck, Phone, Activity, Crown, Sparkles, Stethoscope } from 'lucide-react';

export const WardDashboard = () => {
  const [activeTab, setActiveTab] = useState('status');
  const [showPremium, setShowPremium] = useState(false);
  const [showClinical, setShowClinical] = useState(false);

  if (showPremium) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => setShowPremium(false)}
            className="mb-4"
          >
            ← Back to Standard Ward
          </Button>
          <Badge className="bg-yellow-500 text-white">
            <Crown className="h-3 w-3 mr-1" />
            Premium Active
          </Badge>
        </div>
        <PremiumWardDashboard />
      </div>
    );
  }

  if (showClinical) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => setShowClinical(false)}
            className="mb-4"
          >
            ← Back to Standard Ward
          </Button>
          <Badge className="bg-blue-500 text-white">
            <Stethoscope className="h-3 w-3 mr-1" />
            Clinical Workflow Active
          </Badge>
        </div>
        <ClinicalWorkflowDashboard />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Ward Management System
        </h1>
        <p className="text-gray-600">
          Comprehensive patient care and workflow management
        </p>
        <div className="flex justify-center gap-3">
          <Button 
            onClick={() => setShowPremium(true)}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white flex items-center gap-2"
          >
            <Crown className="h-4 w-4" />
            Upgrade to Premium Ward
            <Sparkles className="h-4 w-4" />
          </Button>
          <Button 
            onClick={() => setShowClinical(true)}
            className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white flex items-center gap-2"
          >
            <Stethoscope className="h-4 w-4" />
            Clinical Workflow Tools
          </Button>
        </div>
      </div>

      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 text-center">
            <div className="p-4 bg-white/50 rounded-lg">
              <Activity className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <h3 className="font-bold text-purple-800">Live Status</h3>
              <p className="text-sm text-gray-600">Real-time tracking</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <ClipboardCheck className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <h3 className="font-bold text-green-800">Discharge</h3>
              <p className="text-sm text-gray-600">Pre-discharge tasks</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <History className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <h3 className="font-bold text-blue-800">History</h3>
              <p className="text-sm text-gray-600">Visit documentation</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <AlertTriangle className="h-8 w-8 mx-auto text-red-600 mb-2" />
              <h3 className="font-bold text-red-800">Alerts</h3>
              <p className="text-sm text-gray-600">Missed visits</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <FileCheck className="h-8 w-8 mx-auto text-cyan-600 mb-2" />
              <h3 className="font-bold text-cyan-800">Consent</h3>
              <p className="text-sm text-gray-600">Status overview</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Phone className="h-8 w-8 mx-auto text-orange-600 mb-2" />
              <h3 className="font-bold text-orange-800">Callbacks</h3>
              <p className="text-sm text-gray-600">Post-discharge</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="status" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Status</span>
          </TabsTrigger>
          <TabsTrigger value="discharge" className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Discharge</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">History</span>
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">Alerts</span>
          </TabsTrigger>
          <TabsTrigger value="consent" className="flex items-center gap-2">
            <FileCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Consent</span>
          </TabsTrigger>
          <TabsTrigger value="callbacks" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">Callbacks</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="status" className="space-y-6">
          <WardPatientStatus />
        </TabsContent>

        <TabsContent value="discharge" className="space-y-6">
          <PreDischargeChecklist />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <VisitHistoryGenerator />
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <MissedVisitAlerts />
        </TabsContent>

        <TabsContent value="consent" className="space-y-6">
          <ConsentStatusVisualizer />
        </TabsContent>

        <TabsContent value="callbacks" className="space-y-6">
          <PostDischargeScheduler />
        </TabsContent>
      </Tabs>
    </div>
  );
};
