
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { VisitSummaryAutomation } from './VisitSummaryAutomation';
import { PreAuthorizationInterface } from './PreAuthorizationInterface';
import { FollowUpReminderSystem } from './FollowUpReminderSystem';
import { MultiSpecialtyTimelineCoordinator } from './MultiSpecialtyTimelineCoordinator';
import { StaffOverloadDetector } from './StaffOverloadDetector';
import { InfectionRiskMapping } from './InfectionRiskMapping';
import { 
  Bot, 
  FileText, 
  CreditCard, 
  Bell, 
  Calendar, 
  Users, 
  Shield,
  TrendingUp,
  Clock,
  AlertTriangle
} from 'lucide-react';

export const AdvancedWorkflowDashboard = () => {
  const [activeTab, setActiveTab] = useState('visit-summary');

  const workflowStats = [
    { label: 'Automated Processes', value: '156', icon: Bot, color: 'blue' },
    { label: 'Efficiency Gain', value: '67%', icon: TrendingUp, color: 'green' },
    { label: 'Time Saved Daily', value: '4.2h', icon: Clock, color: 'purple' },
    { label: 'Risk Alerts', value: '8', icon: AlertTriangle, color: 'orange' }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Advanced Workflow AI</h1>
                <p className="text-sm text-gray-600">Premium process automation and intelligent workflow orchestration</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {workflowStats.map((stat, index) => (
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
            <TabsTrigger value="visit-summary" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Summary</span>
            </TabsTrigger>
            <TabsTrigger value="pre-auth" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Pre-Auth</span>
            </TabsTrigger>
            <TabsTrigger value="follow-up" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Follow-up</span>
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Timeline</span>
            </TabsTrigger>
            <TabsTrigger value="staff-load" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Staff</span>
            </TabsTrigger>
            <TabsTrigger value="infection-risk" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Risk</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="visit-summary" className="space-y-6">
            <VisitSummaryAutomation />
          </TabsContent>

          <TabsContent value="pre-auth" className="space-y-6">
            <PreAuthorizationInterface />
          </TabsContent>

          <TabsContent value="follow-up" className="space-y-6">
            <FollowUpReminderSystem />
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <MultiSpecialtyTimelineCoordinator />
          </TabsContent>

          <TabsContent value="staff-load" className="space-y-6">
            <StaffOverloadDetector />
          </TabsContent>

          <TabsContent value="infection-risk" className="space-y-6">
            <InfectionRiskMapping />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
