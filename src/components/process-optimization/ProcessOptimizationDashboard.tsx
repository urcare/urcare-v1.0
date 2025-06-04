
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SOPComplianceDashboard } from './SOPComplianceDashboard';
import { ResourceAllocationOptimizer } from './ResourceAllocationOptimizer';
import { PatientFlowVisualization } from './PatientFlowVisualization';
import { EquipmentUtilizationPredictor } from './EquipmentUtilizationPredictor';
import { StaffSchedulingOptimizer } from './StaffSchedulingOptimizer';
import { QualityMetricsInterface } from './QualityMetricsInterface';
import { 
  TrendingUp, 
  Settings, 
  Users, 
  Activity, 
  Wrench, 
  Calendar,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Target
} from 'lucide-react';

export const ProcessOptimizationDashboard = () => {
  const [activeTab, setActiveTab] = useState('sop-compliance');

  const optimizationStats = [
    { label: 'Process Efficiency', value: '87%', icon: TrendingUp, color: 'blue' },
    { label: 'SOP Compliance', value: '94%', icon: CheckCircle, color: 'green' },
    { label: 'Resource Utilization', value: '79%', icon: BarChart3, color: 'purple' },
    { label: 'Quality Score', value: '92%', icon: Target, color: 'orange' }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Process Optimization AI</h1>
                <p className="text-sm text-gray-600">Operational excellence enhancement and performance optimization</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {optimizationStats.map((stat, index) => (
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
            <TabsTrigger value="sop-compliance" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span className="hidden sm:inline">SOP</span>
            </TabsTrigger>
            <TabsTrigger value="resource-allocation" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Resources</span>
            </TabsTrigger>
            <TabsTrigger value="patient-flow" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Flow</span>
            </TabsTrigger>
            <TabsTrigger value="equipment" className="flex items-center gap-2">
              <Wrench className="w-4 h-4" />
              <span className="hidden sm:inline">Equipment</span>
            </TabsTrigger>
            <TabsTrigger value="staff-scheduling" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Scheduling</span>
            </TabsTrigger>
            <TabsTrigger value="quality-metrics" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Quality</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sop-compliance" className="space-y-6">
            <SOPComplianceDashboard />
          </TabsContent>

          <TabsContent value="resource-allocation" className="space-y-6">
            <ResourceAllocationOptimizer />
          </TabsContent>

          <TabsContent value="patient-flow" className="space-y-6">
            <PatientFlowVisualization />
          </TabsContent>

          <TabsContent value="equipment" className="space-y-6">
            <EquipmentUtilizationPredictor />
          </TabsContent>

          <TabsContent value="staff-scheduling" className="space-y-6">
            <StaffSchedulingOptimizer />
          </TabsContent>

          <TabsContent value="quality-metrics" className="space-y-6">
            <QualityMetricsInterface />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
