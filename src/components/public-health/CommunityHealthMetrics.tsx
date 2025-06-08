
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Heart, 
  Activity, 
  Shield,
  TrendingUp,
  Target,
  Home,
  Stethoscope,
  Globe,
  BarChart3
} from 'lucide-react';

export const CommunityHealthMetrics = () => {
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [metricType, setMetricType] = useState('overview');

  const communityMetrics = {
    populationHealth: 7.2,
    lifeExpectancy: 78.5,
    infantMortality: 5.2,
    preventableDiseases: 23.4,
    chronicDiseaseRate: 42.8,
    vaccInationCoverage: 85.6,
    healthcareAccess: 78.9,
    healthEquityIndex: 6.8
  };

  const healthIndicators = [
    {
      category: 'Mortality & Morbidity',
      indicators: [
        { name: 'Life Expectancy', value: 78.5, unit: 'years', target: 80.0, trend: 'stable' },
        { name: 'Infant Mortality', value: 5.2, unit: 'per 1,000', target: 4.0, trend: 'improving' },
        { name: 'Premature Death Rate', value: 6.8, unit: 'per 1,000', target: 5.5, trend: 'worsening' },
        { name: 'Cancer Death Rate', value: 158.2, unit: 'per 100k', target: 140.0, trend: 'improving' }
      ]
    },
    {
      category: 'Disease Prevention',
      indicators: [
        { name: 'Vaccination Coverage', value: 85.6, unit: '%', target: 90.0, trend: 'stable' },
        { name: 'Mammography Screening', value: 72.4, unit: '%', target: 80.0, trend: 'improving' },
        { name: 'Colonoscopy Screening', value: 68.9, unit: '%', target: 75.0, trend: 'stable' },
        { name: 'Blood Pressure Control', value: 64.2, unit: '%', target: 70.0, trend: 'improving' }
      ]
    },
    {
      category: 'Social Determinants',
      indicators: [
        { name: 'Food Security', value: 78.3, unit: '%', target: 85.0, trend: 'stable' },
        { name: 'Housing Quality', value: 82.1, unit: '%', target: 90.0, trend: 'improving' },
        { name: 'Healthcare Access', value: 78.9, unit: '%', target: 85.0, trend: 'stable' },
        { name: 'Education Level', value: 89.5, unit: '%', target: 92.0, trend: 'improving' }
      ]
    }
  ];

  const populationData = [
    {
      demographic: 'Children (0-17)',
      population: 24680,
      percentage: 18.5,
      healthScore: 8.2,
      keyIssues: ['Obesity', 'Mental health', 'Vaccine hesitancy'],
      interventions: 3
    },
    {
      demographic: 'Adults (18-64)',
      population: 89450,
      percentage: 67.2,
      healthScore: 7.1,
      keyIssues: ['Chronic disease', 'Substance abuse', 'Work-life balance'],
      interventions: 7
    },
    {
      demographic: 'Seniors (65+)',
      population: 18920,
      percentage: 14.3,
      healthScore: 6.8,
      keyIssues: ['Diabetes', 'Social isolation', 'Medication adherence'],
      interventions: 5
    }
  ];

  const healthEquityMetrics = [
    {
      indicator: 'Healthcare Access',
      overall: 78.9,
      byDemographic: {
        'White': 82.4,
        'Hispanic': 74.6,
        'Black': 71.2,
        'Asian': 85.1,
        'Other': 76.8
      }
    },
    {
      indicator: 'Preventive Care',
      overall: 68.5,
      byDemographic: {
        'White': 73.2,
        'Hispanic': 62.8,
        'Black': 59.4,
        'Asian': 76.9,
        'Other': 65.1
      }
    },
    {
      indicator: 'Health Outcomes',
      overall: 7.2,
      byDemographic: {
        'White': 7.8,
        'Hispanic': 6.9,
        'Black': 6.4,
        'Asian': 8.1,
        'Other': 7.0
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Community Health Metrics</h2>
          <p className="text-gray-600">Population-based health indicators and social determinants</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Public Portal
          </Button>
          <Button className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Community Report
          </Button>
        </div>
      </div>

      {/* Community Health Score */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <Heart className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-900">{communityMetrics.populationHealth}</p>
            <p className="text-sm text-blue-700">Health Score</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-900">{communityMetrics.lifeExpectancy}</p>
            <p className="text-sm text-green-700">Life Expect.</p>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-900">{communityMetrics.infantMortality}</p>
            <p className="text-sm text-red-700">Infant Mort.</p>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4 text-center">
            <Activity className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-900">{communityMetrics.preventableDiseases}</p>
            <p className="text-sm text-yellow-700">Prevent. Dis.</p>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4 text-center">
            <Stethoscope className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-900">{communityMetrics.chronicDiseaseRate}%</p>
            <p className="text-sm text-purple-700">Chronic Dis.</p>
          </CardContent>
        </Card>
        <Card className="border-teal-200 bg-teal-50">
          <CardContent className="p-4 text-center">
            <Shield className="h-8 w-8 text-teal-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-teal-900">{communityMetrics.vaccInationCoverage}%</p>
            <p className="text-sm text-teal-700">Vaccination</p>
          </CardContent>
        </Card>
        <Card className="border-indigo-200 bg-indigo-50">
          <CardContent className="p-4 text-center">
            <Home className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-indigo-900">{communityMetrics.healthcareAccess}%</p>
            <p className="text-sm text-indigo-700">Access</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-900">{communityMetrics.healthEquityIndex}</p>
            <p className="text-sm text-orange-700">Equity Index</p>
          </CardContent>
        </Card>
      </div>

      {/* Health Indicators */}
      <Card>
        <CardHeader>
          <CardTitle>Health Indicators by Category</CardTitle>
          <CardDescription>Key population health metrics and targets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {healthIndicators.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h4 className="font-semibold text-gray-900 mb-3">{category.category}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.indicators.map((indicator, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-900">{indicator.name}</span>
                        <Badge className={`${
                          indicator.trend === 'improving' ? 'bg-green-500' :
                          indicator.trend === 'stable' ? 'bg-yellow-500' : 'bg-red-500'
                        } text-white`}>
                          {indicator.trend}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Current: {indicator.value} {indicator.unit}</span>
                        <span>Target: {indicator.target} {indicator.unit}</span>
                      </div>
                      <Progress 
                        value={(indicator.value / indicator.target) * 100} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Population Demographics */}
        <Card>
          <CardHeader>
            <CardTitle>Population Health by Demographics</CardTitle>
            <CardDescription>Health scores and interventions by age group</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {populationData.map((group, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-gray-900">{group.demographic}</h4>
                    <Badge variant="outline">
                      Score: {group.healthScore}/10
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <p className="text-gray-600">Population</p>
                      <p className="font-bold text-gray-900">{group.population.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Percentage</p>
                      <p className="font-bold text-gray-900">{group.percentage}%</p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-1">Key Health Issues:</p>
                    <div className="flex flex-wrap gap-1">
                      {group.keyIssues.map((issue, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {issue}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Active Interventions: <span className="font-medium">{group.interventions}</span>
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Health Equity */}
        <Card>
          <CardHeader>
            <CardTitle>Health Equity Analysis</CardTitle>
            <CardDescription>Disparities across demographic groups</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {healthEquityMetrics.map((metric, index) => (
                <div key={index}>
                  <h4 className="font-semibold text-gray-900 mb-3">{metric.indicator}</h4>
                  <div className="space-y-2">
                    {Object.entries(metric.byDemographic).map(([demographic, value], idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{demographic}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                typeof value === 'number' && value >= metric.overall ? 'bg-green-500' : 'bg-red-500'
                              }`}
                              style={{ 
                                width: `${typeof value === 'number' ? 
                                  (metric.indicator === 'Health Outcomes' ? (value / 10) * 100 : value) : 0}%` 
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-12 text-right">
                            {typeof value === 'number' ? 
                              (metric.indicator === 'Health Outcomes' ? value.toFixed(1) : value.toFixed(1) + '%') : value}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Overall Average:</span>
                      <span className="font-medium text-gray-900">
                        {metric.indicator === 'Health Outcomes' ? 
                          metric.overall.toFixed(1) : metric.overall.toFixed(1) + '%'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
