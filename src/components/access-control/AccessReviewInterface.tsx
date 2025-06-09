
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle,
  XCircle,
  Clock,
  Users,
  AlertTriangle,
  Calendar,
  Eye,
  RefreshCw
} from 'lucide-react';

export const AccessReviewInterface = () => {
  const [accessReviews, setAccessReviews] = useState([
    {
      id: 'REV001',
      department: 'Cardiology',
      reviewer: 'Dr. Sarah Johnson',
      totalUsers: 45,
      reviewedUsers: 32,
      dueDate: '2024-02-15',
      status: 'In Progress',
      violations: 3,
      lastUpdate: '2024-01-22 14:30:00'
    },
    {
      id: 'REV002',
      department: 'Emergency',
      reviewer: 'Dr. Mike Rodriguez',
      totalUsers: 78,
      reviewedUsers: 78,
      dueDate: '2024-01-30',
      status: 'Completed',
      violations: 1,
      lastUpdate: '2024-01-20 16:45:00'
    },
    {
      id: 'REV003',
      department: 'IT Administration',
      reviewer: 'Admin Jane Smith',
      totalUsers: 12,
      reviewedUsers: 5,
      dueDate: '2024-02-01',
      status: 'Overdue',
      violations: 7,
      lastUpdate: '2024-01-18 10:20:00'
    }
  ]);

  const [certificationWorkflows, setCertificationWorkflows] = useState([
    {
      id: 'CERT001',
      user: 'Dr. Emily Chen',
      role: 'Senior Physician',
      permissions: ['Patient Data Access', 'Prescription Authority', 'Lab Orders'],
      lastCertified: '2023-07-15',
      nextDue: '2024-07-15',
      status: 'Current',
      certifier: 'Department Head'
    },
    {
      id: 'CERT002',
      user: 'Nurse Michael Park',
      role: 'Head Nurse',
      permissions: ['Patient Care Access', 'Medication Administration', 'Team Management'],
      lastCertified: '2023-12-10',
      nextDue: '2024-06-10',
      status: 'Due Soon',
      certifier: 'Nursing Director'
    },
    {
      id: 'CERT003',
      user: 'Admin Tom Wilson',
      role: 'System Administrator',
      permissions: ['System Configuration', 'User Management', 'Database Access'],
      lastCertified: '2023-06-20',
      nextDue: '2024-01-20',
      status: 'Overdue',
      certifier: 'IT Director'
    }
  ]);

  const [violationRemediation, setViolationRemediation] = useState([
    {
      id: 'VIO001',
      user: 'Dr. Lisa Thompson',
      violation: 'Excessive privilege escalation',
      severity: 'High',
      detected: '2024-01-20',
      status: 'Under Review',
      assignedTo: 'Security Team',
      action: 'Privilege reduction pending approval'
    },
    {
      id: 'VIO002',
      user: 'Nurse Jennifer Lee',
      violation: 'Unauthorized department access',
      severity: 'Medium',
      detected: '2024-01-19',
      status: 'Resolved',
      assignedTo: 'Department Manager',
      action: 'Access removed, training completed'
    },
    {
      id: 'VIO003',
      user: 'Tech Support Mark Brown',
      violation: 'Stale account with admin privileges',
      severity: 'Critical',
      detected: '2024-01-18',
      status: 'Escalated',
      assignedTo: 'CISO',
      action: 'Account suspended, investigation ongoing'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': case 'Current': case 'Resolved': return 'bg-green-100 text-green-800';
      case 'In Progress': case 'Under Review': return 'bg-blue-100 text-blue-800';
      case 'Due Soon': return 'bg-yellow-100 text-yellow-800';
      case 'Overdue': case 'Escalated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getReviewProgress = (reviewed: number, total: number) => {
    return (reviewed / total) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Access Review Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{accessReviews.length}</div>
            <div className="text-sm text-gray-600">Active Reviews</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {accessReviews.filter(r => r.status === 'Overdue').length}
            </div>
            <div className="text-sm text-gray-600">Overdue Reviews</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {violationRemediation.filter(v => v.status !== 'Resolved').length}
            </div>
            <div className="text-sm text-gray-600">Open Violations</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {certificationWorkflows.filter(c => c.status === 'Current').length}
            </div>
            <div className="text-sm text-gray-600">Current Certifications</div>
          </CardContent>
        </Card>
      </div>

      {/* Certification Workflows */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Access Certification Reviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {accessReviews.map((review) => (
              <div key={review.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium">{review.department} Department</div>
                    <div className="text-sm text-gray-600">Reviewer: {review.reviewer}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(review.status)}>
                      {review.status}
                    </Badge>
                    {review.violations > 0 && (
                      <Badge className="bg-red-100 text-red-800">
                        {review.violations} violations
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <div className="text-sm text-gray-600">Total Users</div>
                    <div className="font-medium">{review.totalUsers}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Reviewed</div>
                    <div className="font-medium">{review.reviewedUsers}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Due Date</div>
                    <div className="font-medium">{review.dueDate}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Last Update</div>
                    <div className="font-medium">{review.lastUpdate}</div>
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-sm">
                    <span>Review Progress</span>
                    <span>{getReviewProgress(review.reviewedUsers, review.totalUsers).toFixed(1)}%</span>
                  </div>
                  <Progress value={getReviewProgress(review.reviewedUsers, review.totalUsers)} className="h-2" />
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-3 w-3 mr-1" />
                    View Details
                  </Button>
                  {review.status === 'In Progress' && (
                    <Button size="sm">
                      Continue Review
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Automated Review Scheduling */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            User Access Certifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {certificationWorkflows.map((cert) => (
              <div key={cert.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium">{cert.user}</div>
                    <div className="text-sm text-gray-600">{cert.role}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(cert.status)}>
                      {cert.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <div className="text-sm text-gray-600 mb-2">Current Permissions</div>
                    <div className="flex flex-wrap gap-1">
                      {cert.permissions.map((permission, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Last Certified</div>
                      <div className="font-medium">{cert.lastCertified}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Next Due</div>
                      <div className="font-medium">{cert.nextDue}</div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Certifier: <span className="font-medium">{cert.certifier}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Review Access
                    </Button>
                    {cert.status !== 'Current' && (
                      <Button size="sm">
                        Certify
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Violation Remediation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Violation Remediation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {violationRemediation.map((violation) => (
              <div key={violation.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium">{violation.user}</div>
                    <div className="text-sm text-gray-600">Detected: {violation.detected}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getSeverityColor(violation.severity)}>
                      {violation.severity}
                    </Badge>
                    <Badge className={getStatusColor(violation.status)}>
                      {violation.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <div className="text-sm text-gray-600">Violation Type</div>
                    <div className="font-medium">{violation.violation}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Assigned To</div>
                    <div className="font-medium">{violation.assignedTo}</div>
                  </div>
                </div>

                <div className="bg-orange-50 p-3 rounded mb-3">
                  <div className="text-sm text-orange-800">{violation.action}</div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                  {violation.status !== 'Resolved' && (
                    <Button size="sm">
                      Take Action
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Automated Review Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Automated Review Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="font-medium mb-1">Bulk Certification</div>
              <div className="text-sm text-gray-600 mb-3">Certify multiple users at once</div>
              <Button size="sm" className="w-full">
                Start Bulk Review
              </Button>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="font-medium mb-1">Anomaly Detection</div>
              <div className="text-sm text-gray-600 mb-3">Identify unusual access patterns</div>
              <Button size="sm" variant="outline" className="w-full">
                Run Analysis
              </Button>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <div className="font-medium mb-1">Risk Assessment</div>
              <div className="text-sm text-gray-600 mb-3">Calculate access risk scores</div>
              <Button size="sm" variant="outline" className="w-full">
                Calculate Risks
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
