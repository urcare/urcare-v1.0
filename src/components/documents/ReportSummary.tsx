
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, FileText, Download } from 'lucide-react';

interface ReportCategory {
  name: string;
  reports: Report[];
  overallStatus: 'good' | 'warning' | 'critical';
  trends: 'improving' | 'stable' | 'declining';
}

interface Report {
  id: string;
  name: string;
  date: Date;
  keyFindings: string[];
  status: 'normal' | 'abnormal' | 'critical';
  summary: string;
  recommendations: string[];
}

const sampleCategories: ReportCategory[] = [
  {
    name: 'Lab Results',
    overallStatus: 'good',
    trends: 'improving',
    reports: [
      {
        id: '1',
        name: 'Complete Blood Count',
        date: new Date('2024-01-15'),
        status: 'normal',
        summary: 'All blood parameters within normal range. Hemoglobin levels improved.',
        keyFindings: [
          'Hemoglobin: 14.2 g/dL (Normal)',
          'White Blood Cells: 7,200/μL (Normal)',
          'Platelets: 280,000/μL (Normal)'
        ],
        recommendations: [
          'Continue current iron supplement',
          'Maintain balanced diet',
          'Recheck in 6 months'
        ]
      },
      {
        id: '2',
        name: 'Lipid Panel',
        date: new Date('2024-01-10'),
        status: 'abnormal',
        summary: 'Cholesterol levels slightly elevated but improving from previous test.',
        keyFindings: [
          'Total Cholesterol: 210 mg/dL (High)',
          'LDL: 135 mg/dL (Borderline High)',
          'HDL: 58 mg/dL (Good)'
        ],
        recommendations: [
          'Continue statin medication',
          'Increase physical activity',
          'Follow low-cholesterol diet'
        ]
      }
    ]
  },
  {
    name: 'Imaging Studies',
    overallStatus: 'good',
    trends: 'stable',
    reports: [
      {
        id: '3',
        name: 'Chest X-Ray',
        date: new Date('2024-01-08'),
        status: 'normal',
        summary: 'Clear chest X-ray with no acute findings. Heart size normal.',
        keyFindings: [
          'Lung fields: Clear bilaterally',
          'Heart size: Normal',
          'No pleural effusion',
          'No acute findings'
        ],
        recommendations: [
          'No immediate follow-up needed',
          'Continue annual screening'
        ]
      }
    ]
  },
  {
    name: 'Specialist Reports',
    overallStatus: 'warning',
    trends: 'stable',
    reports: [
      {
        id: '4',
        name: 'Cardiology Consultation',
        date: new Date('2024-01-05'),
        status: 'abnormal',
        summary: 'Mild mitral valve regurgitation detected. Regular monitoring recommended.',
        keyFindings: [
          'Mild mitral regurgitation',
          'Normal left ventricular function',
          'No signs of heart failure',
          'Blood pressure well controlled'
        ],
        recommendations: [
          'Follow-up in 12 months',
          'Continue blood pressure medication',
          'Moderate exercise as tolerated'
        ]
      }
    ]
  }
];

export const ReportSummary = () => {
  const [selectedCategory, setSelectedCategory] = useState(sampleCategories[0]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal':
      case 'good':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
      case 'abnormal':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
      case 'good':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'warning':
      case 'abnormal':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sampleCategories.map((category) => (
          <Card 
            key={category.name}
            className={`cursor-pointer transition-all ${
              selectedCategory.name === category.name ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{category.name}</h3>
                {getStatusIcon(category.overallStatus)}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                {getTrendIcon(category.trends)}
                <span className="capitalize">{category.trends}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {category.reports.length} report{category.reports.length !== 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Report View */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {selectedCategory.name} - Detailed Summary
          </CardTitle>
          <CardDescription>
            Comprehensive analysis of your {selectedCategory.name.toLowerCase()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {selectedCategory.reports.map((report) => (
            <Card key={report.id} className={`border-l-4 ${getStatusColor(report.status)}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{report.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(report.status)}
                    <Badge 
                      variant="outline" 
                      className={getStatusColor(report.status)}
                    >
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </Badge>
                  </div>
                </div>
                <CardDescription>
                  {report.date.toLocaleDateString()} • {report.summary}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Key Findings */}
                <div>
                  <h4 className="font-medium mb-2">Key Findings:</h4>
                  <ul className="space-y-1">
                    {report.keyFindings.map((finding, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="text-blue-500 mt-1.5 w-1 h-1 rounded-full bg-blue-500 flex-shrink-0" />
                        {finding}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div>
                  <h4 className="font-medium mb-2">Recommendations:</h4>
                  <ul className="space-y-1">
                    {report.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline">
                    <FileText className="h-4 w-4 mr-1" />
                    View Full Report
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Health Progress Indicator */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                {getTrendIcon(selectedCategory.trends)}
                <h4 className="font-medium">Health Trend Analysis</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Your {selectedCategory.name.toLowerCase()} show a {selectedCategory.trends} trend over the past 6 months.
              </p>
              <Progress 
                value={selectedCategory.trends === 'improving' ? 80 : selectedCategory.trends === 'stable' ? 60 : 30} 
                className="h-2"
              />
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};
