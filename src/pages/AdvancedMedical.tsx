
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RISDashboard } from '@/components/ris/RISDashboard';
import { PathologyDashboard } from '@/components/pathology/PathologyDashboard';
import { MedicalRecordsManager } from '@/components/medical-records/MedicalRecordsManager';
import { MedicalImagingInterface } from '@/components/ai-diagnostics/MedicalImagingInterface';
import { RadiologyAIInterface } from '@/components/ai-diagnostics/RadiologyAIInterface';
import { ClinicalDecisionSupportDashboard } from '@/components/clinical-decision/ClinicalDecisionSupportDashboard';

const AdvancedMedical = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold">Advanced Medical Features</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Comprehensive medical diagnostic and management systems with AI-powered analysis
        </p>
      </div>
      
      <Tabs defaultValue="ris" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="ris">RIS</TabsTrigger>
          <TabsTrigger value="pathology">Pathology</TabsTrigger>
          <TabsTrigger value="records">Medical Records</TabsTrigger>
          <TabsTrigger value="imaging">AI Imaging</TabsTrigger>
          <TabsTrigger value="radiology-ai">Radiology AI</TabsTrigger>
          <TabsTrigger value="clinical-decision">Clinical Support</TabsTrigger>
        </TabsList>

        <TabsContent value="ris">
          <RISDashboard />
        </TabsContent>

        <TabsContent value="pathology">
          <PathologyDashboard />
        </TabsContent>

        <TabsContent value="records">
          <MedicalRecordsManager />
        </TabsContent>

        <TabsContent value="imaging">
          <MedicalImagingInterface />
        </TabsContent>

        <TabsContent value="radiology-ai">
          <RadiologyAIInterface />
        </TabsContent>

        <TabsContent value="clinical-decision">
          <ClinicalDecisionSupportDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedMedical;
