
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataClassificationInterface } from './DataClassificationInterface';
import { DataRetentionDashboard } from './DataRetentionDashboard';
import { DataQualityMonitoring } from './DataQualityMonitoring';
import { MasterDataManagement } from './MasterDataManagement';
import { DataLineageVisualization } from './DataLineageVisualization';
import { PrivacyByDesignInterface } from './PrivacyByDesignInterface';
import { 
  Database,
  Shield,
  Activity,
  GitBranch,
  Eye,
  Lock,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  TrendingUp
} from 'lucide-react';

export const DataGovernanceDashboard = () => {
  const [activeTab, setActiveTab] = useState('classification');
  const [governanceMetrics, setGovernanceMetrics] = useState({
    totalDatasets: 15847,
    classifiedData: 89.2,
    retentionCompliance: 96.8,
    dataQualityScore: 92.4,
    masterRecords: 2847,
    privacyCompliance: 94.7,
    governanceMaturity: 85.3,
    activeAlerts: 12
  });

  const governanceTabs = [
    {
      id: 'classification',
      title: 'Data Classification',
      icon: Database,
      component: DataClassificationInterface,
      description: 'Automated data discovery and classification'
    },
    {
      id: 'retention',
      title: 'Data Retention',
      icon: Activity,
      component: DataRetentionDashboard,
      description: 'Lifecycle management and disposal policies'
    },
    {
      id: 'quality',
      title: 'Data Quality',
      icon: BarChart3,
      component: DataQualityMonitoring,
      description: 'Quality metrics and monitoring'
    },
    {
      id: 'master-data',
      title: 'Master Data',
      icon: Shield,
      component: MasterDataManagement,
      description: 'Golden record and stewardship workflows'
    },
    {
      id: 'lineage',
      title: 'Data Lineage',
      icon: GitBranch,
      component: DataLineageVisualization,
      description: 'Impact analysis and dependency tracking'
    },
    {
      id: 'privacy-design',
      title: 'Privacy by Design',
      icon: Lock,
      component: PrivacyByDesignInterface,
      description: 'Privacy patterns and compliance verification'
    }
  ];

  useEffect(() => {
    // Simulate real-time governance updates
    const interval = setInterval(() => {
      setGovernanceMetrics(prev => ({
        ...prev,
        classifiedData: Math.min(100, prev.classifiedData + Math.random() * 0.1),
        dataQualityScore: Math.max(85, prev.dataQualityScore + (Math.random() - 0.5) * 0.5),
        activeAlerts: Math.max(0, prev.activeAlerts + Math.floor(Math.random() * 3) - 1)
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Database className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-bold">Data Governance</h1>
      </div>

      {/* Governance Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{governanceMetrics.totalDatasets.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Datasets</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{governanceMetrics.classifiedData.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Classified Data</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{governanceMetrics.retentionCompliance.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Retention Compliance</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{governanceMetrics.dataQualityScore.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Data Quality Score</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-teal-600">{governanceMetrics.masterRecords.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Master Records</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-indigo-600">{governanceMetrics.privacyCompliance.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Privacy Compliance</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-cyan-600">{governanceMetrics.governanceMaturity.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Governance Maturity</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{governanceMetrics.activeAlerts}</div>
            <div className="text-sm text-gray-600">Active Alerts</div>
          </CardContent>
        </Card>
      </div>

      {/* Governance Alerts */}
      {governanceMetrics.activeAlerts > 10 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              Data Governance Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-orange-700">
                <AlertTriangle className="h-4 w-4" />
                <span>High number of active governance alerts requiring attention</span>
              </div>
              <div className="flex items-center gap-2 text-orange-700">
                <Eye className="h-4 w-4" />
                <span>Data quality issues detected in critical datasets</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Governance Management Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
          {governanceTabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                <IconComponent className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.title}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {governanceTabs.map((tab) => {
          const ComponentToRender = tab.component;
          return (
            <TabsContent key={tab.id} value={tab.id} className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <tab.icon className="h-5 w-5" />
                    {tab.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600">{tab.description}</p>
                </CardHeader>
                <CardContent>
                  <ComponentToRender />
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};
