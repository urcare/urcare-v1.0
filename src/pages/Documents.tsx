
import React from 'react';
import { Layout } from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DocumentDashboard } from '@/components/documents/DocumentDashboard';
import { SecureRecordsSystem } from '@/components/documents/SecureRecordsSystem';
import { PrescriptionReminders } from '@/components/documents/PrescriptionReminders';
import { DischargeSummaryViewer } from '@/components/documents/DischargeSummaryViewer';
import { MedicationTracker } from '@/components/documents/MedicationTracker';

const Documents = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Medical Documents</h1>
          <p className="text-gray-600">Securely manage and access your medical records and documents</p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="records">Secure Records</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            <TabsTrigger value="medications">Medication Tracker</TabsTrigger>
            <TabsTrigger value="discharge">Discharge Summaries</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DocumentDashboard />
          </TabsContent>

          <TabsContent value="records">
            <SecureRecordsSystem />
          </TabsContent>

          <TabsContent value="prescriptions">
            <PrescriptionReminders />
          </TabsContent>

          <TabsContent value="medications">
            <MedicationTracker />
          </TabsContent>

          <TabsContent value="discharge">
            <DischargeSummaryViewer />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Documents;
