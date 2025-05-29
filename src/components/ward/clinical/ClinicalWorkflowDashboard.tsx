
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PatientSLAEngine } from './PatientSLAEngine';
import { AdmissionFormGenerator } from './AdmissionFormGenerator';
import { MultiConsultationView } from './MultiConsultationView';
import { NurseCallMonitor } from './NurseCallMonitor';
import { ClinicalHandoffSystem } from './ClinicalHandoffSystem';
import { ProtocolAdherenceTracker } from './ProtocolAdherenceTracker';
import { Clock, FileText, Users, Phone, ArrowRightLeft, CheckSquare, Activity, Stethoscope } from 'lucide-react';

export const ClinicalWorkflowDashboard = () => {
  const [activeTab, setActiveTab] = useState('sla');

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
          <Stethoscope className="h-8 w-8 text-blue-600" />
          Clinical Workflow Management
        </h1>
        <p className="text-gray-600">
          Advanced tools for streamlined clinical operations and patient care coordination
        </p>
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 text-center">
            <div className="p-4 bg-white/50 rounded-lg">
              <Clock className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <h3 className="font-bold text-blue-800">SLA Engine</h3>
              <p className="text-sm text-gray-600">Time tracking</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <FileText className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <h3 className="font-bold text-green-800">Digital Forms</h3>
              <p className="text-sm text-gray-600">Admission generator</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Users className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <h3 className="font-bold text-purple-800">Multi-Consult</h3>
              <p className="text-sm text-gray-600">Complex cases</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Phone className="h-8 w-8 mx-auto text-orange-600 mb-2" />
              <h3 className="font-bold text-orange-800">Nurse Calls</h3>
              <p className="text-sm text-gray-600">Response monitor</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <ArrowRightLeft className="h-8 w-8 mx-auto text-cyan-600 mb-2" />
              <h3 className="font-bold text-cyan-800">Handoffs</h3>
              <p className="text-sm text-gray-600">Communication</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <CheckSquare className="h-8 w-8 mx-auto text-red-600 mb-2" />
              <h3 className="font-bold text-red-800">Protocols</h3>
              <p className="text-sm text-gray-600">Adherence tracking</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="sla" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">SLA</span>
          </TabsTrigger>
          <TabsTrigger value="forms" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Forms</span>
          </TabsTrigger>
          <TabsTrigger value="consults" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Consults</span>
          </TabsTrigger>
          <TabsTrigger value="calls" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">Calls</span>
          </TabsTrigger>
          <TabsTrigger value="handoffs" className="flex items-center gap-2">
            <ArrowRightLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Handoffs</span>
          </TabsTrigger>
          <TabsTrigger value="protocols" className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Protocols</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sla" className="space-y-6">
          <PatientSLAEngine />
        </TabsContent>

        <TabsContent value="forms" className="space-y-6">
          <AdmissionFormGenerator />
        </TabsContent>

        <TabsContent value="consults" className="space-y-6">
          <MultiConsultationView />
        </TabsContent>

        <TabsContent value="calls" className="space-y-6">
          <NurseCallMonitor />
        </TabsContent>

        <TabsContent value="handoffs" className="space-y-6">
          <ClinicalHandoffSystem />
        </TabsContent>

        <TabsContent value="protocols" className="space-y-6">
          <ProtocolAdherenceTracker />
        </TabsContent>
      </Tabs>
    </div>
  );
};
