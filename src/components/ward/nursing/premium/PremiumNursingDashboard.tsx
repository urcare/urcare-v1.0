
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { CatheterIVTracker } from './CatheterIVTracker';
import { NurseVisitSLATimer } from './NurseVisitSLATimer';
import { NightShiftView } from './NightShiftView';
import { NursingCarePlanManager } from './NursingCarePlanManager';
import { PatientAcuityScoring } from './PatientAcuityScoring';
import { NursingDocumentationTemplates } from './NursingDocumentationTemplates';
import { Crown, Droplets, Timer, Moon, ClipboardList, AlertTriangle, FileText } from 'lucide-react';

export const PremiumNursingDashboard = () => {
  const [activeTab, setActiveTab] = useState('catheters');
  const [nightMode, setNightMode] = useState(false);

  return (
    <div className={`space-y-6 ${nightMode ? 'bg-gray-900 text-white' : ''}`}>
      <div className="flex justify-between items-center">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
            <Crown className="h-8 w-8 text-yellow-600" />
            Premium Nursing Management
            <Droplets className="h-8 w-8 text-amber-600" />
          </h1>
          <p className={`${nightMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Advanced nursing tools for enhanced patient care and compliance monitoring
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Moon className="h-4 w-4" />
          <Switch 
            checked={nightMode} 
            onCheckedChange={setNightMode}
          />
          <span className="text-sm">Night Mode</span>
        </div>
      </div>

      <Card className={`${nightMode ? 'bg-gray-800 border-gray-700' : 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200'}`}>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 text-center">
            <div className={`p-4 ${nightMode ? 'bg-gray-700/50' : 'bg-white/50'} rounded-lg`}>
              <Droplets className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <h3 className="font-bold text-blue-800">Catheter/IV</h3>
              <p className={`text-sm ${nightMode ? 'text-gray-300' : 'text-gray-600'}`}>Line tracking</p>
            </div>
            <div className={`p-4 ${nightMode ? 'bg-gray-700/50' : 'bg-white/50'} rounded-lg`}>
              <Timer className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <h3 className="font-bold text-green-800">SLA Timer</h3>
              <p className={`text-sm ${nightMode ? 'text-gray-300' : 'text-gray-600'}`}>Visit compliance</p>
            </div>
            <div className={`p-4 ${nightMode ? 'bg-gray-700/50' : 'bg-white/50'} rounded-lg`}>
              <Moon className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <h3 className="font-bold text-purple-800">Night Shift</h3>
              <p className={`text-sm ${nightMode ? 'text-gray-300' : 'text-gray-600'}`}>Special view</p>
            </div>
            <div className={`p-4 ${nightMode ? 'bg-gray-700/50' : 'bg-white/50'} rounded-lg`}>
              <ClipboardList className="h-8 w-8 mx-auto text-orange-600 mb-2" />
              <h3 className="font-bold text-orange-800">Care Plans</h3>
              <p className={`text-sm ${nightMode ? 'text-gray-300' : 'text-gray-600'}`}>Management</p>
            </div>
            <div className={`p-4 ${nightMode ? 'bg-gray-700/50' : 'bg-white/50'} rounded-lg`}>
              <AlertTriangle className="h-8 w-8 mx-auto text-red-600 mb-2" />
              <h3 className="font-bold text-red-800">Acuity</h3>
              <p className={`text-sm ${nightMode ? 'text-gray-300' : 'text-gray-600'}`}>Scoring system</p>
            </div>
            <div className={`p-4 ${nightMode ? 'bg-gray-700/50' : 'bg-white/50'} rounded-lg`}>
              <FileText className="h-8 w-8 mx-auto text-cyan-600 mb-2" />
              <h3 className="font-bold text-cyan-800">Templates</h3>
              <p className={`text-sm ${nightMode ? 'text-gray-300' : 'text-gray-600'}`}>Documentation</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="catheters" className="flex items-center gap-2">
            <Droplets className="h-4 w-4" />
            <span className="hidden sm:inline">Catheter/IV</span>
          </TabsTrigger>
          <TabsTrigger value="sla" className="flex items-center gap-2">
            <Timer className="h-4 w-4" />
            <span className="hidden sm:inline">SLA Timer</span>
          </TabsTrigger>
          <TabsTrigger value="night" className="flex items-center gap-2">
            <Moon className="h-4 w-4" />
            <span className="hidden sm:inline">Night Shift</span>
          </TabsTrigger>
          <TabsTrigger value="careplans" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            <span className="hidden sm:inline">Care Plans</span>
          </TabsTrigger>
          <TabsTrigger value="acuity" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">Acuity</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Templates</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="catheters" className="space-y-6">
          <CatheterIVTracker nightMode={nightMode} />
        </TabsContent>

        <TabsContent value="sla" className="space-y-6">
          <NurseVisitSLATimer nightMode={nightMode} />
        </TabsContent>

        <TabsContent value="night" className="space-y-6">
          <NightShiftView nightMode={nightMode} />
        </TabsContent>

        <TabsContent value="careplans" className="space-y-6">
          <NursingCarePlanManager nightMode={nightMode} />
        </TabsContent>

        <TabsContent value="acuity" className="space-y-6">
          <PatientAcuityScoring nightMode={nightMode} />
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <NursingDocumentationTemplates nightMode={nightMode} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
