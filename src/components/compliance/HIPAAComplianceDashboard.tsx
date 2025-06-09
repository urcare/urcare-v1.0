
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield,
  FileText,
  Users,
  Lock,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Download
} from 'lucide-react';

export const HIPAAComplianceDashboard = () => {
  const [riskAssessments, setRiskAssessments] = useState([
    {
      id: 'RA001',
      area: 'Electronic Health Records',
      riskLevel: 'Medium',
      score: 85,
      lastAssessed: '2024-01-15',
      findings: 3,
      status: 'Completed'
    },
    {
      id: 'RA002',
      area: 'Data Transmission',
      riskLevel: 'High',
      score: 72,
      lastAssessed: '2024-01-10',
      findings: 7,
      status: 'In Progress'
    },
    {
      id: 'RA003',
      area: 'Access Controls',
      riskLevel: 'Low',
      score: 94,
      lastAssessed: '2024-01-20',
      findings: 1,
      status: 'Completed'
    }
  ]);

  const [violations, setViolations] = useState([
    {
      id: 'V001',
      type: 'Access Violation',
      severity: 'High',
      description: 'Unauthorized access attempt to patient records',
      date: '2024-01-22',
      status: 'Open',
      assignedTo: 'Security Team'
    },
    {
      id: 'V002',
      type: 'Data Retention',
      severity: 'Medium',
      description: 'Patient records retained beyond required period',
      date: '2024-01-21',
      status: 'Investigating',
      assignedTo: 'Compliance Officer'
    }
  ]);

  const auditPreparation = {
    documentsCollected: 847,
    totalRequired: 923,
    policiesReviewed: 45,
    totalPolicies: 52,
    staffTrainingCompleted: 89,
    totalStaff: 112,
    lastAuditDate: '2023-08-15',
    nextAuditDate: '2024-08-15'
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* HIPAA Compliance Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">96.8%</div>
            <div className="text-sm text-gray-600">Overall Compliance</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">3</div>
            <div className="text-sm text-gray-600">Risk Assessments</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">2</div>
            <div className="text-sm text-gray-600">Open Violations</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">187</div>
            <div className="text-sm text-gray-600">Days to Audit</div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Assessment Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Risk Assessment Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {riskAssessments.map((assessment) => (
              <div key={assessment.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-medium">{assessment.area}</div>
                      <div className="text-sm text-gray-600">ID: {assessment.id}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getRiskColor(assessment.riskLevel)}>
                      {assessment.riskLevel} Risk
                    </Badge>
                    <Badge variant={assessment.status === 'Completed' ? 'default' : 'secondary'}>
                      {assessment.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <div className="text-sm text-gray-600">Compliance Score</div>
                    <div className="font-medium">{assessment.score}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Findings</div>
                    <div className="font-medium">{assessment.findings}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Last Assessed</div>
                    <div className="font-medium">{assessment.lastAssessed}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <FileText className="h-3 w-3 mr-1" />
                      View Report
                    </Button>
                  </div>
                </div>

                <Progress value={assessment.score} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Violation Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Violation Tracking Interface
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {violations.map((violation) => (
              <div key={violation.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium">{violation.type}</div>
                    <div className="text-sm text-gray-600">ID: {violation.id}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getSeverityColor(violation.severity)}>
                      {violation.severity}
                    </Badge>
                    <Badge variant="secondary">{violation.status}</Badge>
                  </div>
                </div>

                <div className="text-sm text-gray-700 mb-3">
                  {violation.description}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Date Reported</div>
                    <div className="font-medium">{violation.date}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Assigned To</div>
                    <div className="font-medium">{violation.assignedTo}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Investigate
                    </Button>
                    <Button size="sm">
                      Resolve
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Audit Preparation Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Audit Preparation Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Document Collection</span>
                  <span className="text-sm text-gray-600">
                    {auditPreparation.documentsCollected}/{auditPreparation.totalRequired}
                  </span>
                </div>
                <Progress 
                  value={(auditPreparation.documentsCollected / auditPreparation.totalRequired) * 100} 
                  className="h-2" 
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Policy Reviews</span>
                  <span className="text-sm text-gray-600">
                    {auditPreparation.policiesReviewed}/{auditPreparation.totalPolicies}
                  </span>
                </div>
                <Progress 
                  value={(auditPreparation.policiesReviewed / auditPreparation.totalPolicies) * 100} 
                  className="h-2" 
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Staff Training</span>
                  <span className="text-sm text-gray-600">
                    {auditPreparation.staffTrainingCompleted}/{auditPreparation.totalStaff}
                  </span>
                </div>
                <Progress 
                  value={(auditPreparation.staffTrainingCompleted / auditPreparation.totalStaff) * 100} 
                  className="h-2" 
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm font-medium text-blue-800">Next Audit Date</div>
                <div className="text-lg font-bold text-blue-600">{auditPreparation.nextAuditDate}</div>
                <div className="text-sm text-blue-700">187 days remaining</div>
              </div>

              <div className="flex gap-2">
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Generate Audit Package
                </Button>
                <Button variant="outline">
                  <Search className="h-4 w-4 mr-2" />
                  Review Checklist
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
