
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InsuranceWalletView } from './InsuranceWalletView';
import { AutoPriceTag } from './AutoPriceTag';
import { GSTVATEngine } from './GSTVATEngine';
import { PaymentGatewayIntegration } from './PaymentGatewayIntegration';
import { InsuranceVerificationSystem } from './InsuranceVerificationSystem';
import { CoPaymentCalculator } from './CoPaymentCalculator';
import { 
  Shield, 
  Calculator, 
  Receipt, 
  CreditCard,
  CheckCircle,
  Percent
} from 'lucide-react';

export const InsurancePaymentDashboard = () => {
  const [activeTab, setActiveTab] = useState('wallet');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Insurance & Payment Tools</h1>
                <p className="text-sm text-gray-600">Comprehensive insurance management and payment processing</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-6 w-full mb-6">
            <TabsTrigger value="wallet" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Wallet</span>
            </TabsTrigger>
            <TabsTrigger value="pricing" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              <span className="hidden sm:inline">Pricing</span>
            </TabsTrigger>
            <TabsTrigger value="tax" className="flex items-center gap-2">
              <Receipt className="w-4 h-4" />
              <span className="hidden sm:inline">Tax Engine</span>
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Payments</span>
            </TabsTrigger>
            <TabsTrigger value="verification" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Verification</span>
            </TabsTrigger>
            <TabsTrigger value="copay" className="flex items-center gap-2">
              <Percent className="w-4 h-4" />
              <span className="hidden sm:inline">Co-Pay</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wallet" className="space-y-6">
            <InsuranceWalletView />
          </TabsContent>

          <TabsContent value="pricing" className="space-y-6">
            <AutoPriceTag />
          </TabsContent>

          <TabsContent value="tax" className="space-y-6">
            <GSTVATEngine />
          </TabsContent>

          <TabsContent value="payment" className="space-y-6">
            <PaymentGatewayIntegration />
          </TabsContent>

          <TabsContent value="verification" className="space-y-6">
            <InsuranceVerificationSystem />
          </TabsContent>

          <TabsContent value="copay" className="space-y-6">
            <CoPaymentCalculator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
