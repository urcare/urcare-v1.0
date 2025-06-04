
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SOPViolationPanel } from './SOPViolationPanel';
import { AnonymousReportingPortal } from './AnonymousReportingPortal';
import { StaffFatigueAnalyzer } from './StaffFatigueAnalyzer';
import { ShiftSwapInterface } from './ShiftSwapInterface';
import { DepartmentLoadVisualizer } from './DepartmentLoadVisualizer';
import { BroadcastNotificationSystem } from './BroadcastNotificationSystem';
import { 
  Shield, 
  MessageSquare, 
  Brain,
  RefreshCw,
  BarChart,
  Bell
} from 'lucide-react';

export const HRAdvancedDashboard = () => {
  const [activeTab, setActiveTab] = useState('sop');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Advanced HR Management</h1>
                <p className="text-sm text-gray-600">Premium staff management tools and analytics</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-6 w-full mb-6">
            <TabsTrigger value="sop" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">SOP Monitoring</span>
            </TabsTrigger>
            <TabsTrigger value="reporting" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Anonymous Reports</span>
            </TabsTrigger>
            <TabsTrigger value="fatigue" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline">Fatigue Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="swaps" className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Shift Swaps</span>
            </TabsTrigger>
            <TabsTrigger value="load" className="flex items-center gap-2">
              <BarChart className="w-4 h-4" />
              <span className="hidden sm:inline">Load Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sop" className="space-y-6">
            <SOPViolationPanel />
          </TabsContent>

          <TabsContent value="reporting" className="space-y-6">
            <AnonymousReportingPortal />
          </TabsContent>

          <TabsContent value="fatigue" className="space-y-6">
            <StaffFatigueAnalyzer />
          </TabsContent>

          <TabsContent value="swaps" className="space-y-6">
            <ShiftSwapInterface />
          </TabsContent>

          <TabsContent value="load" className="space-y-6">
            <DepartmentLoadVisualizer />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <BroadcastNotificationSystem />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
