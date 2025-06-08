
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Eye, 
  BookOpen, 
  Award,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Settings,
  Download
} from 'lucide-react';

export const QualityAssurance = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReviewer, setSelectedReviewer] = useState('all');

  const peerReviewCases = [
    {
      id: 'PR001',
      patient: 'Anonymous Case #1247',
      study: 'Chest CT',
      originalReader: 'Dr. Smith',
      reviewer: 'Dr. Johnson',
      reviewDate: '2024-01-08',
      agreement: 'Complete',
      discrepancy: null,
      severity: null,
      educational: false
    },
    {
      id: 'PR002',
      patient: 'Anonymous Case #1248',
      study: 'Brain MRI',
      originalReader: 'Dr. Wilson',
      reviewer: 'Dr. Davis',
      reviewDate: '2024-01-08',
      agreement: 'Minor Discrepancy',
      discrepancy: 'Missed small meningioma',
      severity: 'Low',
      educational: true
    },
    {
      id: 'PR003',
      patient: 'Anonymous Case #1249',
      study: 'Abdominal CT',
      originalReader: 'Dr. Brown',
      reviewer: 'Dr. Lee',
      reviewDate: '2024-01-07',
      agreement: 'Major Discrepancy',
      discrepancy: 'Missed bowel perforation',
      severity: 'High',
      educational: true
    }
  ];

  const qualityMetrics = {
    totalReviews: 156,
    completeAgreement: 142,
    minorDiscrepancies: 11,
    majorDiscrepancies: 3,
    agreementRate: 91.0,
    educationalCases: 14,
    averageReviewTime: 8.5
  };

  const discrepancyTrends = [
    { month: 'Oct', agreement: 89.2, minor: 8.1, major: 2.7 },
    { month: 'Nov', agreement: 90.1, minor: 7.8, major: 2.1 },
    { month: 'Dec', agreement: 91.0, minor: 7.1, major: 1.9 },
    { month: 'Jan', agreement: 91.0, minor: 7.1, major: 1.9 }
  ];

  const educationalProgram = {
    totalCases: 45,
    completedByStaff: 38,
    averageScore: 87.3,
    upcomingDeadline: '2024-01-15',
    categories: [
      { name: 'Emergency Radiology', cases: 12, completed: 10 },
      { name: 'Chest Imaging', cases: 15, completed: 13 },
      { name: 'Neuroradiology', cases: 8, completed: 7 },
      { name: 'Musculoskeletal', cases: 10, completed: 8 }
    ]
  };

  const radiologistPerformance = [
    {
      name: 'Dr. Smith',
      totalReviews: 42,
      agreementRate: 93.5,
      minorDiscrepancies: 2,
      majorDiscrepancies: 1,
      educationalCases: 3,
      trend: 'up'
    },
    {
      name: 'Dr. Johnson',
      totalReviews: 38,
      agreementRate: 89.2,
      minorDiscrepancies: 3,
      majorDiscrepancies: 1,
      educationalCases: 4,
      trend: 'stable'
    },
    {
      name: 'Dr. Wilson',
      totalReviews: 35,
      agreementRate: 91.4,
      minorDiscrepancies: 2,
      majorDiscrepancies: 1,
      educationalCases: 3,
      trend: 'up'
    },
    {
      name: 'Dr. Brown',
      totalReviews: 41,
      agreementRate: 87.8,
      minorDiscrepancies: 4,
      majorDiscrepancies: 1,
      educationalCases: 5,
      trend: 'down'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Quality Assurance</h3>
          <p className="text-gray-600">Peer review, discrepancy analysis, and continuing education tracking</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            QA Settings
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Quality Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-900">{qualityMetrics.agreementRate}%</p>
                <p className="text-sm text-green-700">Agreement Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-900">{qualityMetrics.totalReviews}</p>
                <p className="text-sm text-blue-700">Total Reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold text-orange-900">{qualityMetrics.majorDiscrepancies}</p>
                <p className="text-sm text-orange-700">Major Discrepancies</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-purple-900">{qualityMetrics.educationalCases}</p>
                <p className="text-sm text-purple-700">Educational Cases</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Peer Review Cases */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Peer Reviews</CardTitle>
              <CardDescription>Blind review cases with discrepancy analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {peerReviewCases.map((case_, index) => (
                  <div key={index} className={`border rounded-lg p-4 ${
                    case_.agreement === 'Complete' ? 'border-green-200 bg-green-50' :
                    case_.agreement === 'Minor Discrepancy' ? 'border-yellow-200 bg-yellow-50' :
                    'border-red-200 bg-red-50'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h5 className="font-medium text-gray-900">{case_.patient}</h5>
                        <p className="text-sm text-gray-600">{case_.study}</p>
                        <p className="text-xs text-gray-500">Review Date: {case_.reviewDate}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className={`${
                          case_.agreement === 'Complete' ? 'border-green-500 text-green-700' :
                          case_.agreement === 'Minor Discrepancy' ? 'border-yellow-500 text-yellow-700' :
                          'border-red-500 text-red-700'
                        }`}>
                          {case_.agreement}
                        </Badge>
                        {case_.educational && (
                          <Badge className="mt-1 bg-purple-500">Educational</Badge>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Original Reader: {case_.originalReader}</p>
                        <p className="text-sm text-gray-600">Reviewer: {case_.reviewer}</p>
                      </div>
                      <div>
                        {case_.discrepancy && (
                          <>
                            <p className="text-sm font-medium text-gray-900">Discrepancy:</p>
                            <p className="text-sm text-gray-700">{case_.discrepancy}</p>
                            <Badge variant="outline" className={`mt-1 ${
                              case_.severity === 'High' ? 'border-red-500 text-red-700' :
                              case_.severity === 'Medium' ? 'border-orange-500 text-orange-700' :
                              'border-yellow-500 text-yellow-700'
                            }`}>
                              {case_.severity} Severity
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 mt-3 pt-3 border-t">
                      <Button size="sm" variant="outline" className="text-xs">
                        <Eye className="h-3 w-3 mr-1" />
                        View Case
                      </Button>
                      {case_.educational && (
                        <Button size="sm" variant="outline" className="text-xs">
                          <BookOpen className="h-3 w-3 mr-1" />
                          Add to Library
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Radiologist Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Radiologist Performance</CardTitle>
              <CardDescription>Individual performance metrics and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {radiologistPerformance.map((radiologist, index) => (
                  <div key={index} className="border rounded-lg p-3 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-900">{radiologist.name}</h5>
                      <div className="flex items-center gap-2">
                        <TrendingUp className={`h-4 w-4 ${
                          radiologist.trend === 'up' ? 'text-green-500' :
                          radiologist.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                        }`} />
                        <span className={`text-sm font-medium ${
                          radiologist.agreementRate >= 90 ? 'text-green-600' :
                          radiologist.agreementRate >= 85 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {radiologist.agreementRate}%
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Reviews</p>
                        <p className="font-medium">{radiologist.totalReviews}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Minor</p>
                        <p className="font-medium text-yellow-600">{radiologist.minorDiscrepancies}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Major</p>
                        <p className="font-medium text-red-600">{radiologist.majorDiscrepancies}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Educational</p>
                        <p className="font-medium text-purple-600">{radiologist.educationalCases}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Education & Trends */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-purple-600" />
                Continuing Education
              </CardTitle>
              <CardDescription>Educational case library and completion tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="relative w-24 h-24 mx-auto mb-3">
                    <div className="w-24 h-24 rounded-full border-8 border-purple-200 flex items-center justify-center">
                      <span className="text-lg font-bold text-purple-600">
                        {Math.round((educationalProgram.completedByStaff / educationalProgram.totalCases) * 100)}%
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {educationalProgram.completedByStaff}/{educationalProgram.totalCases} cases completed
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Average Score</span>
                    <span className="font-medium text-green-600">{educationalProgram.averageScore}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Next Deadline</span>
                    <span className="font-medium text-orange-600">{educationalProgram.upcomingDeadline}</span>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <h6 className="font-medium text-gray-900 mb-2">Categories</h6>
                  <div className="space-y-2">
                    {educationalProgram.categories.map((category, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{category.name}</span>
                          <span className="text-gray-500">{category.completed}/{category.cases}</span>
                        </div>
                        <Progress 
                          value={(category.completed / category.cases) * 100}
                          className="h-1"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Quality Trends
              </CardTitle>
              <CardDescription>Agreement rates and discrepancy trends over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {discrepancyTrends.map((trend, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{trend.month} 2024</span>
                      <span className="text-green-600">{trend.agreement}%</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Agreement</span>
                        <span className="text-green-600">{trend.agreement}%</span>
                      </div>
                      <Progress value={trend.agreement} className="h-1 bg-green-100" />
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Minor Discrepancies</span>
                        <span className="text-yellow-600">{trend.minor}%</span>
                      </div>
                      <Progress value={trend.minor} className="h-1 bg-yellow-100" />
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Major Discrepancies</span>
                        <span className="text-red-600">{trend.major}%</span>
                      </div>
                      <Progress value={trend.major} className="h-1 bg-red-100" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              <Button size="sm" className="w-full flex items-center gap-2">
                <Eye className="h-3 w-3" />
                Random Case Review
              </Button>
              <Button size="sm" variant="outline" className="w-full flex items-center gap-2">
                <Award className="h-3 w-3" />
                Educational Library
              </Button>
              <Button size="sm" variant="outline" className="w-full flex items-center gap-2">
                <BarChart3 className="h-3 w-3" />
                Generate QA Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
