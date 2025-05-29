
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ICUDeterioration } from './ICUDeterioration';
import { ICUVitalsBoard } from './ICUVitalsBoard';
import { EmergencyTriage } from './EmergencyTriage';
import { CodeBlueSystem } from './CodeBlueSystem';
import { OxygenSupplyDashboard } from './OxygenSupplyDashboard';
import { ICUAdmissionChecklist } from './ICUAdmissionChecklist';
import { PremiumICUDashboard } from './premium/PremiumICUDashboard';
import { CriticalCareManagement } from './critical/CriticalCareManagement';
import { ICUAnalyticsDashboard } from './analytics/ICUAnalyticsDashboard';
import { Brain, Activity, AlertTriangle, Zap, Wind, ClipboardCheck, Heart, Monitor, Crown, Sparkles, Shield, TrendingUp } from 'lucide-react';

export const ICUDashboard = () => {
  const [activeTab, setActiveTab] = useState('deterioration');
  const [showPremium, setShowPremium] = useState(false);
  const [showCriticalCare, setShowCriticalCare] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  if (showAnalytics) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => setShowAnalytics(false)}
            className="mb-4"
          >
            ← Back to Standard ICU
          </Button>
          <Badge className="bg-blue-500 text-white">
            <TrendingUp className="h-3 w-3 mr-1" />
            Analytics Active
          </Badge>
        </div>
        <ICUAnalyticsDashboard />
      </div>
    );
  }

  if (showCriticalCare) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => setShowCriticalCare(false)}
            className="mb-4"
          >
            ← Back to Standard ICU
          </Button>
          <Badge className="bg-purple-500 text-white">
            <Shield className="h-3 w-3 mr-1" />
            Critical Care Active
          </Badge>
        </div>
        <CriticalCareManagement />
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
            ← Back to Standard ICU
          </Button>
          <Badge className="bg-yellow-500 text-white">
            <Crown className="h-3 w-3 mr-1" />
            Premium ICU Active
          </Badge>
        </div>
        <PremiumICUDashboard />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
          <Heart className="h-8 w-8 text-red-600" />
          ICU Monitoring Dashboard
        </h1>
        <p className="text-gray-600">
          Advanced AI-powered ICU monitoring and critical care management
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          <Button 
            onClick={() => setShowPremium(true)}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white flex items-center gap-2"
          >
            <Crown className="h-4 w-4" />
            Upgrade to Premium ICU
            <Sparkles className="h-4 w-4" />
          </Button>
          <Button 
            onClick={() => setShowCriticalCare(true)}
            className="bg-gradient-to-r from-purple-500 to-red-500 hover:from-purple-600 hover:to-red-600 text-white flex items-center gap-2"
          >
            <Shield className="h-4 w-4" />
            Critical Care Management
          </Button>
          <Button 
            onClick={() => setShowAnalytics(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white flex items-center gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            Analytics & Prediction
          </Button>
        </div>
      </div>

      <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 text-center">
            <div className="p-4 bg-white/50 rounded-lg">
              <Brain className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <h3 className="font-bold text-purple-800">AI Predictor</h3>
              <p className="text-sm text-gray-600">Deterioration alerts</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Monitor className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <h3 className="font-bold text-blue-800">Vitals Board</h3>
              <p className="text-sm text-gray-600">Real-time monitoring</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <AlertTriangle className="h-8 w-8 mx-auto text-yellow-600 mb-2" />
              <h3 className="font-bold text-yellow-800">Triage AI</h3>
              <p className="text-sm text-gray-600">Emergency scoring</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Zap className="h-8 w-8 mx-auto text-red-600 mb-2" />
              <h3 className="font-bold text-red-800">Code Blue</h3>
              <p className="text-sm text-gray-600">Emergency response</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Wind className="h-8 w-8 mx-auto text-cyan-600 mb-2" />
              <h3 className="font-bold text-cyan-800">Oxygen</h3>
              <p className="text-sm text-gray-600">Supply monitoring</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <ClipboardCheck className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <h3 className="font-bold text-green-800">Admission</h3>
              <p className="text-sm text-gray-600">Auto checklist</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="deterioration" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">AI Predictor</span>
          </TabsTrigger>
          <TabsTrigger value="vitals" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            <span className="hidden sm:inline">Vitals</span>
          </TabsTrigger>
          <TabsTrigger value="triage" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">Triage</span>
          </TabsTrigger>
          <TabsTrigger value="codeblue" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Code Blue</span>
          </TabsTrigger>
          <TabsTrigger value="oxygen" className="flex items-center gap-2">
            <Wind className="h-4 w-4" />
            <span className="hidden sm:inline">Oxygen</span>
          </TabsTrigger>
          <TabsTrigger value="checklist" className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Checklist</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="deterioration" className="space-y-6">
          <ICUDeterioration />
        </TabsContent>

        <TabsContent value="vitals" className="space-y-6">
          <ICUVitalsBoard />
        </TabsContent>

        <TabsContent value="triage" className="space-y-6">
          <EmergencyTriage />
        </TabsContent>

        <TabsContent value="codeblue" className="space-y-6">
          <CodeBlueSystem />
        </TabsContent>

        <TabsContent value="oxygen" className="space-y-6">
          <OxygenSupplyDashboard />
        </TabsContent>

        <TabsContent value="checklist" className="space-y-6">
          <ICUAdmissionChecklist />
        </TabsContent>
      </Tabs>
    </div>
  );
};
