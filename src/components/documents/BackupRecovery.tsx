
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, HardDrive, Cloud, RefreshCw, AlertTriangle, Clock } from 'lucide-react';
import { BackupDashboard } from './backup/BackupDashboard';
import { DisasterRecovery } from './backup/DisasterRecovery';
import { DataRetentionPolicies } from './backup/DataRetentionPolicies';
import { SystemRestore } from './backup/SystemRestore';
import { DataIntegrityVerification } from './backup/DataIntegrityVerification';
import { BusinessContinuityPlanning } from './backup/BusinessContinuityPlanning';

export const BackupRecovery = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const systemStats = {
    totalBackups: 156,
    storageUsed: '2.4 TB',
    lastBackup: '2 hours ago',
    systemHealth: 98.5,
    recoveryTime: '< 15 min',
    dataIntegrity: 100
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Backup & Recovery Management</h2>
          <p className="text-gray-600">Enterprise-grade backup, disaster recovery, and business continuity platform</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security Status
          </Button>
          <Button className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Emergency Backup
          </Button>
        </div>
      </div>

      {/* Quick Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {[
          { label: 'Total Backups', value: systemStats.totalBackups, icon: HardDrive, color: 'blue' },
          { label: 'Storage Used', value: systemStats.storageUsed, icon: Cloud, color: 'green' },
          { label: 'Last Backup', value: systemStats.lastBackup, icon: Clock, color: 'purple' },
          { label: 'System Health', value: `${systemStats.systemHealth}%`, icon: Shield, color: 'emerald' },
          { label: 'Recovery Time', value: systemStats.recoveryTime, icon: RefreshCw, color: 'orange' },
          { label: 'Data Integrity', value: `${systemStats.dataIntegrity}%`, icon: AlertTriangle, color: 'red' }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <Icon className={`h-8 w-8 text-${stat.color}-600`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="disaster-recovery">Disaster Recovery</TabsTrigger>
          <TabsTrigger value="data-retention">Data Retention</TabsTrigger>
          <TabsTrigger value="system-restore">System Restore</TabsTrigger>
          <TabsTrigger value="data-integrity">Data Integrity</TabsTrigger>
          <TabsTrigger value="business-continuity">Business Continuity</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <BackupDashboard />
        </TabsContent>

        <TabsContent value="disaster-recovery">
          <DisasterRecovery />
        </TabsContent>

        <TabsContent value="data-retention">
          <DataRetentionPolicies />
        </TabsContent>

        <TabsContent value="system-restore">
          <SystemRestore />
        </TabsContent>

        <TabsContent value="data-integrity">
          <DataIntegrityVerification />
        </TabsContent>

        <TabsContent value="business-continuity">
          <BusinessContinuityPlanning />
        </TabsContent>
      </Tabs>
    </div>
  );
};
