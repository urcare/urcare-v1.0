
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  MapPin,
  FileText,
  BarChart3,
  Shield,
  Globe,
  Activity,
  Target
} from 'lucide-react';
import { DiseaseSurveillance } from './DiseaseSurveillance';
import { OutbreakDetection } from './OutbreakDetection';
import { EpidemiologicalAnalysis } from './EpidemiologicalAnalysis';
import { CommunityHealthMetrics } from './CommunityHealthMetrics';
import { RegulatoryReporting } from './RegulatoryReporting';
import { GeographicVisualization } from './GeographicVisualization';

export const PublicHealthDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const publicHealthMetrics = {
    activeCases: 1247,
    newCasesToday: 23,
    outbreakAlerts: 3,
    surveillanceReports: 156,
    vaccinationRate: 78.5,
    communityRisk: 'Medium',
    reportingCompliance: 95.8,
    populationCoverage: 89.2
  };

  const activeOutbreaks = [
    {
      disease: 'Influenza A',
      location: 'Downtown District',
      cases: 45,
      trend: 'increasing',
      riskLevel: 'high',
      lastUpdate: '2024-01-20'
    },
    {
      disease: 'Norovirus',
      location: 'University Campus',
      cases: 28,
      trend: 'stable',
      riskLevel: 'medium',
      lastUpdate: '2024-01-20'
    },
    {
      disease: 'COVID-19',
      location: 'Nursing Home',
      cases: 12,
      trend: 'decreasing',
      riskLevel: 'medium',
      lastUpdate: '2024-01-19'
    }
  ];

  const surveillanceAlerts = [
    {
      type: 'Threshold Exceeded',
      disease: 'Respiratory Illness',
      metric: 'Weekly cases above baseline',
      severity: 'warning',
      timestamp: '2024-01-20 14:30'
    },
    {
      type: 'Cluster Detection',
      disease: 'Gastrointestinal Illness',
      metric: 'Spatial clustering identified',
      severity: 'high',
      timestamp: '2024-01-20 12:15'
    },
    {
      type: 'Reporting Delay',
      disease: 'Multiple',
      metric: 'Late submissions detected',
      severity: 'medium',
      timestamp: '2024-01-20 09:45'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Public Health Integration</h1>
          <p className="text-gray-600 mt-2">Disease surveillance, outbreak detection, and epidemiological analysis</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Generate Report
          </Button>
          <Button className="flex items-center gap-2 bg-red-600 hover:bg-red-700">
            <AlertTriangle className="h-4 w-4" />
            Emergency Alert
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="surveillance">Surveillance</TabsTrigger>
          <TabsTrigger value="outbreaks">Outbreaks</TabsTrigger>
          <TabsTrigger value="epidemiology">Epidemiology</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
          <TabsTrigger value="reporting">Reporting</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Activity className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-900">{publicHealthMetrics.activeCases}</p>
                    <p className="text-sm text-blue-700">Active Cases</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold text-red-900">{publicHealthMetrics.outbreakAlerts}</p>
                    <p className="text-sm text-red-700">Outbreak Alerts</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-900">{publicHealthMetrics.vaccinationRate}%</p>
                    <p className="text-sm text-green-700">Vaccination Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-purple-900">{publicHealthMetrics.reportingCompliance}%</p>
                    <p className="text-sm text-purple-700">Compliance Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Outbreaks */}
          <Card>
            <CardHeader>
              <CardTitle>Active Outbreaks</CardTitle>
              <CardDescription>Current disease outbreaks requiring monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeOutbreaks.map((outbreak, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
                    <div className={`w-3 h-3 rounded-full ${
                      outbreak.riskLevel === 'high' ? 'bg-red-500' :
                      outbreak.riskLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{outbreak.disease}</h4>
                      <p className="text-sm text-gray-600">{outbreak.location} • {outbreak.cases} cases</p>
                      <p className="text-xs text-gray-500">Last updated: {outbreak.lastUpdate}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={`${
                        outbreak.trend === 'increasing' ? 'bg-red-500' :
                        outbreak.trend === 'stable' ? 'bg-yellow-500' : 'bg-green-500'
                      } text-white`}>
                        {outbreak.trend}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">{outbreak.riskLevel} risk</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Surveillance Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Surveillance Alerts</CardTitle>
              <CardDescription>Recent automated surveillance system alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {surveillanceAlerts.map((alert, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 border-l-4 border-l-red-500 bg-red-50 rounded">
                    <AlertTriangle className={`h-5 w-5 ${
                      alert.severity === 'high' ? 'text-red-600' :
                      alert.severity === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                    }`} />
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">{alert.type}</h5>
                      <p className="text-sm text-gray-600">{alert.disease} - {alert.metric}</p>
                      <p className="text-xs text-gray-500">{alert.timestamp}</p>
                    </div>
                    <Badge variant="outline" className={`${
                      alert.severity === 'high' ? 'border-red-500 text-red-700' :
                      alert.severity === 'warning' ? 'border-yellow-500 text-yellow-700' : 'border-blue-500 text-blue-700'
                    }`}>
                      {alert.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-xl font-bold text-gray-900">+{publicHealthMetrics.newCasesToday}</p>
                <p className="text-sm text-gray-600">New Cases Today</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <BarChart3 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-xl font-bold text-gray-900">{publicHealthMetrics.surveillanceReports}</p>
                <p className="text-sm text-gray-600">Reports This Month</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-xl font-bold text-gray-900">{publicHealthMetrics.populationCoverage}%</p>
                <p className="text-sm text-gray-600">Population Coverage</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Target className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <p className="text-xl font-bold text-gray-900">{publicHealthMetrics.communityRisk}</p>
                <p className="text-sm text-gray-600">Community Risk</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="surveillance">
          <DiseaseSurveillance />
        </TabsContent>

        <TabsContent value="outbreaks">
          <OutbreakDetection />
        </TabsContent>

        <TabsContent value="epidemiology">
          <EpidemiologicalAnalysis />
        </TabsContent>

        <TabsContent value="community">
          <CommunityHealthMetrics />
        </TabsContent>

        <TabsContent value="reporting">
          <RegulatoryReporting />
        </TabsContent>
      </Tabs>
    </div>
  );
};
