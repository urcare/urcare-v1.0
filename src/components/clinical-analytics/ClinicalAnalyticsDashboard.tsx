
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Heart, 
  TrendingUp, 
  AlertTriangle,
  Shield,
  Download,
  Filter,
  BarChart3,
  Stethoscope
} from 'lucide-react';
import { OutcomeTrendCharts } from './OutcomeTrendCharts';
import { ReadmissionHeatMap } from './ReadmissionHeatMap';
import { QualityIndicatorScorecard } from './QualityIndicatorScorecard';
import { ClinicalPathwayVisualization } from './ClinicalPathwayVisualization';
import { PatientJourneyMapping } from './PatientJourneyMapping';
import { ClinicalMetricsOverview } from './ClinicalMetricsOverview';
import { ClinicalAlertsPanel } from './ClinicalAlertsPanel';

interface ClinicalMetrics {
  mortalityRate: number;
  readmissionRate: number;
  infectionRate: number;
  avgLengthOfStay: number;
  qualityScore: number;
  patientSatisfaction: number;
}

const mockMetrics: ClinicalMetrics = {
  mortalityRate: 2.1,
  readmissionRate: 8.5,
  infectionRate: 1.2,
  avgLengthOfStay: 4.8,
  qualityScore: 92,
  patientSatisfaction: 88
};

export const ClinicalAnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [metrics] = useState<ClinicalMetrics>(mockMetrics);
  const [selectedTimeframe, setSelectedTimeframe] = useState('last30days');

  const handleExportReport = (format: 'pdf' | 'excel') => {
    console.log(`Exporting clinical ${format} report for ${selectedTimeframe}`);
    // Implementation would call backend API
  };

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-6 w-6 text-blue-600" />
                Clinical Analytics Dashboard
              </CardTitle>
              <CardDescription>
                Medical performance monitoring and clinical outcome analysis
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => handleExportReport('pdf')}>
                <Download className="h-4 w-4 mr-1" />
                Export PDF
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExportReport('excel')}>
                <Download className="h-4 w-4 mr-1" />
                Export Excel
              </Button>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                HIPAA Compliant
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ClinicalAlertsPanel />
        </CardContent>
      </Card>

      <ClinicalMetricsOverview metrics={metrics} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 lg:grid-cols-5 w-full">
          <TabsTrigger value="overview" className="flex items-center gap-2 text-xs lg:text-sm">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="outcomes" className="flex items-center gap-2 text-xs lg:text-sm">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Outcomes</span>
          </TabsTrigger>
          <TabsTrigger value="readmissions" className="flex items-center gap-2 text-xs lg:text-sm">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Readmissions</span>
          </TabsTrigger>
          <TabsTrigger value="quality" className="flex items-center gap-2 text-xs lg:text-sm">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Quality</span>
          </TabsTrigger>
          <TabsTrigger value="pathways" className="flex items-center gap-2 text-xs lg:text-sm">
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Pathways</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Clinical Performance Summary</CardTitle>
                <CardDescription>Key performance indicators vs. benchmarks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Mortality Rate</span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">{metrics.mortalityRate}%</p>
                      <p className="text-xs text-gray-500">vs 2.8% benchmark</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Quality Score</span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">{metrics.qualityScore}%</p>
                      <p className="text-xs text-gray-500">vs 85% benchmark</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                      <span className="font-medium">Infection Rate</span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-orange-600">{metrics.infectionRate}%</p>
                      <p className="text-xs text-gray-500">vs 2.1% benchmark</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regulatory Compliance Status</CardTitle>
                <CardDescription>Current compliance with healthcare standards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium">Joint Commission</span>
                    </div>
                    <Badge className="bg-green-500 text-white">Compliant</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium">CMS Core Measures</span>
                    </div>
                    <Badge className="bg-green-500 text-white">Compliant</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="font-medium">HIPAA Audit</span>
                    </div>
                    <Badge className="bg-yellow-500 text-white">Review</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="outcomes" className="space-y-6">
          <OutcomeTrendCharts timeframe={selectedTimeframe} />
        </TabsContent>

        <TabsContent value="readmissions" className="space-y-6">
          <ReadmissionHeatMap timeframe={selectedTimeframe} />
        </TabsContent>

        <TabsContent value="quality" className="space-y-6">
          <QualityIndicatorScorecard timeframe={selectedTimeframe} />
        </TabsContent>

        <TabsContent value="pathways" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <ClinicalPathwayVisualization />
            <PatientJourneyMapping />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
