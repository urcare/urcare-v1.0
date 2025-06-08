
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  BarChart3, 
  Users, 
  Calendar,
  Target,
  Activity,
  Globe,
  FileText
} from 'lucide-react';

export const EpidemiologicalAnalysis = () => {
  const [analysisType, setAnalysisType] = useState('trends');
  const [timeRange, setTimeRange] = useState('30days');

  const epidemiologyMetrics = {
    incidenceRate: 15.4,
    prevalenceRate: 234.7,
    mortalityRate: 0.8,
    reproductionNumber: 1.3,
    peakCases: 89,
    trendDirection: 'increasing'
  };

  const diseaseAnalysis = [
    {
      disease: 'Influenza A',
      incidence: 25.6,
      prevalence: 145.2,
      trend: 'increasing',
      riskGroups: ['Elderly', 'Immunocompromised', 'Pregnant women'],
      seasonality: 'Winter peak',
      transmissionMode: 'Respiratory droplets',
      reproductionNumber: 1.8
    },
    {
      disease: 'COVID-19',
      incidence: 12.3,
      prevalence: 89.5,
      trend: 'stable',
      riskGroups: ['Elderly', 'Chronic conditions'],
      seasonality: 'Year-round',
      transmissionMode: 'Airborne',
      reproductionNumber: 1.1
    },
    {
      disease: 'Norovirus',
      incidence: 8.7,
      prevalence: 34.8,
      trend: 'increasing',
      riskGroups: ['Young children', 'Elderly'],
      seasonality: 'Winter/Spring',
      transmissionMode: 'Fecal-oral',
      reproductionNumber: 2.1
    }
  ];

  const demographicData = [
    { ageGroup: '0-4', cases: 23, rate: 4.6, population: 5000 },
    { ageGroup: '5-17', cases: 45, rate: 3.8, population: 12000 },
    { ageGroup: '18-44', cases: 156, rate: 8.2, population: 19000 },
    { ageGroup: '45-64', cases: 89, rate: 12.4, population: 7200 },
    { ageGroup: '65+', cases: 67, rate: 18.6, population: 3600 }
  ];

  const riskFactorAnalysis = [
    {
      factor: 'Age ≥65',
      oddsRatio: 3.2,
      confidenceInterval: '2.1-4.8',
      pValue: '<0.001',
      significance: 'High'
    },
    {
      factor: 'Chronic Disease',
      oddsRatio: 2.1,
      confidenceInterval: '1.5-2.9',
      pValue: '0.003',
      significance: 'Medium'
    },
    {
      factor: 'Immunocompromised',
      oddsRatio: 2.8,
      confidenceInterval: '1.8-4.3',
      pValue: '<0.001',
      significance: 'High'
    },
    {
      factor: 'Healthcare Worker',
      oddsRatio: 1.6,
      confidenceInterval: '1.1-2.3',
      pValue: '0.015',
      significance: 'Low'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Epidemiological Analysis</h2>
          <p className="text-gray-600">Statistical analysis and trend identification</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Export Report
          </Button>
          <Button className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Advanced Analytics
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-900">{epidemiologyMetrics.incidenceRate}</p>
            <p className="text-sm text-blue-700">Incidence Rate</p>
            <p className="text-xs text-blue-600">per 100k</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-900">{epidemiologyMetrics.prevalenceRate}</p>
            <p className="text-sm text-green-700">Prevalence Rate</p>
            <p className="text-xs text-green-600">per 100k</p>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-900">{epidemiologyMetrics.mortalityRate}</p>
            <p className="text-sm text-red-700">Mortality Rate</p>
            <p className="text-xs text-red-600">per 100k</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4 text-center">
            <Activity className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-900">{epidemiologyMetrics.reproductionNumber}</p>
            <p className="text-sm text-orange-700">R-number</p>
            <p className="text-xs text-orange-600">reproduction</p>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4 text-center">
            <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-900">{epidemiologyMetrics.peakCases}</p>
            <p className="text-sm text-purple-700">Peak Cases</p>
            <p className="text-xs text-purple-600">daily max</p>
          </CardContent>
        </Card>
        <Card className="border-teal-200 bg-teal-50">
          <CardContent className="p-4 text-center">
            <Globe className="h-8 w-8 text-teal-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-teal-900 capitalize">{epidemiologyMetrics.trendDirection}</p>
            <p className="text-sm text-teal-700">Trend</p>
            <p className="text-xs text-teal-600">direction</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={analysisType} onValueChange={setAnalysisType} className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="demographics">Demographics</TabsTrigger>
            <TabsTrigger value="risk">Risk Factors</TabsTrigger>
            <TabsTrigger value="diseases">Diseases</TabsTrigger>
          </TabsList>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">7 Days</SelectItem>
              <SelectItem value="30days">30 Days</SelectItem>
              <SelectItem value="90days">90 Days</SelectItem>
              <SelectItem value="1year">1 Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trend Analysis</CardTitle>
              <CardDescription>Statistical trends and forecasting</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Trend visualization would be displayed here</p>
                  <p className="text-sm text-gray-400">Interactive charts showing disease patterns over time</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Demographic Analysis</CardTitle>
              <CardDescription>Age-stratified disease burden analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {demographicData.map((group, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="w-16 text-center">
                        <p className="font-semibold text-gray-900">{group.ageGroup}</p>
                        <p className="text-xs text-gray-500">years</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{group.cases} cases</p>
                        <p className="text-sm text-gray-600">Population: {group.population.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{group.rate}</p>
                      <p className="text-sm text-gray-600">per 100k</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Risk Factor Analysis</CardTitle>
              <CardDescription>Statistical associations and odds ratios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskFactorAnalysis.map((factor, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{factor.factor}</h4>
                      <Badge className={`${
                        factor.significance === 'High' ? 'bg-red-500' :
                        factor.significance === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                      } text-white`}>
                        {factor.significance}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Odds Ratio</p>
                        <p className="font-bold text-gray-900">{factor.oddsRatio}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">95% CI</p>
                        <p className="font-bold text-gray-900">{factor.confidenceInterval}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">P-value</p>
                        <p className="font-bold text-gray-900">{factor.pValue}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diseases" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Disease-Specific Analysis</CardTitle>
              <CardDescription>Detailed epidemiological characteristics by disease</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {diseaseAnalysis.map((disease, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">{disease.disease}</h4>
                      <Badge className={`${
                        disease.trend === 'increasing' ? 'bg-red-500' :
                        disease.trend === 'stable' ? 'bg-yellow-500' : 'bg-green-500'
                      } text-white`}>
                        {disease.trend}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-gray-600">Incidence</p>
                        <p className="font-bold text-gray-900">{disease.incidence}/100k</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Prevalence</p>
                        <p className="font-bold text-gray-900">{disease.prevalence}/100k</p>
                      </div>
                      <div>
                        <p className="text-gray-600">R-number</p>
                        <p className="font-bold text-gray-900">{disease.reproductionNumber}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Seasonality</p>
                        <p className="font-bold text-gray-900">{disease.seasonality}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 mb-1">Risk Groups:</p>
                        <div className="flex flex-wrap gap-1">
                          {disease.riskGroups.map((group, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {group}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-600">Transmission:</p>
                        <p className="font-medium text-gray-900">{disease.transmissionMode}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
