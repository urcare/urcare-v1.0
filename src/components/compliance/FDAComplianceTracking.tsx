
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Stethoscope,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Upload,
  Download
} from 'lucide-react';

export const FDAComplianceTracking = () => {
  const [deviceValidation, setDeviceValidation] = useState([
    {
      id: 'DV001',
      device: 'Cardiac Monitor Pro',
      type: 'Class II Medical Device',
      status: 'Validation Complete',
      validationDate: '2024-01-15',
      nextReview: '2025-01-15',
      compliance: 98.5,
      issues: 0
    },
    {
      id: 'DV002',
      device: 'AI Diagnostic Imaging System',
      type: 'Class III Medical Device',
      status: 'Under Validation',
      validationDate: 'In Progress',
      nextReview: '2024-03-30',
      compliance: 76.2,
      issues: 3
    },
    {
      id: 'DV003',
      device: 'Portable Ultrasound Unit',
      type: 'Class II Medical Device',
      status: 'Pending Review',
      validationDate: 'Scheduled',
      nextReview: '2024-02-28',
      compliance: 45.0,
      issues: 8
    }
  ]);

  const [adverseEvents, setAdverseEvents] = useState([
    {
      id: 'AE001',
      device: 'Cardiac Monitor Pro',
      eventType: 'Device Malfunction',
      severity: 'Moderate',
      reportDate: '2024-01-20',
      fdaReportDate: '2024-01-22',
      status: 'Reported to FDA',
      investigation: 'Complete'
    },
    {
      id: 'AE002',
      device: 'AI Diagnostic Imaging System',
      eventType: 'Software Error',
      severity: 'Minor',
      reportDate: '2024-01-18',
      fdaReportDate: 'Pending',
      status: 'Under Investigation',
      investigation: 'In Progress'
    }
  ]);

  const [regulatorySubmissions, setRegulatorySubmissions] = useState([
    {
      id: 'RS001',
      type: '510(k) Premarket Notification',
      device: 'Smart Infusion Pump',
      submissionDate: '2024-01-10',
      fdaResponse: 'Under Review',
      targetDate: '2024-04-10',
      status: 'Pending',
      daysRemaining: 75
    },
    {
      id: 'RS002',
      type: 'PMA Application',
      device: 'Advanced Surgical Robot',
      submissionDate: '2023-10-15',
      fdaResponse: 'Additional Information Requested',
      targetDate: '2024-02-15',
      status: 'Action Required',
      daysRemaining: 20
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Validation Complete':
      case 'Reported to FDA':
      case 'Complete':
        return 'bg-green-100 text-green-800';
      case 'Under Validation':
      case 'Under Investigation':
      case 'In Progress':
      case 'Pending':
        return 'bg-blue-100 text-blue-800';
      case 'Pending Review':
      case 'Action Required':
        return 'bg-yellow-100 text-yellow-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-100 text-red-800';
      case 'Moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Minor':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* FDA Compliance Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">93.7%</div>
            <div className="text-sm text-gray-600">FDA Compliance</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{deviceValidation.length}</div>
            <div className="text-sm text-gray-600">Device Validations</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{adverseEvents.length}</div>
            <div className="text-sm text-gray-600">Adverse Events</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{regulatorySubmissions.length}</div>
            <div className="text-sm text-gray-600">Active Submissions</div>
          </CardContent>
        </Card>
      </div>

      {/* Device Validation Workflows */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            Medical Device Validation Workflows
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deviceValidation.map((device) => (
              <div key={device.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium">{device.device}</div>
                    <div className="text-sm text-gray-600">{device.type}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(device.status)}>
                      {device.status}
                    </Badge>
                    {device.issues > 0 && (
                      <Badge variant="destructive">
                        {device.issues} Issues
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <div className="text-sm text-gray-600">Device ID</div>
                    <div className="font-medium">{device.id}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Validation Date</div>
                    <div className="font-medium">{device.validationDate}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Next Review</div>
                    <div className="font-medium">{device.nextReview}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    {device.issues > 0 && (
                      <Button size="sm" variant="destructive">
                        Address Issues
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Validation Progress</span>
                    <span className="text-sm font-medium">{device.compliance}%</span>
                  </div>
                  <Progress value={device.compliance} className="h-2" />
                </div>

                {device.issues > 0 && (
                  <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                    <AlertTriangle className="h-4 w-4 inline mr-1" />
                    {device.issues} validation issues require resolution before FDA compliance
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Adverse Event Reporting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Adverse Event Reporting
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {adverseEvents.map((event) => (
              <div key={event.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium">{event.eventType}</div>
                    <div className="text-sm text-gray-600">{event.device}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getSeverityColor(event.severity)}>
                      {event.severity}
                    </Badge>
                    <Badge className={getStatusColor(event.status)}>
                      {event.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <div className="text-sm text-gray-600">Event ID</div>
                    <div className="font-medium">{event.id}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Report Date</div>
                    <div className="font-medium">{event.reportDate}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">FDA Report Date</div>
                    <div className="font-medium">{event.fdaReportDate}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Investigation</div>
                    <div className="font-medium">{event.investigation}</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <FileText className="h-3 w-3 mr-1" />
                    View Report
                  </Button>
                  {event.fdaReportDate === 'Pending' && (
                    <Button size="sm">
                      <Upload className="h-3 w-3 mr-1" />
                      Submit to FDA
                    </Button>
                  )}
                </div>
              </div>
            ))}

            <Button className="w-full" variant="outline">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Report New Adverse Event
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Regulatory Submission Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Regulatory Submission Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {regulatorySubmissions.map((submission) => (
              <div key={submission.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium">{submission.type}</div>
                    <div className="text-sm text-gray-600">{submission.device}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(submission.status)}>
                      {submission.status}
                    </Badge>
                    {submission.daysRemaining <= 30 && (
                      <Badge variant="outline">
                        {submission.daysRemaining} days left
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <div className="text-sm text-gray-600">Submission ID</div>
                    <div className="font-medium">{submission.id}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Submission Date</div>
                    <div className="font-medium">{submission.submissionDate}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Target Date</div>
                    <div className="font-medium">{submission.targetDate}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">FDA Response</div>
                    <div className="font-medium">{submission.fdaResponse}</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Download className="h-3 w-3 mr-1" />
                    Download Documents
                  </Button>
                  {submission.status === 'Action Required' && (
                    <Button size="sm">
                      Submit Response
                    </Button>
                  )}
                </div>

                {submission.daysRemaining <= 30 && submission.status !== 'Complete' && (
                  <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
                    <Clock className="h-4 w-4 inline mr-1" />
                    Deadline approaching - {submission.daysRemaining} days remaining for response
                  </div>
                )}
              </div>
            ))}

            <Button className="w-full" variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Start New Regulatory Submission
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
