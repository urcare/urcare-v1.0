
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Upload, 
  Download, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Send,
  Shield,
  Globe
} from 'lucide-react';

export const RegulatoryReporting = () => {
  const [reportType, setReportType] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const reportingMetrics = {
    totalReports: 156,
    submittedToday: 8,
    pendingReports: 12,
    overdueReports: 3,
    complianceRate: 95.8,
    avgSubmissionTime: 1.2
  };

  const reportingRequirements = [
    {
      agency: 'CDC',
      reportType: 'NNDSS Weekly Report',
      frequency: 'Weekly',
      nextDue: '2024-01-22',
      status: 'pending',
      compliance: 98.5,
      lastSubmission: '2024-01-15',
      priority: 'high'
    },
    {
      agency: 'State Health Dept',
      reportType: 'Communicable Disease Report',
      frequency: 'Daily',
      nextDue: '2024-01-21',
      status: 'overdue',
      compliance: 94.2,
      lastSubmission: '2024-01-19',
      priority: 'critical'
    },
    {
      agency: 'Local Health Authority',
      reportType: 'Outbreak Investigation',
      frequency: 'As needed',
      nextDue: '2024-01-23',
      status: 'draft',
      compliance: 97.1,
      lastSubmission: '2024-01-18',
      priority: 'medium'
    },
    {
      agency: 'FDA',
      reportType: 'Adverse Event Report',
      frequency: 'Monthly',
      nextDue: '2024-01-30',
      status: 'submitted',
      compliance: 99.2,
      lastSubmission: '2024-01-20',
      priority: 'low'
    }
  ];

  const submissionHistory = [
    {
      reportId: 'CDC-2024-003',
      reportType: 'NNDSS Weekly',
      submissionDate: '2024-01-20 09:15',
      agency: 'CDC',
      status: 'accepted',
      responseTime: '2 hours',
      fileSize: '2.4 MB'
    },
    {
      reportId: 'SHD-2024-021',
      reportType: 'Disease Surveillance',
      submissionDate: '2024-01-20 08:30',
      agency: 'State Health',
      status: 'processing',
      responseTime: 'Pending',
      fileSize: '1.8 MB'
    },
    {
      reportId: 'LHA-2024-012',
      reportType: 'Outbreak Summary',
      submissionDate: '2024-01-19 16:45',
      agency: 'Local Authority',
      status: 'rejected',
      responseTime: '4 hours',
      fileSize: '3.1 MB'
    }
  ];

  const dataQualityChecks = [
    {
      check: 'Complete Case Data',
      status: 'passed',
      score: 98.5,
      issues: 2
    },
    {
      check: 'Date Validation',
      status: 'passed',
      score: 99.8,
      issues: 0
    },
    {
      check: 'Geographic Codes',
      status: 'warning',
      score: 94.2,
      issues: 8
    },
    {
      check: 'Classification Codes',
      status: 'passed',
      score: 97.1,
      issues: 1
    }
  ];

  const complianceAlerts = [
    {
      type: 'Overdue Report',
      message: 'State Health Department daily report is 1 day overdue',
      severity: 'high',
      dueDate: '2024-01-20',
      agency: 'State Health Dept'
    },
    {
      type: 'Data Quality',
      message: 'Geographic codes incomplete for 8 records',
      severity: 'medium',
      dueDate: '2024-01-22',
      agency: 'CDC'
    },
    {
      type: 'Upcoming Deadline',
      message: 'FDA monthly report due in 2 days',
      severity: 'low',
      dueDate: '2024-01-23',
      agency: 'FDA'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Regulatory Reporting</h2>
          <p className="text-gray-600">Automated compliance reporting to public health agencies</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
          <Button className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Submit Report
          </Button>
        </div>
      </div>

      {/* Reporting Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-900">{reportingMetrics.totalReports}</p>
            <p className="text-sm text-blue-700">Total Reports</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-900">{reportingMetrics.submittedToday}</p>
            <p className="text-sm text-green-700">Submitted Today</p>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-900">{reportingMetrics.pendingReports}</p>
            <p className="text-sm text-yellow-700">Pending</p>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-900">{reportingMetrics.overdueReports}</p>
            <p className="text-sm text-red-700">Overdue</p>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4 text-center">
            <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-900">{reportingMetrics.complianceRate}%</p>
            <p className="text-sm text-purple-700">Compliance</p>
          </CardContent>
        </Card>
        <Card className="border-teal-200 bg-teal-50">
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 text-teal-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-teal-900">{reportingMetrics.avgSubmissionTime}</p>
            <p className="text-sm text-teal-700">Avg Days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reporting Requirements */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Reporting Requirements</CardTitle>
              <CardDescription>Scheduled reports and compliance status</CardDescription>
              <div className="flex gap-4">
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="cdc">CDC Reports</SelectItem>
                    <SelectItem value="state">State Reports</SelectItem>
                    <SelectItem value="local">Local Reports</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportingRequirements.map((requirement, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{requirement.reportType}</h4>
                        <p className="text-sm text-gray-600">{requirement.agency}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={`${
                          requirement.status === 'overdue' ? 'bg-red-500' :
                          requirement.status === 'pending' ? 'bg-yellow-500' :
                          requirement.status === 'submitted' ? 'bg-green-500' : 'bg-blue-500'
                        } text-white mb-1`}>
                          {requirement.status}
                        </Badge>
                        <p className={`text-xs ${
                          requirement.priority === 'critical' ? 'text-red-600' :
                          requirement.priority === 'high' ? 'text-orange-600' :
                          requirement.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {requirement.priority} priority
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-gray-600">Frequency</p>
                        <p className="font-medium text-gray-900">{requirement.frequency}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Next Due</p>
                        <p className="font-medium text-gray-900">{requirement.nextDue}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Compliance</p>
                        <p className="font-medium text-gray-900">{requirement.compliance}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Last Submitted</p>
                        <p className="font-medium text-gray-900">{requirement.lastSubmission}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <Progress value={requirement.compliance} className="flex-1 mr-4 h-2" />
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <FileText className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Upload className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Compliance Alerts & Data Quality */}
        <div className="space-y-6">
          {/* Compliance Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Compliance Alerts</CardTitle>
              <CardDescription>Urgent reporting notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {complianceAlerts.map((alert, index) => (
                  <div key={index} className={`p-3 rounded-lg border-l-4 ${
                    alert.severity === 'high' ? 'border-l-red-500 bg-red-50' :
                    alert.severity === 'medium' ? 'border-l-yellow-500 bg-yellow-50' : 'border-l-blue-500 bg-blue-50'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900 text-sm">{alert.type}</h5>
                        <p className="text-xs text-gray-600 mt-1">{alert.message}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {alert.agency}
                          </Badge>
                          <span className="text-xs text-gray-500">Due: {alert.dueDate}</span>
                        </div>
                      </div>
                      <AlertTriangle className={`h-4 w-4 ml-2 ${
                        alert.severity === 'high' ? 'text-red-600' :
                        alert.severity === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                      }`} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Data Quality */}
          <Card>
            <CardHeader>
              <CardTitle>Data Quality Checks</CardTitle>
              <CardDescription>Validation status for submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dataQualityChecks.map((check, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        check.status === 'passed' ? 'bg-green-500' :
                        check.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{check.check}</p>
                        <p className="text-xs text-gray-600">
                          {check.issues} issues • {check.score}% quality
                        </p>
                      </div>
                    </div>
                    <CheckCircle className={`h-4 w-4 ${
                      check.status === 'passed' ? 'text-green-600' :
                      check.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                    }`} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Submission History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Submissions</CardTitle>
          <CardDescription>Latest report submission status and responses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {submissionHistory.map((submission, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${
                    submission.status === 'accepted' ? 'bg-green-500' :
                    submission.status === 'processing' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <div>
                    <h4 className="font-medium text-gray-900">{submission.reportId}</h4>
                    <p className="text-sm text-gray-600">{submission.reportType} • {submission.agency}</p>
                    <p className="text-xs text-gray-500">{submission.submissionDate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={`${
                    submission.status === 'accepted' ? 'bg-green-500' :
                    submission.status === 'processing' ? 'bg-yellow-500' : 'bg-red-500'
                  } text-white mb-1`}>
                    {submission.status}
                  </Badge>
                  <p className="text-xs text-gray-500">
                    Response: {submission.responseTime} • {submission.fileSize}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
