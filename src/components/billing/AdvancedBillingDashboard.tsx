
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SplitBillArchitecture } from './SplitBillArchitecture';
import { RealTimeEstimateGenerator } from './RealTimeEstimateGenerator';
import { AutoInvoiceBuilder } from './AutoInvoiceBuilder';
import { PaymentModeTracker } from './PaymentModeTracker';
import { HighValueAlertSystem } from './HighValueAlertSystem';
import { DoctorIncentiveMapping } from './DoctorIncentiveMapping';
import { 
  Users, 
  Calculator, 
  FileText, 
  CreditCard,
  AlertTriangle,
  Award
} from 'lucide-react';

export const AdvancedBillingDashboard = () => {
  const [activeTab, setActiveTab] = useState('split-billing');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Advanced Billing Features</h1>
                <p className="text-sm text-gray-600">Sophisticated billing capabilities for complex scenarios</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-6 w-full mb-6">
            <TabsTrigger value="split-billing" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Split Billing</span>
            </TabsTrigger>
            <TabsTrigger value="estimate-generator" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              <span className="hidden sm:inline">Estimates</span>
            </TabsTrigger>
            <TabsTrigger value="invoice-builder" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Invoices</span>
            </TabsTrigger>
            <TabsTrigger value="payment-tracker" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Payments</span>
            </TabsTrigger>
            <TabsTrigger value="high-value-alerts" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="hidden sm:inline">Alerts</span>
            </TabsTrigger>
            <TabsTrigger value="doctor-incentives" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span className="hidden sm:inline">Incentives</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="split-billing" className="space-y-6">
            <SplitBillArchitecture />
          </TabsContent>

          <TabsContent value="estimate-generator" className="space-y-6">
            <RealTimeEstimateGenerator />
          </TabsContent>

          <TabsContent value="invoice-builder" className="space-y-6">
            <AutoInvoiceBuilder />
          </TabsContent>

          <TabsContent value="payment-tracker" className="space-y-6">
            <PaymentModeTracker />
          </TabsContent>

          <TabsContent value="high-value-alerts" className="space-y-6">
            <HighValueAlertSystem />
          </TabsContent>

          <TabsContent value="doctor-incentives" className="space-y-6">
            <DoctorIncentiveMapping />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
