import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FlaskConical, 
  Microscope, 
  BarChart3, 
  AlertTriangle,
  Clock,
  CheckCircle,
  Users,
  Calendar,
  Settings,
  FileText,
  Scan,
  Target,
  Bell,
  TrendingUp,
  Package
} from 'lucide-react';
import { SampleTracking } from './SampleTracking';
import { TestRequisition } from './TestRequisition';
import { SpecimenCollection } from './SpecimenCollection';
import { QualityControl } from './QualityControl';
import { ResultEntry } from './ResultEntry';
import { EquipmentManagement } from './EquipmentManagement';
import { CriticalValueAlerts } from './CriticalValueAlerts';
import { ReportGeneration } from './ReportGeneration';
import { ReferenceRangeManagement } from './ReferenceRangeManagement';
import { LabEfficiencyDashboard } from './LabEfficiencyDashboard';
import { InventoryManagement } from './InventoryManagement';

export const LIMSDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const limsMetrics = {
    samplesInProgress: 324,
    testsCompleted: 1567,
    pendingResults: 89,
    criticalAlerts: 7,
    equipmentActive: 23,
    qualityControlPassed: 98.5,
    averageTurnaroundTime: 4.2,
    dailyVolume: 456
  };

  const recentAlerts = [
    {
      type: 'Critical Result',
      sample: 'LAB001234',
      test: 'Troponin I',
      value: '12.5 ng/mL',
      priority: 'high',
      timestamp: '14:30'
    },
    {
      type: 'QC Failure',
      equipment: 'Analyzer-03',
      test: 'Chemistry Panel',
      issue: 'Control out of range',
      priority: 'medium',
      timestamp: '13:45'
    },
    {
      type: 'Equipment Alert',
      equipment: 'Centrifuge-02',
      issue: 'Maintenance due',
      priority: 'low',
      timestamp: '12:15'
    }
  ];

  const workflowStatus = [
    { stage: 'Collection', count: 45, color: 'blue' },
    { stage: 'Processing', count: 128, color: 'yellow' },
    { stage: 'Analysis', count: 89, color: 'purple' },
    { stage: 'Review', count: 34, color: 'orange' },
    { stage: 'Complete', count: 267, color: 'green' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Laboratory Information System</h1>
          <p className="text-gray-600 mt-2">Comprehensive lab management and workflow automation</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Scan className="h-4 w-4" />
            Barcode Scanner
          </Button>
          <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
            <FlaskConical className="h-4 w-4" />
            New Sample
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-12 gap-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="samples">Samples</TabsTrigger>
          <TabsTrigger value="requisition">Requisition</TabsTrigger>
          <TabsTrigger value="collection">Collection</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
          <TabsTrigger value="alerts">Critical Alerts</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="ranges">Ref Ranges</TabsTrigger>
          <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <FlaskConical className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-900">{limsMetrics.samplesInProgress}</p>
                    <p className="text-sm text-blue-700">Samples in Progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-900">{limsMetrics.testsCompleted}</p>
                    <p className="text-sm text-green-700">Tests Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold text-red-900">{limsMetrics.criticalAlerts}</p>
                    <p className="text-sm text-red-700">Critical Alerts</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-purple-900">{limsMetrics.qualityControlPassed}%</p>
                    <p className="text-sm text-purple-700">QC Pass Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Workflow Status */}
          <Card>
            <CardHeader>
              <CardTitle>Sample Workflow Status</CardTitle>
              <CardDescription>Current distribution of samples across workflow stages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-4">
                {workflowStatus.map((status, index) => (
                  <div key={index} className="text-center">
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-2 ${
                      status.color === 'blue' ? 'bg-blue-500' :
                      status.color === 'yellow' ? 'bg-yellow-500' :
                      status.color === 'purple' ? 'bg-purple-500' :
                      status.color === 'orange' ? 'bg-orange-500' : 'bg-green-500'
                    } text-white`}>
                      <span className="text-xl font-bold">{status.count}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{status.stage}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
              <CardDescription>Latest system alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentAlerts.map((alert, index) => (
                  <div key={index} className={`flex items-center gap-4 p-3 border-l-4 rounded ${
                    alert.priority === 'high' ? 'border-l-red-500 bg-red-50' :
                    alert.priority === 'medium' ? 'border-l-yellow-500 bg-yellow-50' : 'border-l-blue-500 bg-blue-50'
                  }`}>
                    <AlertTriangle className={`h-5 w-5 ${
                      alert.priority === 'high' ? 'text-red-600' :
                      alert.priority === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                    }`} />
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">{alert.type}</h5>
                      <p className="text-sm text-gray-600">
                        {alert.sample && `Sample: ${alert.sample} - `}
                        {alert.equipment && `Equipment: ${alert.equipment} - `}
                        {alert.test} {alert.value && `(${alert.value})`}
                      </p>
                      <p className="text-xs text-gray-500">{alert.timestamp}</p>
                    </div>
                    <Badge variant="outline" className={`${
                      alert.priority === 'high' ? 'border-red-500 text-red-700' :
                      alert.priority === 'medium' ? 'border-yellow-500 text-yellow-700' : 'border-blue-500 text-blue-700'
                    }`}>
                      {alert.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-xl font-bold text-gray-900">{limsMetrics.averageTurnaroundTime}h</p>
                <p className="text-sm text-gray-600">Avg TAT</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-xl font-bold text-gray-900">{limsMetrics.pendingResults}</p>
                <p className="text-sm text-gray-600">Pending Results</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Settings className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-xl font-bold text-gray-900">{limsMetrics.equipmentActive}</p>
                <p className="text-sm text-gray-600">Active Equipment</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <p className="text-xl font-bold text-gray-900">{limsMetrics.dailyVolume}</p>
                <p className="text-sm text-gray-600">Daily Volume</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="samples">
          <SampleTracking />
        </TabsContent>

        <TabsContent value="requisition">
          <TestRequisition />
        </TabsContent>

        <TabsContent value="collection">
          <SpecimenCollection />
        </TabsContent>

        <TabsContent value="quality">
          <QualityControl />
        </TabsContent>

        <TabsContent value="results">
          <ResultEntry />
        </TabsContent>

        <TabsContent value="equipment">
          <EquipmentManagement />
        </TabsContent>

        <TabsContent value="alerts">
          <CriticalValueAlerts />
        </TabsContent>

        <TabsContent value="reports">
          <ReportGeneration />
        </TabsContent>

        <TabsContent value="ranges">
          <ReferenceRangeManagement />
        </TabsContent>

        <TabsContent value="efficiency">
          <LabEfficiencyDashboard />
        </TabsContent>

        <TabsContent value="inventory">
          <InventoryManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};
