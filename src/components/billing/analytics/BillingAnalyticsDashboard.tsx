
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ItemWiseBreakdown } from './ItemWiseBreakdown';
import { ReversalCancellationManagement } from './ReversalCancellationManagement';
import { BillingCorrectionAudit } from './BillingCorrectionAudit';
import { LiveCollectionDashboard } from './LiveCollectionDashboard';
import { BillToDischargeIntegration } from './BillToDischargeIntegration';
import { ERPExportCapabilities } from './ERPExportCapabilities';
import { 
  BarChart3, 
  RefreshCw, 
  FileEdit,
  TrendingUp,
  UserCheck,
  Download
} from 'lucide-react';

export const BillingAnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState('breakdown');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Billing Analytics & Reporting</h1>
                <p className="text-sm text-gray-600">Comprehensive insights and drill-down analytics</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-6 w-full mb-6">
            <TabsTrigger value="breakdown" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Breakdown</span>
            </TabsTrigger>
            <TabsTrigger value="reversals" className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Reversals</span>
            </TabsTrigger>
            <TabsTrigger value="corrections" className="flex items-center gap-2">
              <FileEdit className="w-4 h-4" />
              <span className="hidden sm:inline">Corrections</span>
            </TabsTrigger>
            <TabsTrigger value="collections" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Collections</span>
            </TabsTrigger>
            <TabsTrigger value="discharge" className="flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Discharge</span>
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="breakdown" className="space-y-6">
            <ItemWiseBreakdown />
          </TabsContent>

          <TabsContent value="reversals" className="space-y-6">
            <ReversalCancellationManagement />
          </TabsContent>

          <TabsContent value="corrections" className="space-y-6">
            <BillingCorrectionAudit />
          </TabsContent>

          <TabsContent value="collections" className="space-y-6">
            <LiveCollectionDashboard />
          </TabsContent>

          <TabsContent value="discharge" className="space-y-6">
            <BillToDischargeIntegration />
          </TabsContent>

          <TabsContent value="export" className="space-y-6">
            <ERPExportCapabilities />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
