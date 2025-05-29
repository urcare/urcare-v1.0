
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WardPatientStatus } from './WardPatientStatus';
import { PreDischargeChecklist } from './PreDischargeChecklist';
import { PostDischargeScheduler } from './PostDischargeScheduler';
import { VisitHistoryGenerator } from './VisitHistoryGenerator';
import { ConsentStatusVisualizer } from './ConsentStatusVisualizer';
import { MissedVisitAlerts } from './MissedVisitAlerts';
import { ICUDashboard } from './icu/ICUDashboard';
import { ClinicalWorkflowDashboard } from './clinical/ClinicalWorkflowDashboard';
import { PremiumWardDashboard } from './premium/PremiumWardDashboard';
import { OTDashboard } from './ot/OTDashboard';
import { Users, ClipboardCheck, Calendar, FileText, Eye, AlertTriangle, Heart, Stethoscope, Crown, Activity } from 'lucide-react';

export const WardDashboard = () => {
  const [activeTab, setActiveTab] = useState('patients');
  const [showICU, setShowICU] = useState(false);
  const [showClinical, setShowClinical] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  const [showOT, setShowOT] = useState(false);

  if (showOT) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => setShowOT(false)}
            className="mb-4"
          >
            ← Back to Ward Dashboard
          </Button>
          <Badge className="bg-green-500 text-white">
            <Activity className="h-3 w-3 mr-1" />
            OT Management Active
          </Badge>
        </div>
        <OTDashboard />
      </div>
    );
  }

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
            Premium Ward Active
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

  if (showICU) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => setShowICU(false)}
            className="mb-4"
          >
            ← Back to Standard Ward
          </Button>
          <Badge className="bg-red-500 text-white">
            <Heart className="h-3 w-3 mr-1" />
            ICU Active
          </Badge>
        </div>
        <ICUDashboard />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
          Ward Management Dashboard
        </h1>
        <p className="text-gray-600">
          Comprehensive patient tracking, discharge planning, and ward operations
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          <Button 
            onClick={() => setShowICU(true)}
            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
          >
            <Heart className="h-4 w-4 mr-2" />
            ICU Management
          </Button>
          <Button 
            onClick={() => setShowClinical(true)}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
          >
            <Stethoscope className="h-4 w-4 mr-2" />
            Clinical Workflow
          </Button>
          <Button 
            onClick={() => setShowPremium(true)}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
          >
            <Crown className="h-4 w-4 mr-2" />
            Premium Ward
          </Button>
          <Button 
            onClick={() => setShowOT(true)}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
          >
            <Activity className="h-4 w-4 mr-2" />
            OT Management
          </Button>
        </div>
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 text-center">
            <div className="p-4 bg-white/50 rounded-lg">
              <Users className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <h3 className="font-bold text-blue-800">Patient Status</h3>
              <p className="text-sm text-gray-600">Real-time tracking</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <ClipboardCheck className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <h3 className="font-bold text-green-800">Pre-Discharge</h3>
              <p className="text-sm text-gray-600">Checklist system</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Calendar className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <h3 className="font-bold text-purple-800">Post-Discharge</h3>
              <p className="text-sm text-gray-600">Follow-up scheduler</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <FileText className="h-8 w-8 mx-auto text-orange-600 mb-2" />
              <h3 className="font-bold text-orange-800">Visit History</h3>
              <p className="text-sm text-gray-600">Smart generator</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Eye className="h-8 w-8 mx-auto text-cyan-600 mb-2" />
              <h3 className="font-bold text-cyan-800">Consent Status</h3>
              <p className="text-sm text-gray-600">Visual tracker</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <AlertTriangle className="h-8 w-8 mx-auto text-red-600 mb-2" />
              <h3 className="font-bold text-red-800">Missed Visits</h3>
              <p className="text-sm text-gray-600">Alert system</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="patients" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Patients</span>
          </TabsTrigger>
          <TabsTrigger value="pre-discharge" className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Pre-Discharge</span>
          </TabsTrigger>
          <TabsTrigger value="post-discharge" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Post-Discharge</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">History</span>
          </TabsTrigger>
          <TabsTrigger value="consent" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Consent</span>
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">Alerts</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="patients" className="space-y-6">
          <WardPatientStatus />
        </TabsContent>

        <TabsContent value="pre-discharge" className="space-y-6">
          <PreDischargeChecklist />
        </TabsContent>

        <TabsContent value="post-discharge" className="space-y-6">
          <PostDischargeScheduler />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <VisitHistoryGenerator />
        </TabsContent>

        <TabsContent value="consent" className="space-y-6">
          <ConsentStatusVisualizer />
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <MissedVisitAlerts />
        </TabsContent>
      </Tabs>
    </div>
  );
};
