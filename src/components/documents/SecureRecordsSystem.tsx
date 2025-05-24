
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BlockchainLogs } from './BlockchainLogs';
import { AccessModeToggle } from './AccessModeToggle';
import { EHRImportTool } from './EHRImportTool';
import { MultiFormatUpload } from './MultiFormatUpload';
import { FamilyPermissions } from './FamilyPermissions';
import { CriticalAlerts } from './CriticalAlerts';
import { PrescriptionReminders } from './PrescriptionReminders';
import { DischargeSummaryViewer } from './DischargeSummaryViewer';
import { RecordFilter } from './RecordFilter';
import { RecordSharing } from './RecordSharing';
import { BackupRecovery } from './BackupRecovery';
import { 
  Shield, 
  Database, 
  Upload, 
  Users, 
  AlertTriangle, 
  Settings,
  Pill,
  FileText,
  Filter,
  Share2,
  HardDrive
} from 'lucide-react';

export const SecureRecordsSystem = () => {
  const [activeTab, setActiveTab] = useState('blockchain');

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Shield className="h-8 w-8 text-blue-600" />
          Secure Records System
        </h1>
        <p className="text-gray-600">
          Advanced security, blockchain logging, premium features, and comprehensive record management
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 w-full lg:grid-cols-11">
          <TabsTrigger value="blockchain" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Blockchain</span>
          </TabsTrigger>
          <TabsTrigger value="access" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Access</span>
          </TabsTrigger>
          <TabsTrigger value="import" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Import</span>
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Upload</span>
          </TabsTrigger>
          <TabsTrigger value="family" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Family</span>
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">Alerts</span>
          </TabsTrigger>
          <TabsTrigger value="prescriptions" className="flex items-center gap-2">
            <Pill className="h-4 w-4" />
            <span className="hidden sm:inline">Prescriptions</span>
          </TabsTrigger>
          <TabsTrigger value="discharge" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Discharge</span>
          </TabsTrigger>
          <TabsTrigger value="filter" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filter</span>
          </TabsTrigger>
          <TabsTrigger value="sharing" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Sharing</span>
          </TabsTrigger>
          <TabsTrigger value="backup" className="flex items-center gap-2">
            <HardDrive className="h-4 w-4" />
            <span className="hidden sm:inline">Backup</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="blockchain" className="space-y-6">
          <BlockchainLogs />
        </TabsContent>

        <TabsContent value="access" className="space-y-6">
          <AccessModeToggle />
        </TabsContent>

        <TabsContent value="import" className="space-y-6">
          <EHRImportTool />
        </TabsContent>

        <TabsContent value="upload" className="space-y-6">
          <MultiFormatUpload />
        </TabsContent>

        <TabsContent value="family" className="space-y-6">
          <FamilyPermissions />
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <CriticalAlerts />
        </TabsContent>

        <TabsContent value="prescriptions" className="space-y-6">
          <PrescriptionReminders />
        </TabsContent>

        <TabsContent value="discharge" className="space-y-6">
          <DischargeSummaryViewer />
        </TabsContent>

        <TabsContent value="filter" className="space-y-6">
          <RecordFilter />
        </TabsContent>

        <TabsContent value="sharing" className="space-y-6">
          <RecordSharing />
        </TabsContent>

        <TabsContent value="backup" className="space-y-6">
          <BackupRecovery />
        </TabsContent>
      </Tabs>
    </div>
  );
};
