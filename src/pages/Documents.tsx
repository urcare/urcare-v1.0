
import React from 'react';
import { Layout } from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DocumentDashboard } from '@/components/documents/DocumentDashboard';
import { SecureRecordsSystem } from '@/components/documents/SecureRecordsSystem';
import { PrescriptionReminders } from '@/components/documents/PrescriptionReminders';
import { DischargeSummaryViewer } from '@/components/documents/DischargeSummaryViewer';
import { MedicationTracker } from '@/components/documents/MedicationTracker';
import { DocumentWorkflow } from '@/components/documents/DocumentWorkflow';
import { ElectronicSignature } from '@/components/documents/ElectronicSignature';
import { DocumentVersionControl } from '@/components/documents/DocumentVersionControl';
import { ApprovalWorkflow } from '@/components/documents/ApprovalWorkflow';
import { DocumentTemplates } from '@/components/documents/DocumentTemplates';
import { AdvancedDocumentSearch } from '@/components/documents/AdvancedDocumentSearch';
import { DocumentArchival } from '@/components/documents/DocumentArchival';

const Documents = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Medical Documents</h1>
          <p className="text-gray-600">Comprehensive document management with workflows, signatures, and version control</p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid grid-cols-6 w-full lg:grid-cols-12">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="workflow">Workflow</TabsTrigger>
            <TabsTrigger value="signatures">E-Signatures</TabsTrigger>
            <TabsTrigger value="versions">Versions</TabsTrigger>
            <TabsTrigger value="approvals">Approvals</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger value="archival">Archival</TabsTrigger>
            <TabsTrigger value="records">Secure Records</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            <TabsTrigger value="medications">Medication Tracker</TabsTrigger>
            <TabsTrigger value="discharge">Discharge Summaries</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DocumentDashboard />
          </TabsContent>

          <TabsContent value="workflow">
            <DocumentWorkflow />
          </TabsContent>

          <TabsContent value="signatures">
            <ElectronicSignature />
          </TabsContent>

          <TabsContent value="versions">
            <DocumentVersionControl />
          </TabsContent>

          <TabsContent value="approvals">
            <ApprovalWorkflow />
          </TabsContent>

          <TabsContent value="templates">
            <DocumentTemplates />
          </TabsContent>

          <TabsContent value="search">
            <AdvancedDocumentSearch />
          </TabsContent>

          <TabsContent value="archival">
            <DocumentArchival />
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
