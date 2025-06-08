
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Download, 
  Mail, 
  BarChart3,
  Calendar,
  Filter,
  Settings,
  Eye,
  Printer,
  Share,
  Clock,
  CheckCircle,
  TrendingUp
} from 'lucide-react';

export const ReportGeneration = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('comprehensive');

  const reportTemplates = [
    {
      id: 'comprehensive',
      name: 'Comprehensive Lab Report',
      description: 'Complete patient results with reference ranges and trends',
      fields: ['Patient Demographics', 'Test Results', 'Reference Ranges', 'Critical Values', 'Trends'],
      frequency: 'On-demand',
      format: ['PDF', 'HTML', 'Excel']
    },
    {
      id: 'critical-summary',
      name: 'Critical Values Summary',
      description: 'Summary of critical results requiring immediate attention',
      fields: ['Critical Results', 'Alert Status', 'Notification History', 'Actions Required'],
      frequency: 'Real-time',
      format: ['PDF', 'Email']
    },
    {
      id: 'departmental',
      name: 'Departmental Performance',
      description: 'Department-specific productivity and quality metrics',
      fields: ['Volume Statistics', 'TAT Analysis', 'Quality Metrics', 'Equipment Status'],
      frequency: 'Daily/Weekly',
      format: ['PDF', 'Excel', 'Dashboard']
    },
    {
      id: 'trending',
      name: 'Patient Trending Report',
      description: 'Historical trends and pattern analysis for specific patients',
      fields: ['Historical Results', 'Trend Graphs', 'Statistical Analysis', 'Clinical Correlations'],
      frequency: 'On-demand',
      format: ['PDF', 'Interactive']
    }
  ];

  const recentReports = [
    {
      id: 'RPT001',
      name: 'ICU Daily Summary',
      template: 'Departmental Performance',
      generated: '2024-01-21 08:00:00',
      status: 'completed',
      size: '2.4 MB',
      format: 'PDF',
      recipients: ['ICU Team', 'Lab Manager'],
      downloadCount: 12
    },
    {
      id: 'RPT002',
      name: 'Patient Trending - John Smith',
      template: 'Patient Trending Report',
      generated: '2024-01-21 07:30:00',
      status: 'completed',
      size: '1.8 MB',
      format: 'PDF',
      recipients: ['Dr. Sarah Johnson'],
      downloadCount: 3
    },
    {
      id: 'RPT003',
      name: 'Critical Values Alert Summary',
      template: 'Critical Values Summary',
      generated: '2024-01-21 06:00:00',
      status: 'processing',
      size: 'Processing...',
      format: 'Email',
      recipients: ['Emergency Team'],
      downloadCount: 0
    }
  ];

  const reportMetrics = {
    totalGenerated: 1247,
    todayGenerated: 23,
    averageGenerationTime: '45 seconds',
    mostPopularTemplate: 'Comprehensive Lab Report',
    distributionMethods: ['Email: 45%', 'Download: 35%', 'Print: 20%']
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Report Generation</h2>
          <p className="text-gray-600">Create customizable laboratory reports and analytics</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Template Manager
          </Button>
          <Button className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Report Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-900">{reportMetrics.totalGenerated}</p>
            <p className="text-sm text-blue-700">Total Reports</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-900">{reportMetrics.todayGenerated}</p>
            <p className="text-sm text-green-700">Generated Today</p>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-900">{reportMetrics.averageGenerationTime}</p>
            <p className="text-sm text-purple-700">Avg Generation Time</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-lg font-bold text-orange-900">{reportMetrics.mostPopularTemplate}</p>
            <p className="text-sm text-orange-700">Most Popular</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Report Templates */}
        <Card>
          <CardHeader>
            <CardTitle>Report Templates</CardTitle>
            <CardDescription>Available report templates and configurations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportTemplates.map((template, index) => (
                <div key={index} className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedTemplate === template.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`} onClick={() => setSelectedTemplate(template.id)}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{template.name}</h4>
                    <Badge variant="outline">{template.frequency}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                  
                  <div className="mb-3">
                    <p className="text-xs font-medium text-gray-700 mb-1">Included Fields:</p>
                    <div className="flex flex-wrap gap-1">
                      {template.fields.map((field, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">{field}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-700">Formats:</p>
                      <div className="flex gap-1">
                        {template.format.map((format, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">{format}</Badge>
                        ))}
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>Recently generated reports and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReports.map((report, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{report.name}</h4>
                      <p className="text-sm text-gray-600">{report.template}</p>
                    </div>
                    <Badge className={`${
                      report.status === 'completed' ? 'bg-green-500' :
                      report.status === 'processing' ? 'bg-yellow-500' : 'bg-gray-500'
                    } text-white`}>
                      {report.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <p className="text-gray-600">Generated</p>
                      <p className="font-medium">{report.generated}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Size</p>
                      <p className="font-medium">{report.size}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Format</p>
                      <p className="font-medium">{report.format}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Downloads</p>
                      <p className="font-medium">{report.downloadCount}</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs font-medium text-gray-700 mb-1">Recipients:</p>
                    <div className="flex flex-wrap gap-1">
                      {report.recipients.map((recipient, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">{recipient}</Badge>
                      ))}
                    </div>
                  </div>

                  {report.status === 'processing' && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Processing...</span>
                        <span>65%</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                  )}

                  <div className="flex gap-2">
                    {report.status === 'completed' && (
                      <>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline">
                          <Mail className="h-4 w-4 mr-1" />
                          Email
                        </Button>
                        <Button size="sm" variant="outline">
                          <Printer className="h-4 w-4 mr-1" />
                          Print
                        </Button>
                      </>
                    )}
                    <Button size="sm" variant="outline">
                      <Share className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Builder */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Report Builder</CardTitle>
          <CardDescription>Create custom reports with selected parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-3">Report Type</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input type="radio" name="reportType" value="patient" className="form-radio" />
                  <span>Patient Report</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="reportType" value="departmental" className="form-radio" />
                  <span>Departmental Report</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="reportType" value="quality" className="form-radio" />
                  <span>Quality Control</span>
                </label>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Date Range</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input type="radio" name="dateRange" value="today" className="form-radio" />
                  <span>Today</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="dateRange" value="week" className="form-radio" />
                  <span>Last 7 Days</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="dateRange" value="month" className="form-radio" />
                  <span>Last 30 Days</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="dateRange" value="custom" className="form-radio" />
                  <span>Custom Range</span>
                </label>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Output Format</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="form-checkbox" />
                  <span>PDF</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="form-checkbox" />
                  <span>Excel</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="form-checkbox" />
                  <span>HTML</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="form-checkbox" />
                  <span>Email</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex gap-3">
            <Button className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Generate Report
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Save Template
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
