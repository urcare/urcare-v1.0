
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LeavePolicyConfigurator } from './LeavePolicyConfigurator';
import { StaffPerformanceTracker } from './StaffPerformanceTracker';
import { TrainingManagementSystem } from './TrainingManagementSystem';
import { CertificationRenewalSystem } from './CertificationRenewalSystem';
import { EmployeeSatisfactionSurvey } from './EmployeeSatisfactionSurvey';
import { ComplianceReportingSystem } from './ComplianceReportingSystem';
import { AnalyticsOverview } from './AnalyticsOverview';
import { 
  BarChart3, 
  Settings, 
  TrendingUp,
  GraduationCap,
  Award,
  MessageSquare,
  Shield,
  Database
} from 'lucide-react';

export const HRAnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">HR Analytics & Compliance</h1>
                <p className="text-sm text-gray-600">Data-driven HR management and compliance tracking</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-7 w-full mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="leave-policy" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Leave Policy</span>
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Performance</span>
            </TabsTrigger>
            <TabsTrigger value="training" className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              <span className="hidden sm:inline">Training</span>
            </TabsTrigger>
            <TabsTrigger value="certification" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span className="hidden sm:inline">Certification</span>
            </TabsTrigger>
            <TabsTrigger value="surveys" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Surveys</span>
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Compliance</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <AnalyticsOverview />
          </TabsContent>

          <TabsContent value="leave-policy" className="space-y-6">
            <LeavePolicyConfigurator />
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <StaffPerformanceTracker />
          </TabsContent>

          <TabsContent value="training" className="space-y-6">
            <TrainingManagementSystem />
          </TabsContent>

          <TabsContent value="certification" className="space-y-6">
            <CertificationRenewalSystem />
          </TabsContent>

          <TabsContent value="surveys" className="space-y-6">
            <EmployeeSatisfactionSurvey />
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <ComplianceReportingSystem />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
