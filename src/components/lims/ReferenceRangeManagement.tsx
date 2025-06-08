
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, 
  Users, 
  Calendar, 
  TrendingUp,
  Settings,
  Plus,
  Edit,
  BarChart3,
  Filter,
  Download,
  Upload,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export const ReferenceRangeManagement = () => {
  const [selectedTest, setSelectedTest] = useState('glucose');

  const referenceRanges = [
    {
      test: 'Glucose',
      unit: 'mmol/L',
      ranges: [
        { demographic: 'Adult Male', ageMin: 18, ageMax: 65, min: 3.9, max: 5.5, population: 'General' },
        { demographic: 'Adult Female', ageMin: 18, ageMax: 65, min: 3.9, max: 5.5, population: 'General' },
        { demographic: 'Pediatric', ageMin: 1, ageMax: 17, min: 3.3, max: 5.0, population: 'General' },
        { demographic: 'Elderly', ageMin: 65, ageMax: 100, min: 4.2, max: 6.0, population: 'General' },
        { demographic: 'Diabetic Adult', ageMin: 18, ageMax: 100, min: 4.0, max: 7.0, population: 'Diabetic' }
      ],
      lastUpdated: '2024-01-15',
      source: 'CLSI Guidelines',
      validationStatus: 'validated'
    },
    {
      test: 'Hemoglobin',
      unit: 'g/L',
      ranges: [
        { demographic: 'Adult Male', ageMin: 18, ageMax: 65, min: 140, max: 175, population: 'General' },
        { demographic: 'Adult Female', ageMin: 18, ageMax: 65, min: 120, max: 155, population: 'General' },
        { demographic: 'Pregnant Female', ageMin: 18, ageMax: 45, min: 110, max: 140, population: 'Pregnancy' },
        { demographic: 'Child 6-12y', ageMin: 6, ageMax: 12, min: 115, max: 145, population: 'Pediatric' },
        { demographic: 'Adolescent Male', ageMin: 13, ageMax: 17, min: 130, max: 160, population: 'Pediatric' }
      ],
      lastUpdated: '2024-01-10',
      source: 'WHO Standards',
      validationStatus: 'pending_review'
    },
    {
      test: 'Cholesterol Total',
      unit: 'mmol/L',
      ranges: [
        { demographic: 'Adult General', ageMin: 18, ageMax: 100, min: 3.0, max: 5.2, population: 'General' },
        { demographic: 'High Risk CVD', ageMin: 18, ageMax: 100, min: 2.5, max: 4.5, population: 'High Risk' },
        { demographic: 'Pediatric', ageMin: 2, ageMax: 17, min: 2.8, max: 4.4, population: 'Pediatric' }
      ],
      lastUpdated: '2024-01-20',
      source: 'AHA Guidelines',
      validationStatus: 'validated'
    }
  ];

  const demographicGroups = [
    { name: 'General Population', count: 1247, percentage: 65.3 },
    { name: 'Pediatric', count: 389, percentage: 20.4 },
    { name: 'Elderly (65+)', count: 156, percentage: 8.2 },
    { name: 'Pregnancy', count: 78, percentage: 4.1 },
    { name: 'High Risk CVD', count: 38, percentage: 2.0 }
  ];

  const validationMetrics = {
    totalTests: 156,
    validatedRanges: 134,
    pendingReview: 18,
    outdatedRanges: 4,
    lastValidation: '2024-01-15',
    complianceRate: '95.8%'
  };

  const rangeAnalytics = {
    outOfRangeResults: 234,
    borderlineResults: 89,
    criticalResults: 12,
    trendsDetected: 5,
    rangeUtilization: '78.5%'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reference Range Management</h2>
          <p className="text-gray-600">Manage demographic-specific reference ranges and population normals</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Import Ranges
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Range
          </Button>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-900">{validationMetrics.totalTests}</p>
            <p className="text-sm text-blue-700">Total Tests</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-900">{validationMetrics.validatedRanges}</p>
            <p className="text-sm text-green-700">Validated</p>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-900">{validationMetrics.pendingReview}</p>
            <p className="text-sm text-yellow-700">Pending Review</p>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-900">{validationMetrics.outdatedRanges}</p>
            <p className="text-sm text-red-700">Outdated</p>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4 text-center">
            <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-900">{rangeAnalytics.outOfRangeResults}</p>
            <p className="text-sm text-purple-700">Out of Range</p>
          </CardContent>
        </Card>
        <Card className="border-indigo-200 bg-indigo-50">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-indigo-900">{validationMetrics.complianceRate}</p>
            <p className="text-sm text-indigo-700">Compliance Rate</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="reference-ranges" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="reference-ranges">Reference Ranges</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="reference-ranges" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Test Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Tests</CardTitle>
                <CardDescription>Select test to manage reference ranges</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {referenceRanges.map((range, index) => (
                    <div key={index} className={`p-3 border rounded cursor-pointer transition-colors ${
                      selectedTest === range.test.toLowerCase().replace(' ', '') ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`} onClick={() => setSelectedTest(range.test.toLowerCase().replace(' ', ''))}>
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">{range.test}</h4>
                        <Badge className={`${
                          range.validationStatus === 'validated' ? 'bg-green-500' : 'bg-yellow-500'
                        } text-white text-xs`}>
                          {range.validationStatus === 'validated' ? 'Validated' : 'Pending'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{range.ranges.length} ranges defined</p>
                      <p className="text-xs text-gray-500">Updated: {range.lastUpdated}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Range Details */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Reference Ranges - {referenceRanges[0].test}</CardTitle>
                    <CardDescription>Demographic-specific normal values</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {referenceRanges[0].ranges.map((range, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">{range.demographic}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{range.population}</Badge>
                          <Badge variant="secondary" className="text-xs">{range.ageMin}-{range.ageMax} years</Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Lower Limit</p>
                          <p className="text-lg font-bold text-blue-600">{range.min}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Upper Limit</p>
                          <p className="text-lg font-bold text-blue-600">{range.max}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Unit</p>
                          <p className="text-lg font-bold text-gray-900">{referenceRanges[0].unit}</p>
                        </div>
                      </div>
                      
                      <div className="mt-3 text-center">
                        <span className="text-sm text-gray-600">Normal Range: </span>
                        <span className="font-semibold text-green-600">{range.min} - {range.max} {referenceRanges[0].unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Source</p>
                      <p className="font-medium">{referenceRanges[0].source}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Last Updated</p>
                      <p className="font-medium">{referenceRanges[0].lastUpdated}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Demographic Groups</CardTitle>
              <CardDescription>Population distribution and utilization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {demographicGroups.map((group, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Users className="h-8 w-8 text-blue-600" />
                      <div>
                        <h4 className="font-semibold text-gray-900">{group.name}</h4>
                        <p className="text-sm text-gray-600">{group.count} patients • {group.percentage}% of total</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">{group.percentage}%</p>
                      <Button size="sm" variant="outline">
                        View Ranges
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Range Validation Status</CardTitle>
              <CardDescription>Review and validation of reference ranges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {referenceRanges.map((range, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{range.test}</h4>
                        <p className="text-sm text-gray-600">{range.ranges.length} demographic ranges</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${
                          range.validationStatus === 'validated' ? 'bg-green-500' : 'bg-yellow-500'
                        } text-white`}>
                          {range.validationStatus === 'validated' ? 'Validated' : 'Pending Review'}
                        </Badge>
                        {range.validationStatus === 'validated' ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-gray-600">Source</p>
                        <p className="font-medium">{range.source}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Last Updated</p>
                        <p className="font-medium">{range.lastUpdated}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {range.validationStatus === 'pending_review' && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Validate
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        View Trends
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Range Performance</CardTitle>
                <CardDescription>Analysis of reference range effectiveness</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium text-gray-900">Out of Range Results</p>
                      <p className="text-sm text-gray-600">Results outside normal limits</p>
                    </div>
                    <p className="text-2xl font-bold text-red-600">{rangeAnalytics.outOfRangeResults}</p>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium text-gray-900">Borderline Results</p>
                      <p className="text-sm text-gray-600">Results near range limits</p>
                    </div>
                    <p className="text-2xl font-bold text-yellow-600">{rangeAnalytics.borderlineResults}</p>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium text-gray-900">Critical Results</p>
                      <p className="text-sm text-gray-600">Results requiring immediate action</p>
                    </div>
                    <p className="text-2xl font-bold text-red-600">{rangeAnalytics.criticalResults}</p>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium text-gray-900">Range Utilization</p>
                      <p className="text-sm text-gray-600">Percentage of ranges actively used</p>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{rangeAnalytics.rangeUtilization}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trending Analysis</CardTitle>
                <CardDescription>Statistical trends and pattern detection</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      <h4 className="font-medium text-blue-900">Glucose Trending</h4>
                    </div>
                    <p className="text-sm text-blue-700">15% increase in borderline high results over last 30 days</p>
                  </div>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <h4 className="font-medium text-green-900">Hemoglobin Stability</h4>
                    </div>
                    <p className="text-sm text-green-700">Reference ranges show good population fit (98.5% within normal)</p>
                  </div>
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      <h4 className="font-medium text-yellow-900">Cholesterol Review</h4>
                    </div>
                    <p className="text-sm text-yellow-700">Consider age-adjusted ranges for elderly population</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
