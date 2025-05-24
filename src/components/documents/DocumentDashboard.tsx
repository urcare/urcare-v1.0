
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DocumentScanner } from './DocumentScanner';
import { DocumentGroups } from './DocumentGroups';
import { ScanRReels } from './ScanRReels';
import { DocumentTimeline } from './DocumentTimeline';
import { ReportSummary } from './ReportSummary';
import { EmergencyExport } from './EmergencyExport';
import { SecureRecordsSystem } from './SecureRecordsSystem';
import { Camera, FolderOpen, Play, Calendar, FileText, AlertCircle, Shield } from 'lucide-react';

export const DocumentDashboard = () => {
  const [activeTab, setActiveTab] = useState('scanner');

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Document Management</h1>
        <p className="text-gray-600">
          Smart document scanning, organization, and emergency access for all your medical records
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-7 w-full">
          <TabsTrigger value="scanner" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            <span className="hidden sm:inline">Scanner</span>
          </TabsTrigger>
          <TabsTrigger value="groups" className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Groups</span>
          </TabsTrigger>
          <TabsTrigger value="reels" className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            <span className="hidden sm:inline">Reels</span>
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Timeline</span>
          </TabsTrigger>
          <TabsTrigger value="summary" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Summary</span>
          </TabsTrigger>
          <TabsTrigger value="emergency" className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Emergency</span>
          </TabsTrigger>
          <TabsTrigger value="secure" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Secure</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scanner" className="space-y-6">
          <DocumentScanner />
        </TabsContent>

        <TabsContent value="groups" className="space-y-6">
          <DocumentGroups />
        </TabsContent>

        <TabsContent value="reels" className="space-y-6">
          <div className="max-w-2xl mx-auto">
            <ScanRReels />
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <DocumentTimeline />
        </TabsContent>

        <TabsContent value="summary" className="space-y-6">
          <ReportSummary />
        </TabsContent>

        <TabsContent value="emergency" className="space-y-6">
          <EmergencyExport />
        </TabsContent>

        <TabsContent value="secure" className="space-y-6">
          <SecureRecordsSystem />
        </TabsContent>
      </Tabs>
    </div>
  );
};
