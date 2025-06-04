import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WastePickupInterface } from './WastePickupInterface';
import { WasteCategorization } from './WasteCategorization';
import { ChainOfCustodyTracking } from './ChainOfCustodyTracking';
import { SOPComplianceDashboard } from './SOPComplianceDashboard';
import { AuditReporting } from './AuditReporting';
import { CertificateManagement } from './CertificateManagement';
import { 
  Trash2, 
  QrCode, 
  Tags, 
  FileText,
  ClipboardCheck,
  Award,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';

export const BioWasteManagementDashboard = () => {
  const [activeTab, setActiveTab] = useState('pickup');

  const wasteStats = [
    { label: 'Today\'s Pickups', value: '24', icon: Trash2, color: 'blue' },
    { label: 'Pending Collection', value: '8', icon: AlertTriangle, color: 'yellow' },
    { label: 'Compliance Score', value: '98%', icon: TrendingUp, color: 'green' },
    { label: 'Active Certificates', value: '12', icon: Award, color: 'purple' }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Bio-Waste Management</h1>
                <p className="text-sm text-gray-600">Complete waste tracking and compliance system</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {wasteStats.map((stat, index) => (
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
            <TabsTrigger value="pickup" className="flex items-center gap-2">
              <QrCode className="w-4 h-4" />
              <span className="hidden sm:inline">Pickup</span>
            </TabsTrigger>
            <TabsTrigger value="categorization" className="flex items-center gap-2">
              <Tags className="w-4 h-4" />
              <span className="hidden sm:inline">Categories</span>
            </TabsTrigger>
            <TabsTrigger value="custody" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Chain of Custody</span>
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4" />
              <span className="hidden sm:inline">SOP Compliance</span>
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span className="hidden sm:inline">Audit Reports</span>
            </TabsTrigger>
            <TabsTrigger value="certificates" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span className="hidden sm:inline">Certificates</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pickup" className="space-y-6">
            <WastePickupInterface />
          </TabsContent>

          <TabsContent value="categorization" className="space-y-6">
            <WasteCategorization />
          </TabsContent>

          <TabsContent value="custody" className="space-y-6">
            <ChainOfCustodyTracking />
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <SOPComplianceDashboard />
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <AuditReporting />
          </TabsContent>

          <TabsContent value="certificates" className="space-y-6">
            <CertificateManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
