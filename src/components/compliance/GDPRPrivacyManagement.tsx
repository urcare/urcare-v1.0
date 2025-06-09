
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { 
  Lock,
  FileText,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  Search,
  Download,
  UserCheck
} from 'lucide-react';

export const GDPRPrivacyManagement = () => {
  const [consentTracking, setConsentTracking] = useState({
    totalSubjects: 15420,
    activeConsents: 14892,
    expiredConsents: 328,
    withdrawnConsents: 200,
    consentRate: 96.6
  });

  const [dataSubjectRequests, setDataSubjectRequests] = useState([
    {
      id: 'DSR001',
      type: 'Data Access',
      subject: 'john.doe@email.com',
      status: 'In Progress',
      submitted: '2024-01-20',
      deadline: '2024-02-19',
      daysRemaining: 10
    },
    {
      id: 'DSR002',
      type: 'Data Deletion',
      subject: 'jane.smith@email.com',
      status: 'Completed',
      submitted: '2024-01-18',
      deadline: '2024-02-17',
      daysRemaining: 0
    },
    {
      id: 'DSR003',
      type: 'Data Portability',
      subject: 'mike.wilson@email.com',
      status: 'Pending Review',
      submitted: '2024-01-22',
      deadline: '2024-02-21',
      daysRemaining: 12
    }
  ]);

  const [privacyImpactAssessments, setPrivacyImpactAssessments] = useState([
    {
      id: 'PIA001',
      project: 'Patient Portal Enhancement',
      riskLevel: 'Medium',
      status: 'Draft',
      assessor: 'Privacy Officer',
      dueDate: '2024-02-15',
      progress: 65
    },
    {
      id: 'PIA002',
      project: 'AI Diagnostic Tool',
      riskLevel: 'High',
      status: 'Under Review',
      assessor: 'Data Protection Team',
      dueDate: '2024-02-28',
      progress: 85
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Pending Review': return 'bg-yellow-100 text-yellow-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* GDPR Overview Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">92.5%</div>
            <div className="text-sm text-gray-600">GDPR Compliance</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{consentTracking.activeConsents.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Active Consents</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{dataSubjectRequests.length}</div>
            <div className="text-sm text-gray-600">Pending Requests</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{privacyImpactAssessments.length}</div>
            <div className="text-sm text-gray-600">Active PIAs</div>
          </CardContent>
        </Card>
      </div>

      {/* Consent Tracking Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Consent Management & Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">{consentTracking.consentRate}%</div>
                <div className="text-sm text-green-700">Overall Consent Rate</div>
                <Progress value={consentTracking.consentRate} className="mt-2 h-2" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border rounded">
                  <div className="text-lg font-bold">{consentTracking.totalSubjects.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Data Subjects</div>
                </div>
                <div className="p-3 border rounded">
                  <div className="text-lg font-bold text-yellow-600">{consentTracking.expiredConsents}</div>
                  <div className="text-sm text-gray-600">Expired Consents</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="font-medium mb-2">Consent Categories</div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Marketing Communications</span>
                    <span className="text-sm font-medium">87.3%</span>
                  </div>
                  <Progress value={87.3} className="h-1" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Data Processing</span>
                    <span className="text-sm font-medium">96.8%</span>
                  </div>
                  <Progress value={96.8} className="h-1" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Third-party Sharing</span>
                    <span className="text-sm font-medium">72.1%</span>
                  </div>
                  <Progress value={72.1} className="h-1" />
                </div>
              </div>

              <Button className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export Consent Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Subject Requests Processing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Data Subject Rights Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dataSubjectRequests.map((request) => (
              <div key={request.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium">{request.type}</div>
                    <div className="text-sm text-gray-600">{request.subject}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                    {request.daysRemaining > 0 && (
                      <Badge variant="outline">
                        {request.daysRemaining} days left
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <div className="text-sm text-gray-600">Request ID</div>
                    <div className="font-medium">{request.id}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Submitted</div>
                    <div className="font-medium">{request.submitted}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Deadline</div>
                    <div className="font-medium">{request.deadline}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Process
                    </Button>
                    <Button size="sm">
                      Review
                    </Button>
                  </div>
                </div>

                {request.daysRemaining <= 5 && request.status !== 'Completed' && (
                  <div className="p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                    <AlertTriangle className="h-4 w-4 inline mr-1" />
                    Deadline approaching - immediate attention required
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Privacy Impact Assessment Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Privacy Impact Assessments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {privacyImpactAssessments.map((pia) => (
              <div key={pia.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium">{pia.project}</div>
                    <div className="text-sm text-gray-600">Assessor: {pia.assessor}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getRiskColor(pia.riskLevel)}>
                      {pia.riskLevel} Risk
                    </Badge>
                    <Badge className={getStatusColor(pia.status)}>
                      {pia.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <div className="text-sm text-gray-600">Due Date</div>
                    <div className="font-medium">{pia.dueDate}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Progress</div>
                    <div className="font-medium">{pia.progress}%</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                    <Button size="sm">
                      Review
                    </Button>
                  </div>
                </div>

                <Progress value={pia.progress} className="h-2" />
              </div>
            ))}

            <Button className="w-full" variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Start New Privacy Impact Assessment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
