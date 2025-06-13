
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MaintenanceScheduler } from './MaintenanceScheduler';
import { UpdateManagementDashboard } from './UpdateManagementDashboard';
import { SystemHealthMonitor } from './SystemHealthMonitor';
import { BackupManagementInterface } from './BackupManagementInterface';
import { DisasterRecoveryConsole } from './DisasterRecoveryConsole';
import { 
  Wrench, 
  Shield, 
  Activity, 
  Database, 
  AlertTriangle,
  CheckCircle,
  Calendar,
  Download,
  HardDrive
} from 'lucide-react';

export const SystemMaintenanceDashboard = () => {
  const [activeTab, setActiveTab] = useState('scheduler');

  const systemOverview = {
    maintenanceWindows: 3,
    pendingUpdates: 12,
    systemHealth: 98.5,
    lastBackup: '2 hours ago',
    drTestStatus: 'passed',
    criticalAlerts: 2
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
          <Wrench className="h-8 w-8 text-blue-600" />
          System Maintenance Tools
          <Shield className="h-8 w-8 text-purple-600" />
        </h1>
        <p className="text-gray-600">
          Comprehensive maintenance, monitoring, and disaster recovery management
        </p>
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 text-center">
            <div className="p-4 bg-white/50 rounded-lg">
              <Calendar className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <h3 className="font-bold text-blue-800">Maintenance</h3>
              <p className="text-2xl font-bold">{systemOverview.maintenanceWindows}</p>
              <p className="text-sm text-gray-600">Scheduled</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Download className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <h3 className="font-bold text-green-800">Updates</h3>
              <p className="text-2xl font-bold">{systemOverview.pendingUpdates}</p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Activity className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <h3 className="font-bold text-purple-800">Health</h3>
              <p className="text-2xl font-bold">{systemOverview.systemHealth}%</p>
              <p className="text-sm text-gray-600">Overall</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <HardDrive className="h-8 w-8 mx-auto text-orange-600 mb-2" />
              <h3 className="font-bold text-orange-800">Backup</h3>
              <p className="text-sm font-bold">{systemOverview.lastBackup}</p>
              <p className="text-sm text-gray-600">Last completed</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Shield className="h-8 w-8 mx-auto text-cyan-600 mb-2" />
              <h3 className="font-bold text-cyan-800">DR Test</h3>
              <Badge className="bg-green-100 text-green-800">
                {systemOverview.drTestStatus}
              </Badge>
              <p className="text-sm text-gray-600">Status</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <AlertTriangle className="h-8 w-8 mx-auto text-red-600 mb-2" />
              <h3 className="font-bold text-red-800">Alerts</h3>
              <p className="text-2xl font-bold">{systemOverview.criticalAlerts}</p>
              <p className="text-sm text-gray-600">Critical</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="scheduler" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Scheduler</span>
          </TabsTrigger>
          <TabsTrigger value="updates" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Updates</span>
          </TabsTrigger>
          <TabsTrigger value="health" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Health</span>
          </TabsTrigger>
          <TabsTrigger value="backup" className="flex items-center gap-2">
            <HardDrive className="h-4 w-4" />
            <span className="hidden sm:inline">Backup</span>
          </TabsTrigger>
          <TabsTrigger value="disaster-recovery" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">DR</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scheduler" className="space-y-6">
          <MaintenanceScheduler />
        </TabsContent>

        <TabsContent value="updates" className="space-y-6">
          <UpdateManagementDashboard />
        </TabsContent>

        <TabsContent value="health" className="space-y-6">
          <SystemHealthMonitor />
        </TabsContent>

        <TabsContent value="backup" className="space-y-6">
          <BackupManagementInterface />
        </TabsContent>

        <TabsContent value="disaster-recovery" className="space-y-6">
          <DisasterRecoveryConsole />
        </TabsContent>
      </Tabs>
    </div>
  );
};
