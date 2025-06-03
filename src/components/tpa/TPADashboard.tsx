
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClaimLifecycleDashboard } from './ClaimLifecycleDashboard';
import { PreAuthorizationForm } from './PreAuthorizationForm';
import { ClaimRejectionPredictor } from './ClaimRejectionPredictor';
import { DelayPenaltyEngine } from './DelayPenaltyEngine';
import { BulkBillingSystem } from './BulkBillingSystem';
import { MultiLingualBilling } from './MultiLingualBilling';
import { 
  Shield, 
  FileText, 
  Brain, 
  AlertTriangle,
  Users,
  Globe
} from 'lucide-react';

export const TPADashboard = () => {
  const [activeTab, setActiveTab] = useState('claims');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">TPA & Insurance Management</h1>
                <p className="text-sm text-gray-600">Complete claims and insurance workflow management</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-6 w-full mb-6">
            <TabsTrigger value="claims" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Claims</span>
            </TabsTrigger>
            <TabsTrigger value="preauth" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Pre-Auth</span>
            </TabsTrigger>
            <TabsTrigger value="predictor" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline">AI Predictor</span>
            </TabsTrigger>
            <TabsTrigger value="penalties" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="hidden sm:inline">Penalties</span>
            </TabsTrigger>
            <TabsTrigger value="bulk" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Bulk Billing</span>
            </TabsTrigger>
            <TabsTrigger value="multilingual" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">Multi-Lingual</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="claims" className="space-y-6">
            <ClaimLifecycleDashboard />
          </TabsContent>

          <TabsContent value="preauth" className="space-y-6">
            <PreAuthorizationForm />
          </TabsContent>

          <TabsContent value="predictor" className="space-y-6">
            <ClaimRejectionPredictor />
          </TabsContent>

          <TabsContent value="penalties" className="space-y-6">
            <DelayPenaltyEngine />
          </TabsContent>

          <TabsContent value="bulk" className="space-y-6">
            <BulkBillingSystem />
          </TabsContent>

          <TabsContent value="multilingual" className="space-y-6">
            <MultiLingualBilling />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
