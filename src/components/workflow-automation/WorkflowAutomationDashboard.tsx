
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SmartConsentTriggerInterface } from './SmartConsentTriggerInterface';
import { DynamicTaskManagementSystem } from './DynamicTaskManagementSystem';
import { ReVisitSchedulingInterface } from './ReVisitSchedulingInterface';
import { ConsentExpiryMonitoringDashboard } from './ConsentExpiryMonitoringDashboard';
import { DischargeTimingPredictor } from './DischargeTimingPredictor';
import { MissedTaskRecoverySystem } from './MissedTaskRecoverySystem';
import { 
  Workflow, 
  CheckSquare, 
  Calendar, 
  AlertTriangle, 
  Clock, 
  RefreshCw,
  Bot,
  FileText,
  Users,
  Target
} from 'lucide-react';

export const WorkflowAutomationDashboard = () => {
  const [activeTab, setActiveTab] = useState('consent-trigger');

  const automationStats = [
    { label: 'Active Workflows', value: '127', icon: Workflow, color: 'blue' },
    { label: 'Tasks Automated', value: '89%', icon: Bot, color: 'green' },
    { label: 'Process Efficiency', value: '94.2%', icon: Target, color: 'purple' },
    { label: 'Time Saved', value: '340h', icon: Clock, color: 'orange' }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Workflow className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Workflow Automation AI</h1>
                <p className="text-sm text-gray-600">Intelligent process management and workflow orchestration</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {automationStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <stat.icon className={`w-8 h-8 text-${stat.color}-600`} />
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-6 w-full mb-6">
            <TabsTrigger value="consent-trigger" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Consent</span>
            </TabsTrigger>
            <TabsTrigger value="task-management" className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Tasks</span>
            </TabsTrigger>
            <TabsTrigger value="revisit-scheduling" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Scheduling</span>
            </TabsTrigger>
            <TabsTrigger value="consent-expiry" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="hidden sm:inline">Expiry</span>
            </TabsTrigger>
            <TabsTrigger value="discharge-timing" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">Discharge</span>
            </TabsTrigger>
            <TabsTrigger value="task-recovery" className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Recovery</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="consent-trigger" className="space-y-6">
            <SmartConsentTriggerInterface />
          </TabsContent>

          <TabsContent value="task-management" className="space-y-6">
            <DynamicTaskManagementSystem />
          </TabsContent>

          <TabsContent value="revisit-scheduling" className="space-y-6">
            <ReVisitSchedulingInterface />
          </TabsContent>

          <TabsContent value="consent-expiry" className="space-y-6">
            <ConsentExpiryMonitoringDashboard />
          </TabsContent>

          <TabsContent value="discharge-timing" className="space-y-6">
            <DischargeTimingPredictor />
          </TabsContent>

          <TabsContent value="task-recovery" className="space-y-6">
            <MissedTaskRecoverySystem />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
