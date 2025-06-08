
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Shield, 
  Users, 
  Settings,
  Download,
  Calendar,
  Target,
  Activity
} from 'lucide-react';
import { TestVolumeAnalytics } from './TestVolumeAnalytics';
import { RevenueAnalytics } from './RevenueAnalytics';
import { QualityMetricsDashboard } from './QualityMetricsDashboard';
import { ComplianceReportingDashboard } from './ComplianceReportingDashboard';
import { StaffProductivityAnalytics } from './StaffProductivityAnalytics';
import { EquipmentUtilizationDashboard } from './EquipmentUtilizationDashboard';

export const LabAnalyticsDashboard = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');

  const analyticsOverview = {
    testVolume: {
      current: 12567,
      previous: 11245,
      trend: '+11.8%',
      status: 'up'
    },
    revenue: {
      current: 485600,
      previous: 467200,
      trend: '+3.9%',
      status: 'up'
    },
    qualityScore: {
      current: 96.8,
      previous: 95.2,
      trend: '+1.6%',
      status: 'up'
    },
    complianceRate: {
      current: 98.5,
      previous: 97.8,
      trend: '+0.7%',
      status: 'up'
    },
    staffEfficiency: {
      current: 87.3,
      previous: 85.6,
      trend: '+1.7%',
      status: 'up'
    },
    equipmentUtilization: {
      current: 78.9,
      previous: 76.4,
      trend: '+2.5%',
      status: 'up'
    }
  };

  const keyInsights = [
    {
      title: 'Peak Testing Hours',
      insight: 'Highest volume occurs between 10 AM - 2 PM',
      recommendation: 'Consider staffing adjustments during peak hours',
      impact: 'high',
      category: 'operational'
    },
    {
      title: 'Revenue Opportunity',
      insight: 'Molecular testing showing 25% growth potential',
      recommendation: 'Expand molecular testing capabilities',
      impact: 'high',
      category: 'financial'
    },
    {
      title: 'Quality Improvement',
      insight: 'Hematology QC passing rate at 99.2%',
      recommendation: 'Share best practices across departments',
      impact: 'medium',
      category: 'quality'
    },
    {
      title: 'Equipment Efficiency',
      insight: 'Analyzer-05 showing 15% higher throughput',
      recommendation: 'Optimize workflow for other analyzers',
      impact: 'medium',
      category: 'efficiency'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lab Analytics & Reporting</h2>
          <p className="text-gray-600">Comprehensive laboratory performance analysis and insights</p>
        </div>
        <div className="flex gap-3">
          <select 
            value={selectedTimeframe} 
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Analytics
          </Button>
          <Button className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configure KPIs
          </Button>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-900">{analyticsOverview.testVolume.current.toLocaleString()}</p>
            <p className="text-sm text-blue-700">Test Volume</p>
            <Badge variant="outline" className="mt-1 border-green-500 text-green-700 text-xs">
              {analyticsOverview.testVolume.trend}
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-900">${analyticsOverview.revenue.current.toLocaleString()}</p>
            <p className="text-sm text-green-700">Revenue</p>
            <Badge variant="outline" className="mt-1 border-green-500 text-green-700 text-xs">
              {analyticsOverview.revenue.trend}
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-900">{analyticsOverview.qualityScore.current}%</p>
            <p className="text-sm text-purple-700">Quality Score</p>
            <Badge variant="outline" className="mt-1 border-green-500 text-green-700 text-xs">
              {analyticsOverview.qualityScore.trend}
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4 text-center">
            <Shield className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-900">{analyticsOverview.complianceRate.current}%</p>
            <p className="text-sm text-orange-700">Compliance</p>
            <Badge variant="outline" className="mt-1 border-green-500 text-green-700 text-xs">
              {analyticsOverview.complianceRate.trend}
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-indigo-200 bg-indigo-50">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-indigo-900">{analyticsOverview.staffEfficiency.current}%</p>
            <p className="text-sm text-indigo-700">Staff Efficiency</p>
            <Badge variant="outline" className="mt-1 border-green-500 text-green-700 text-xs">
              {analyticsOverview.staffEfficiency.trend}
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-teal-200 bg-teal-50">
          <CardContent className="p-4 text-center">
            <Activity className="h-8 w-8 text-teal-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-teal-900">{analyticsOverview.equipmentUtilization.current}%</p>
            <p className="text-sm text-teal-700">Equipment Utilization</p>
            <Badge variant="outline" className="mt-1 border-green-500 text-green-700 text-xs">
              {analyticsOverview.equipmentUtilization.trend}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Key Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Key Insights & Recommendations</CardTitle>
          <CardDescription>AI-driven insights and actionable recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {keyInsights.map((insight, index) => (
              <div key={index} className={`border rounded-lg p-4 ${
                insight.impact === 'high' ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                  <div className="flex gap-1">
                    <Badge variant="outline" className="text-xs">
                      {insight.category}
                    </Badge>
                    <Badge className={`text-xs ${
                      insight.impact === 'high' ? 'bg-red-500' : 'bg-yellow-500'
                    } text-white`}>
                      {insight.impact}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-2">{insight.insight}</p>
                <p className="text-sm font-medium text-gray-900">{insight.recommendation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="test-volume" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="test-volume">Test Volume</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
        </TabsList>

        <TabsContent value="test-volume">
          <TestVolumeAnalytics />
        </TabsContent>

        <TabsContent value="revenue">
          <RevenueAnalytics />
        </TabsContent>

        <TabsContent value="quality">
          <QualityMetricsDashboard />
        </TabsContent>

        <TabsContent value="compliance">
          <ComplianceReportingDashboard />
        </TabsContent>

        <TabsContent value="staff">
          <StaffProductivityAnalytics />
        </TabsContent>

        <TabsContent value="equipment">
          <EquipmentUtilizationDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};
